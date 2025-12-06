'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useLogClickMutation } from '../../redux/services/activityApi';
import { useLogSearchMutation, useUpdateFiltersMutation } from '../../redux/services/searchApi';
import {
  SearchBar,
  NoResultsMessage,
  FilterButton,
  FilterDrawer,
  Paginacion,
  PaginationInfo,
  PaginationSelector,
  SortCard,
} from '@/Components/Job-offers';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  setSearch,
  setFilters,
  setSortBy,
  setRegistrosPorPagina,
  resetPagination,
  setRating,
  setPaginaActual,
  resetFilters,
  enablePersistence,
} from '@/app/redux/slice/jobOfert';
import { STORAGE_KEYS } from '@/app/redux/features/jobOffers/storage';
import type { FilterState } from '@/app/redux/features/jobOffers/types';
import { getSortValue } from '../../lib/constants/sortOptions';
import {
  useJobOffers,
  useInitialUrlParams,
  useSyncUrlParams,
} from '@/app/redux/features/jobOffers/jobOffersHooks';
import { JobOfferModal } from '@/Components/Job-offers/Job-offer-modal';
import { JobOffersView, type ViewMode } from '@/Components/Job-offers/JobOffersView';
import { ViewModeToggle } from '@/Components/Job-offers/ViewModeToggle';
import { useTranslations } from 'next-intl';
import type { JobOfferData, AdaptedJobOffer } from '@/types/jobOffers';

const SCROLL_POSITION_KEY = 'jobOffers_scrollPosition';

