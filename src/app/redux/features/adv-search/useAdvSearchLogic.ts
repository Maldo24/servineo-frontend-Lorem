import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/redux/hooks';
import { useLazyGetOffersQuery } from '@/app/redux/services/jobOffersApi';
import { parsePriceRange } from '@/app/redux/features/jobOffers/parsers';

interface FilterStateLocal {
  range: string[];
  city: string[];
  category: string[];
  tags: string[];
  priceRanges: string[];
  minPrice: number | null;
  maxPrice: number | null;
}

type UpdateParams = {
  newRanges?: string[];
  newCity?: string[];
  newJobs?: string[];
  newCategories?: string[];
  newPriceRanges?: string[];
  newSearchQuery?: string;
  newPriceKey?: string;
  newTitleOnly?: boolean;
  newExactWords?: boolean;
};

/**
 * Hook principal para la lógica de Advanced Search
 * Maneja todo el estado local y la interacción con RTK Query
 */
export default function useAdvSearchLogic() {
  const [searchQuery, setSearchQuery] = useState('');
  const [titleOnly, setTitleOnlyState] = useState(false);
  const [exactWords, setExactWords] = useState(false);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    fixer: false,
    ciudad: false,
    trabajo: false,
    categorias: false,
    precio: false,
  });

  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriceKey, setSelectedPriceKey] = useState<string>('');
  const [resultsCount, setResultsCount] = useState<number | null>(null);

  // Date filter state: 'recent' | 'oldest' | 'specific'
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('specific');
  const [selectedSpecificDate, setSelectedSpecificDate] = useState<Date | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const totalRegistros = useAppSelector((s) => s.jobOfert.totalRegistros);
  const storeLoading = useAppSelector((s) => s.jobOfert.loading);
  const router = useRouter();
  const skipSyncRef = useRef<boolean | null>(null);
  const [clearSignal, setClearSignal] = useState<number>(0);

  // ✅ RTK Query: lazy query para el contador de resultados
  const [triggerGetOffers, { data: offersData, isLoading: isQueryLoading }] =
    useLazyGetOffersQuery();

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateSearchOnStateChange = ({
    newRanges = selectedRanges,
    newCity = selectedCity,
    newJobs = selectedJobs,
    newCategories = selectedCategories,
    newPriceRanges = selectedPriceRanges,
    newSearchQuery = searchQuery,
    newPriceKey = selectedPriceKey,
  }: UpdateParams = {}) => {
    if (
      !newSearchQuery &&
      newRanges.length === 0 &&
      newCity.length === 0 &&
      newJobs.length === 0 &&
      newCategories.length === 0 &&
      newPriceRanges.length === 0
    ) {
      setResultsCount(0);
      return;
    }

    const { minPrice, maxPrice } = parsePriceRange(newPriceKey ?? '');

    const currentFilters: FilterStateLocal = {
      range: newRanges,
      city: newCity,
      category: newJobs,
      tags: newCategories,
      priceRanges: newPriceRanges,
      minPrice,
      maxPrice,
    };

    // local optimistic state update
    setResultsCount(null);

    return currentFilters;
  };

  const handleRangeChange = (range: string) => {
    setSelectedRanges((prev) => {
      const newRanges = prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range];
      updateSearchOnStateChange({ newRanges });
      return newRanges;
    });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity((prev) => {
      const newCity = prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city];
      updateSearchOnStateChange({ newCity });
      return newCity;
    });
  };

  const handleJobChange = (job: string) => {
    setSelectedJobs((prev) => {
      const newJobs = prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job];
      updateSearchOnStateChange({ newJobs });
      return newJobs;
    });
  };

  const handleDropdownChange = (filters: { categories: string[] }) => {
    const newTags = Array.isArray(filters.categories) ? filters.categories : [];
    setSelectedTags(newTags);
    updateSearchOnStateChange({ newCategories: newTags });
  };

  const handlePriceRangeChange = (filters: { priceRanges: string[]; priceKey?: string }) => {
    const newPriceRanges = Array.isArray(filters.priceRanges) ? filters.priceRanges : [];
    setSelectedPriceRanges(newPriceRanges);
    if (filters.priceKey && typeof filters.priceKey === 'string') {
      setSelectedPriceKey(filters.priceKey);
      updateSearchOnStateChange({ newPriceRanges, newPriceKey: filters.priceKey });
    } else {
      setSelectedPriceKey('');
      updateSearchOnStateChange({ newPriceRanges, newPriceKey: '' });
    }
  };

  const fetchGlobalTotal = () => {
    // ✅ RTK Query: trigger query para obtener el total global
    triggerGetOffers({
      search: '',
      filters: { range: [], city: [], category: [], tags: [], minPrice: null, maxPrice: null },
      sortBy: 'recent',
      page: 1,
      limit: 1,
    });
  };

  // On mount: restore state from URL if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    if (!sp.toString()) return;

    if (skipSyncRef) skipSyncRef.current = true;

    const search = sp.get('search');
    if (search != null) setSearchQuery(search);
    const titleOnlyP = sp.get('titleOnly');
    if (titleOnlyP != null) setTitleOnlyState(titleOnlyP === 'true');
    const exactP = sp.get('exact');
    if (exactP != null) setExactWords(exactP === 'true');

    const ranges = sp.getAll('range');
    if (ranges.length) setSelectedRanges(ranges);

    const cityRaw = sp.get('city');
    if (cityRaw != null) {
      const cities = cityRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (cities.length) setSelectedCity(cities);
    }

    const categoriesFromAll = sp.getAll('category') || [];
    let urlCategory: string[] = [];
    if (categoriesFromAll.length) {
      urlCategory = categoriesFromAll
        .flatMap((s) => (typeof s === 'string' ? s.split(',') : []))
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      const cat = sp.get('category');
      if (cat != null)
        urlCategory = cat
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
    }
    if (urlCategory.length) setSelectedJobs(urlCategory);

    const tagsFromAll = sp.getAll('tags') || [];
    let urlTags: string[] = [];
    if (tagsFromAll.length) {
      urlTags = tagsFromAll
        .flatMap((s) => (typeof s === 'string' ? s.split(',') : []))
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      const t = sp.get('tags');
      if (t != null)
        urlTags = t
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
    }
    if (urlTags.length) setSelectedTags(urlTags);

    const min = sp.get('minPrice');
    const max = sp.get('maxPrice');
    if (min || max) setSelectedPriceKey(`${min ?? ''}${min && max ? ' - ' : ''}${max ?? ''}`);

    const sort = sp.get('sortBy') ?? sp.get('sort');
    if (sort === 'recent') setSelectedDateFilter('recent');
    else if (sort === 'oldest') setSelectedDateFilter('oldest');
    else {
      const date = sp.get('date');
      if (date) {
        setSelectedDateFilter('specific');
        const d = new Date(date);
        if (!Number.isNaN(d.getTime())) setSelectedSpecificDate(d);
      }
    }

    const rating = sp.get('rating');
    if (rating != null) {
      const r = Number(rating);
      if (!Number.isNaN(r)) {
        // Limitar el rating entre 1 y 5
        const clampedRating = Math.min(5, Math.max(1, r));
        setSelectedRating(clampedRating);
      }
    }

    const shouldOpenFixer = ranges.length > 0;
    const shouldOpenCiudad = !!cityRaw;
    const shouldOpenTrabajo = !!(urlCategory && urlCategory.length);
    const shouldOpenCategorias = !!(urlTags && urlTags.length);
    const shouldOpenPrecio = !!(min || max);

    setOpenSections((prev) => ({
      ...prev,
      fixer: shouldOpenFixer || prev.fixer,
      ciudad: shouldOpenCiudad || prev.ciudad,
      trabajo: shouldOpenTrabajo || prev.trabajo,
      categorias: shouldOpenCategorias || prev.categorias,
      precio: shouldOpenPrecio || prev.precio,
    }));
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    skipSyncRef.current = true;
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (titleOnly) params.set('titleOnly', 'true');
    if (exactWords) params.set('exact', 'true');
    selectedRanges.forEach((r) => params.append('range', r));
    if (selectedCity.length) params.set('city', selectedCity.join(','));
    if (selectedJobs.length) params.set('category', selectedJobs.join(','));
    if (selectedTags.length) params.set('tags', selectedTags.join(','));
    const { minPrice, maxPrice } = parsePriceRange(selectedPriceKey);

    if (selectedDateFilter === 'recent') {
      params.set('sortBy', 'recent');
    } else if (selectedDateFilter === 'oldest') {
      params.set('sortBy', 'oldest');
    } else if (selectedDateFilter === 'specific' && selectedSpecificDate) {
      const y = selectedSpecificDate.getFullYear();
      const m = String(selectedSpecificDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedSpecificDate.getDate()).padStart(2, '0');
      params.set('date', `${y}-${m}-${d}`);
    }
    if (minPrice != null) params.set('minPrice', String(minPrice));
    if (maxPrice != null) params.set('maxPrice', String(maxPrice));
    // Limitar el rating entre 1 y 5 al hacer búsqueda
    if (selectedRating != null) {
      const clampedRating = Math.min(5, Math.max(1, selectedRating));
      params.set('rating', String(clampedRating));
    }
    params.set('page', '1');
    params.set('limit', '10');

    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem('fromAdv', 'true');
      } catch {
        // ignore
      }
      params.set('fromAdv', 'true');

      try {
        const state = {
          search: searchQuery,
          titleOnly,
          exact: exactWords,
          selectedRanges,
          selectedCity,
          selectedJobs,
          selectedTags,
          selectedPriceKey,
          selectedDateFilter,
          selectedSpecificDate: selectedSpecificDate ? selectedSpecificDate.toISOString() : null,
          selectedRating,
        };
        window.sessionStorage.setItem('advSearch_state', JSON.stringify(state));
      } catch {
        // ignore
      }

      window.location.href = `/resultsAdvSearch?${params.toString()}`;
    } else {
      params.set('fromAdv', 'true');
      router.push(`/resultsAdvSearch?${params.toString()}`);
    }
  };

  // ✅ Initial fetch: global total usando RTK Query
  useEffect(() => {
    triggerGetOffers({
      search: '',
      filters: { range: [], city: [], category: [], tags: [], minPrice: null, maxPrice: null },
      sortBy: 'recent',
      page: 1,
      limit: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Debounced fetch cuando cambian los filtros usando RTK Query
  useEffect(() => {
    const { minPrice, maxPrice } = parsePriceRange(selectedPriceKey);
    const apiFilters = {
      range: selectedRanges,
      city: selectedCity,
      category: selectedJobs,
      tags: selectedTags,
      minPrice,
      maxPrice,
    };

    let dateParam: string | undefined = undefined;
    let sortParam = 'recent';
    if (selectedDateFilter === 'recent') sortParam = 'recent';
    else if (selectedDateFilter === 'oldest') sortParam = 'oldest';
    else if (selectedDateFilter === 'specific' && selectedSpecificDate) {
      const y = selectedSpecificDate.getFullYear();
      const m = String(selectedSpecificDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedSpecificDate.getDate()).padStart(2, '0');
      dateParam = `${y}-${m}-${d}`;
    }

    const t = window.setTimeout(() => {
      triggerGetOffers({
        search: searchQuery ?? '',
        filters: apiFilters,
        sortBy: sortParam,
        date: dateParam,
        rating: selectedRating ?? undefined,
        page: 1,
        limit: 1,
        titleOnly: titleOnly ?? false,
        exact: exactWords ?? false,
      });
    }, 150);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    selectedRanges,
    selectedCity,
    selectedJobs,
    selectedTags,
    selectedPriceRanges,
    selectedPriceKey,
    titleOnly,
    exactWords,
    selectedDateFilter,
    selectedSpecificDate,
    selectedRating,
  ]);

  // ✅ Actualizar resultsCount cuando llega la respuesta de RTK Query
  useEffect(() => {
    if (offersData) {
      setResultsCount(offersData.total);
    }
  }, [offersData]);

  return {
    // state
    searchQuery,
    titleOnly,
    exactWords,
    openSections,
    selectedRanges,
    selectedCity,
    selectedJobs,
    selectedCategories,
    selectedPriceRanges,
    selectedTags,
    selectedPriceKey,
    resultsCount,
    loading: isQueryLoading,
    totalRegistros,
    storeLoading,
    clearSignal,
    skipSyncRef,
    // setters / handlers
    setSearchQuery,
    setTitleOnly: setTitleOnlyState,
    setExactWords,
    toggleSection,
    handleRangeChange,
    handleCityChange,
    handleJobChange,
    handleDropdownChange,
    handlePriceRangeChange,
    handleSearch,
    setClearSignal,
    updateSearchOnStateChange,
    // expose specific setters used by page clear action
    setSelectedRanges,
    setSelectedCity,
    setSelectedJobs,
    setSelectedCategories,
    setSelectedPriceRanges,
    setSelectedPriceKey,
    setResultsCount,
    // date filter API
    selectedDateFilter,
    setSelectedDateFilter,
    selectedSpecificDate,
    setSelectedSpecificDate,
    // rating
    selectedRating,
    setSelectedRating,
    fetchGlobalTotal,
  };
}