export default function JobOffersPage() {
  const t = useTranslations('jobOffers');
  const dispatch = useAppDispatch();

  useInitialUrlParams();

  const { offers, total, isLoading } = useJobOffers();

  const {
    sortBy,
    search,
    paginaActual,
    totalPages,
    registrosPorPagina,
    error: reduxError,
    filters,
    rating,
  } = useAppSelector((state) => state.jobOfert);

  useSyncUrlParams();

  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('visitor');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('servineo_user');
      if (storedUser) {
        try {
          const userObj = JSON.parse(storedUser);
          console.log('User object from localStorage:', userObj);
          const id = userObj.id || userObj._id || userObj.userId || '';
          const role = userObj.role || 'visitor';
          setUserId(id);
          setUserRole(role);
          console.log('Extracted user ID:', id, 'Role:', role);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          setUserRole('visitor');
        }
      } else {
        console.warn('No servineo_user found in localStorage');
        setUserRole('visitor');
      }
    }
  }, []);

  const [logSearch] = useLogSearchMutation();
  const [updateFilters] = useUpdateFiltersMutation();
  const [logClick] = useLogClickMutation();

  const previousSearchQueryRef = useRef<string>('');
  const previousFiltersRef = useRef<FilterState>(filters);
  const isInitialMountRef = useRef<boolean>(true);
  const filterCounterRef = useRef<number>(1);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const scrollRestoredRef = useRef(false);
  const pageBeforeFilter = useRef<number>(1);
  const hasActiveFilters = useRef<boolean>(false);

  // Ref para almacenar el número real de resultados basado en la paginación
  const actualSearchCountRef = useRef<number>(0);

  // Ref para verificar si ya hemos enviado la búsqueda con el conteo correcto
  const hasSentSearchRef = useRef<boolean>(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedOffer, setSelectedOffer] = useState<AdaptedJobOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para calcular el número de resultados basado en la paginación
  const calculateSearchCount = useCallback(() => {
    // El total de useJobOffers ya está filtrado por búsqueda y filtros
    // Asegurar que no estemos en estado de carga y que total sea un número válido
    if (!isLoading && typeof total === 'number' && total >= 0) {
      return total;
    }
    return 0;
  }, [isLoading, total]);

  // Función para convertir "De (A-C)" a "A-C"
  const formatRangeValue = useCallback((range: string): string => {
    // Remover "De (" del inicio y ")" del final, luego extraer solo el rango
    if (range.startsWith('De (')) {
      return range.replace('De (', '').replace(')', '');
    }
    return range;
  }, []);

  const getFixerNameValue = useCallback((): string => {
    // Usar filters.range directamente para obtener los rangos aplicados
    if (!filters.range || filters.range.length === 0) {
      return 'not_applied';
    }

    // Convertir cada rango de "De (A-C)" a "A-C" y unirlos
    const formattedRanges = filters.range.map(formatRangeValue);
    return formattedRanges.join(', ');
  }, [filters, formatRangeValue]);

  const getCityValue = useCallback((): string => {
    if (!filters.city || (Array.isArray(filters.city) && filters.city.length === 0)) {
      return 'not_applied';
    }
    if (Array.isArray(filters.city)) {
      return filters.city.join(', ');
    }
    return filters.city;
  }, [filters]);

  const getJobTypeValue = useCallback((): string => {
    if (!filters.category || filters.category.length === 0) {
      return 'not_applied';
    }
    return filters.category.join(', ');
  }, [filters]);

  const adaptJobOffer = useCallback((offer: JobOfferData): AdaptedJobOffer => {
    return {
      _id: offer._id,
      fixerId: offer.fixerId,
      name: offer.fixerName,
      title: offer.title,
      description: offer.description,
      tags: offer.tags || [],
      phone: offer.contactPhone,
      photos: offer.photos || [],
      services: offer.category ? [offer.category] : [],
      price: offer.price,
      createdAt: offer.createdAt instanceof Date ? offer.createdAt : new Date(offer.createdAt),
      city: offer.city,
    };
  }, []);

  // Función para enviar una búsqueda pendiente
  const sendPendingSearch = useCallback(async () => {
    // Verificar que no se haya enviado ya y que haya una query
    if (!previousSearchQueryRef.current || hasSentSearchRef.current) {
      return;
    }

    // Marcar como enviado inmediatamente para evitar duplicados
    hasSentSearchRef.current = true;

    // Usar el conteo actualizado de resultados desde el ref
    const searchCount = actualSearchCountRef.current;
    const query = previousSearchQueryRef.current;

    // Obtener los valores actuales de los filtros en el momento de enviar
    const fixerNameValue = getFixerNameValue();
    const cityValue = getCityValue();
    const jobTypeValue = getJobTypeValue();

    const searchData = {
      user_type: userRole,
      search_query: query,
      search_type: 'search_box',
      filters: {
        filter_1: {
          fixer_name: fixerNameValue,
          city: cityValue,
          job_type: jobTypeValue,
          search_count: searchCount, // Usar el conteo actualizado
        },
      },
    };

    try {
      console.log('=== REGISTRANDO BÚSQUEDA ===');
      console.log('Búsqueda:', query);
      console.log('Filtros aplicados:', {
        fixer_name: fixerNameValue,
        city: cityValue,
        job_type: jobTypeValue,
      });
      console.log('Resultados encontrados:', searchCount);
      console.log('Datos completos:', JSON.stringify(searchData, null, 2));
      await logSearch(searchData).unwrap();
      console.log('✓ Búsqueda registrada exitosamente');
    } catch (error) {
      console.error('✗ Error al registrar búsqueda:', error);
      // Si hay error, permitir reintento
      hasSentSearchRef.current = false;
    }
  }, [userRole, logSearch, getFixerNameValue, getCityValue, getJobTypeValue]);

  // Efecto único para registrar la búsqueda cuando los resultados estén listos
  useEffect(() => {
    // Solo registrar si:
    // 1. No está cargando
    // 2. Hay una búsqueda pendiente (previousSearchQueryRef no está vacío)
    // 3. Aún no se ha enviado (hasSentSearchRef es false)
    // 4. Los resultados están disponibles (total no es undefined/null)
    if (
      !isLoading &&
      previousSearchQueryRef.current &&
      !hasSentSearchRef.current &&
      total !== undefined &&
      total !== null
    ) {
      const currentCount = calculateSearchCount();

      // Actualizar el conteo actual
      actualSearchCountRef.current = currentCount;

      // Pequeño delay para asegurar que el conteo esté estable
      const timeoutId = setTimeout(async () => {
        // Verificar nuevamente que no se haya enviado mientras esperábamos
        // y que el total siga siendo válido
        if (
          !hasSentSearchRef.current &&
          previousSearchQueryRef.current &&
          total !== undefined &&
          total !== null
        ) {
          const finalCount = calculateSearchCount();
          actualSearchCountRef.current = finalCount;

          console.log('Registrando búsqueda - Conteo final:', finalCount, 'Total:', total);
          await sendPendingSearch();
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, calculateSearchCount, total, sendPendingSearch, offers]);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Siempre actualizar la búsqueda, incluso si no cambió, para registrar el clic
      const trimmedQuery = query.trim();
      dispatch(setSearch(trimmedQuery));
      dispatch(resetPagination());

      filterCounterRef.current = 1;

      // Resetear el flag para permitir registrar la búsqueda cuando los resultados estén listos
      previousSearchQueryRef.current = trimmedQuery;
      hasSentSearchRef.current = false;

      console.log('Búsqueda iniciada:', trimmedQuery, 'Esperando resultados...');
      // La búsqueda se registrará automáticamente cuando los resultados estén listos en el useEffect
    },
    [dispatch],
  );

  // Ref para rastrear si hay un cambio de filtros pendiente de registrar
  const pendingFilterChangeRef = useRef<boolean>(false);

  // Efecto para detectar cambios en filtros
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      previousFiltersRef.current = { ...filters };
      return;
    }

    const currentFilters = filters as unknown as Record<string, unknown>;
    const previousFilters = previousFiltersRef.current as unknown as Record<string, unknown>;

    const compareFilterValues = (
      prev: Record<string, unknown>,
      curr: Record<string, unknown>,
      key: string,
    ) => {
      const prevValue = prev[key];
      const currValue = curr[key];

      if (Array.isArray(prevValue) && Array.isArray(currValue)) {
        return JSON.stringify([...prevValue].sort()) !== JSON.stringify([...currValue].sort());
      }

      return prevValue !== currValue;
    };

    // Solo detectar cambios en los filtros relevantes
    const filterKeys = ['city', 'category', 'range'];
    const filtersChanged = filterKeys.some((key) =>
      compareFilterValues(previousFilters, currentFilters, key),
    );

    if (filtersChanged) {
      // Actualizar los filtros previos
      previousFiltersRef.current = { ...filters };

      // Marcar que hay un cambio de filtros pendiente
      pendingFilterChangeRef.current = true;

      console.log('=== CAMBIO DE FILTROS DETECTADO ===');
      console.log('Filtros anteriores:', previousFilters);
      console.log('Filtros nuevos:', currentFilters);
    }
  }, [filters]);

  // Efecto separado para enviar los filtros cuando los resultados estén listos
  useEffect(() => {
    // Solo proceder si hay un cambio de filtros pendiente
    if (!pendingFilterChangeRef.current) {
      return;
    }

    // Si está cargando, esperar a que termine
    if (isLoading) {
      console.log('Esperando a que termine la carga antes de registrar filtros...');
      return;
    }

    // Si el total no está disponible, esperar
    if (total === undefined || total === null) {
      console.log('Esperando total antes de registrar filtros...', { total });
      return;
    }

    // Verificar si hay búsqueda asociada (necesaria para actualizar filtros)
    const searchQuery = previousSearchQueryRef.current || search || '';

    if (!searchQuery || searchQuery.trim() === '') {
      console.log('⚠ No hay búsqueda asociada para actualizar filtros');
      pendingFilterChangeRef.current = false;
      return;
    }

    // Usar un delay para asegurar que los datos estén completamente actualizados
    // después de que termine la carga
    const timeoutId = setTimeout(async () => {
      // Verificar nuevamente antes de enviar
      if (isLoading || total === undefined || total === null) {
        console.log('Cancelando envío - estado no válido:', { isLoading, total });
        return;
      }

      // Marcar como procesado antes de enviar para evitar duplicados
      pendingFilterChangeRef.current = false;

      filterCounterRef.current++;

      // Calcular el conteo actual basado en el total de resultados
      // Este total ya refleja los filtros aplicados
      const searchCount = calculateSearchCount();

      // Obtener los valores de los filtros actuales en el momento exacto de enviar
      const fixerNameValue = getFixerNameValue();
      const cityValue = getCityValue();
      const jobTypeValue = getJobTypeValue();

      console.log('=== REGISTRANDO FILTROS ===');
      console.log('Búsqueda asociada:', searchQuery);
      console.log('Filtros aplicados:', {
        fixer_name: fixerNameValue,
        city: cityValue,
        job_type: jobTypeValue,
      });
      console.log('Estado actual:', {
        searchCount,
        total,
        isLoading,
        offersCount: Array.isArray(offers) ? offers.length : 0,
      });

      const filterData = {
        filters: {
          fixer_name: fixerNameValue,
          city: cityValue,
          job_type: jobTypeValue,
          search_count: searchCount, // Registrar el número real de resultados filtrados
        },
      };

      try {
        console.log(
          `📤 Enviando FILTRO para búsqueda: "${searchQuery}"`,
          JSON.stringify(filterData, null, 2),
        );

        await updateFilters(filterData).unwrap();
        console.log(`✅ Filtro registrado exitosamente. Resultados encontrados: ${searchCount}`);
      } catch (error) {
        console.error('❌ Error al registrar filtro:', error);
        // Reintentar si hay error
        pendingFilterChangeRef.current = true;
      }
    }, 800); // Delay suficiente para asegurar que los resultados estén completamente actualizados

    return () => clearTimeout(timeoutId);
  }, [
    filters,
    search,
    total,
    isLoading,
    offers,
    updateFilters,
    calculateSearchCount,
    getFixerNameValue,
    getCityValue,
    getJobTypeValue,
  ]);

  const handleCardClick = useCallback(
    async (offer: JobOfferData) => {
      const adaptedOffer = adaptJobOffer(offer);
      setSelectedOffer(adaptedOffer);
      setIsModalOpen(true);

      if (!userId) {
        console.warn('User ID no disponible, no se registró el click');
        return;
      }

      const activityData = {
        userId: userId,
        date: new Date().toISOString(),
        role: userRole,
        type: 'click',
        metadata: {
          button: 'job_offer',
          jobTitle: adaptedOffer.title || 'Sin título',
          jobId: adaptedOffer._id,
        },
        timestamp: new Date().toISOString(),
      };

      try {
        await logClick(activityData).unwrap();
        console.log('Click registrado:', adaptedOffer.title);
      } catch (error) {
        console.error('Error al registrar clic:', error);
      }
    },
    [userId, userRole, logClick, adaptJobOffer],
  );

  // Resto del código permanece igual...
  useEffect(() => {
    if (!isLoading && totalPages > 0) {
      const params = new URLSearchParams(window.location.search);
      const pageParam = Number(params.get('page') || 1);

      let correctedPage = pageParam;

      if (pageParam < 1 || isNaN(pageParam)) {
        correctedPage = 1;
      } else if (pageParam > totalPages) {
        correctedPage = totalPages;
      }

      if (correctedPage !== pageParam) {
        params.set('page', correctedPage.toString());
        window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
        dispatch(setPaginaActual(correctedPage));
      }
    }
  }, [isLoading, totalPages, dispatch]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      if (params.toString() === '' && search !== '') {
        let hasSavedSearch = false;
        try {
          hasSavedSearch = !!window.localStorage.getItem(STORAGE_KEYS.SEARCH);
        } catch (e) {
          hasSavedSearch = false;
          console.error('Error accessing localStorage:', e);
        }

        if (!hasSavedSearch) {
          console.log('Navegación directa detectada, limpiando búsqueda guardada');
          dispatch(setSearch(''));
          previousSearchQueryRef.current = '';
        }
      }
    }
  }, [dispatch, search]);

  useEffect(() => {
    const saveScrollPosition = () => {
      try {
        sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
      } catch {}
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && Array.isArray(offers) && offers.length > 0 && !scrollRestoredRef.current) {
      try {
        const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
        if (savedPosition) {
          const position = parseInt(savedPosition, 10);
          if (!isNaN(position)) {
            setTimeout(() => {
              window.scrollTo(0, position);
              scrollRestoredRef.current = true;
              sessionStorage.removeItem(SCROLL_POSITION_KEY);
            }, 100);
          }
        }
      } catch {}
    }
  }, [isLoading, offers]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const hdr = document.querySelector('header');
      const h = hdr ? (hdr as HTMLElement).getBoundingClientRect().height : 0;
      if (stickyRef.current) {
        stickyRef.current.style.top = `${h}px`;
        stickyRef.current.style.zIndex = '40';
      }
    };

    update();
    window.addEventListener('resize', update);

    const hdrEl = document.querySelector('header');
    const mo = hdrEl ? new MutationObserver(update) : null;
    if (mo && hdrEl) mo.observe(hdrEl, { attributes: true, childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', update);
      if (mo) mo.disconnect();
    };
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleRegistrosPorPaginaChange = useCallback(
    (valor: number) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(setRegistrosPorPagina(valor));
    },
    [dispatch],
  );

  const handleFiltersApply = useCallback(
    (appliedFilters: FilterState) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const hasFilters =
        appliedFilters.range.length > 0 ||
        (Array.isArray(appliedFilters.city)
          ? appliedFilters.city.length > 0
          : !!appliedFilters.city) ||
        appliedFilters.category.length > 0;

      if (hasFilters && !hasActiveFilters.current) {
        pageBeforeFilter.current = paginaActual;
        hasActiveFilters.current = true;
      }

      if (!hasFilters) {
        hasActiveFilters.current = false;
      }

      dispatch(setFilters(appliedFilters));
      dispatch(resetPagination());
    },
    [dispatch, paginaActual],
  );

  const handleSortChange = useCallback(
    (option: string) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const backendSort = getSortValue(option);
      // Cuando se cambia el orden, resetear la paginación a la página 1
      dispatch(setSortBy(backendSort));
      dispatch(resetPagination());
    },
    [dispatch],
  );

  const handleResetFilters = useCallback(() => {
    const pageToRestore = hasActiveFilters.current ? pageBeforeFilter.current : 1;
    hasActiveFilters.current = false;

    dispatch(resetFilters());

    setTimeout(() => {
      dispatch(enablePersistence());
      dispatch(setPaginaActual(pageToRestore));
    }, 0);
  }, [dispatch]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(setPaginaActual(newPage));
    },
    [dispatch],
  );

  const handleRatingChange = useCallback(
    (rating: number | null) => {
      scrollRestoredRef.current = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const hasRatingFilter = rating != null;
      if (hasRatingFilter && !hasActiveFilters.current) {
        pageBeforeFilter.current = paginaActual;
        hasActiveFilters.current = true;
      }

      if (!hasRatingFilter) {
        hasActiveFilters.current = false;
      }

      dispatch(setRating(rating));
      dispatch(resetPagination());
    },
    [dispatch, paginaActual],
  );

  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const processedOffers = useMemo(() => {
    return offers;
  }, [offers]);

  return (
    <>
      <h1 className='mt-20 sm:mt-24 md:mt-28 lg:mt-32 mb-0 text-center text-xl sm:text-2xl md:text-3xl font-bold pt-3 px-3'>
        {t('pageTitle')}
      </h1>

      <div
        ref={stickyRef}
        className={`w-full mx-auto px-3 sm:px-4 md:px-6 lg:max-w-5xl sticky top-0 bg-white py-3 shadow-md ${
          isDrawerOpen ? 'z-10' : 'z-50'
        }`}
      >
        <div className='flex gap-2'>
          <FilterButton onClick={toggleDrawer} />
          <SearchBar onSearch={handleSearchSubmit} />
        </div>

        {!isLoading && Array.isArray(offers) && offers.length > 0 && (
          <div className='flex flex-col gap-2 mt-2'>
            <div className='flex justify-between items-center gap-2'>
              <div className='w-auto'>
                <SortCard value={sortBy} onSelect={handleSortChange} />
              </div>

              {/* Mobile view toggle */}
              <ViewModeToggle
                viewMode={viewMode}
                onChange={handleViewModeChange}
                variant='mobile'
                className='flex lg:hidden'
              />

              {/* Desktop view toggle */}
              <ViewModeToggle
                viewMode={viewMode}
                onChange={handleViewModeChange}
                variant='desktop'
                className='hidden lg:flex absolute left-1/2 transform -translate-x-1/2'
              />

              <div className='hidden lg:block w-auto'>
                <PaginationSelector
                  registrosPorPagina={registrosPorPagina}
                  onChange={handleRegistrosPorPaginaChange}
                />
              </div>
            </div>

            <div className='flex justify-center lg:hidden'>
              <PaginationSelector
                registrosPorPagina={registrosPorPagina}
                onChange={handleRegistrosPorPaginaChange}
              />
            </div>
          </div>
        )}
      </div>

      <main className='px-4 sm:px-6 md:px-12 lg:px-24'>
        {reduxError && (
          <div className='text-red-500 text-center mb-4 p-3 bg-red-100 rounded'>{reduxError}</div>
        )}

        {isLoading && (
          <div className='text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded'>
            {t('loading', { default: 'Cargando ofertas...' })}
          </div>
        )}

        <FilterDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onFiltersApply={handleFiltersApply}
          onRatingChange={handleRatingChange}
          onReset={handleResetFilters}
        />

        {!isLoading && Array.isArray(offers) && offers.length > 0 && (
          <div className='w-full max-w-5xl mx-auto mb-4'>
            <div className='flex justify-center'>
              <PaginationInfo
                paginaActual={paginaActual}
                registrosPorPagina={registrosPorPagina}
                totalRegistros={total}
              />
            </div>
          </div>
        )}

        <div className='w-full max-w-5xl mx-auto'>
          {!isLoading && Array.isArray(offers) && offers.length > 0 ? (
            <JobOffersView
              offers={processedOffers}
              viewMode={viewMode}
              onOfferClick={handleCardClick}
              search={search}
            />
          ) : !isLoading ? (
            <NoResultsMessage search={search} />
          ) : null}
        </div>

        {!isLoading && Array.isArray(offers) && offers.length > 0 && viewMode !== 'map' && (
          <div className='mt-8 mb-24 flex justify-center'>
            <Paginacion
              paginaActual={paginaActual}
              registrosPorPagina={registrosPorPagina}
              totalRegistros={total}
              onChange={handlePageChange}
            />
          </div>
        )}
      </main>

      <JobOfferModal offer={selectedOffer} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
