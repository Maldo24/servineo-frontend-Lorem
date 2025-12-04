// src/Components/Job-offers/Search/SearchBar.tsx
'use client';

import React from 'react';
import { Input } from '@/Components/ui/input';
import { SearchIcon } from './SearchIcon';
import { ClearButton } from './ClearButton';
import { SearchButton } from './SearchButton';
import { AdvancedSearchButton } from './AdvancedSearchButton';
import { FilterButton } from '../Filter/FilterButton';
import { validateSearch } from '@/app/lib/validations/search.validator';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { useTranslations } from 'next-intl';
import { useSearchHistory } from '@/app/redux/features/searchHistory/useSearchHistory';
import { useSearchSuggestions } from '@/app/redux/features/searchHistory/useSearchSuggestions';
import { useSearchKeyboard } from '@/app/redux/features/searchHistory/useSearchKeyboard';
import { useSearchTouch } from '@/app/redux/features/searchHistory/useSearchTouch';
import { SearchDropdown } from '@/Components/Shared/SearchDropdown';
import { usePathname } from 'next/navigation'; // 👈 TU ÚNICA IMPORTACIÓN NUEVA
import { useJobTypeAutoMatch } from '@/lib/useJobTypeAutoMatch';
import { setFilters } from '@/app/redux/slice/jobOfert';
import { useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter?: () => void;
}

export const SearchBar = ({ onSearch, onFilter }: SearchBarProps) => {
  const t = useTranslations('search');
  const pathname = usePathname(); // 👈 TU LÍNEA 1
  const dispatch = useAppDispatch();
  const { findMatchingJobType, findMatchingCity } = useJobTypeAutoMatch();

  const searchFromStore = useAppSelector((state) => state.jobOfert.search);
  const filtersFromStore = useAppSelector((state) => state.jobOfert.filters);

  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState<number>(-1);
  const [longPressedItem, setLongPressedItem] = React.useState<string | null>(null);
  const [previewValue, setPreviewValue] = React.useState<string | null>(null);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value !== '') {
      const { isValid, error } = validateSearch(value);
      setError(isValid ? undefined : error);
    }
  }, [value]);

  const prevSearchFromStore = React.useRef(searchFromStore);

  // 👇 TU BLOQUE COMPLETO (LÍNEAS 2-6)
  const currentLanguage = React.useMemo(() => {
    const pathSegments = (pathname || '').split('/').filter(Boolean);
    const langSegment = pathSegments[0];
    return ['en', 'es'].includes(langSegment) ? langSegment : 'es';
  }, [pathname]);

  // Hooks personalizados
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory({
    useBackend: true,
  });

  const { suggestions } = useSearchSuggestions(value, {
    enabled: value.trim().length > 0,
    minLength: 1,
    debounceMs: 300,
    maxResults: 6,
    language: currentLanguage, // 👈 TU LÍNEA 7 (única modificación en su código)
  });

  // Restaurar desde Redux/localStorage al cargar
  React.useEffect(() => {
    if (searchFromStore) {
      setValue(searchFromStore);
    }
  }, [searchFromStore]);

  // Sincronizar con Redux
  React.useEffect(() => {
    if (searchFromStore !== prevSearchFromStore.current && searchFromStore !== value) {
      setValue(searchFromStore);
      setError(undefined);
      prevSearchFromStore.current = searchFromStore;
    }
  }, [searchFromStore, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length >= 100) {
      // asegura que no pase de 100
      const trimmed = newValue.slice(0, 100);
      setPreviewValue(null);
      setValue(trimmed);
      setError('Límite máximo de 100 caracteres.');
      return;
    }
    setValue(newValue);
    setPreviewValue(null);
    // Abrir el dropdown al escribir para que las sugerencias vuelvan a mostrarse
    setIsOpen(true);
    const { isValid, error } = validateSearch(newValue);
    setError(isValid ? undefined : error);
    setHighlighted(-1);
  };

  const handleClear = () => {
    setValue('');
    setError(undefined);
    onSearch('');
    // Limpia el automarcado del filtro cuando se borra la búsqueda
    if (filtersFromStore.isAutoSelectedCategory || filtersFromStore.isAutoSelectedCity) {
      dispatch(
        setFilters({
          ...filtersFromStore,
          category: filtersFromStore.isAutoSelectedCategory ? [] : filtersFromStore.category,
          city: filtersFromStore.isAutoSelectedCity ? [] : filtersFromStore.city,
          isAutoSelectedCategory: false,
          isAutoSelectedCity: false,
        }),
      );
    }
  };

  /**
   * Auto-detecta si la búsqueda coincide con un tipo de trabajo o ciudad
   * y auto-selecciona los filtros correspondientes
   */
  const applyAutoFilterIfMatch = (searchQuery: string) => {
    const matchedJobType = findMatchingJobType(searchQuery);
    const matchedCity = findMatchingCity(searchQuery);

    const newFilters = { ...filtersFromStore };

    if (matchedJobType) {
      newFilters.category = [matchedJobType];
      newFilters.isAutoSelectedCategory = true;
    } else {
      if (
        filtersFromStore.isAutoSelectedCategory &&
        filtersFromStore.category.length === 1 &&
        filtersFromStore.range.length === 0 &&
        filtersFromStore.city.length === 0
      ) {
        newFilters.category = [];
        newFilters.isAutoSelectedCategory = false;
      }
    }

    if (matchedCity) {
      newFilters.city = [matchedCity];
      newFilters.isAutoSelectedCity = true;
    } else {
      if (filtersFromStore.isAutoSelectedCity && filtersFromStore.city.length > 0) {
        newFilters.city = [];
        newFilters.isAutoSelectedCity = false;
      }
    }

    dispatch(setFilters(newFilters));
  };

  const selectItem = (item: string) => {
    setValue(item);
    applyAutoFilterIfMatch(item);
    onSearch(item);
    addToHistory(item);
    setIsOpen(false);
    setHighlighted(-1);
    setPreviewValue(null);
  };

  const previewItem = (item: string) => {
    setValue(item);
    setError(undefined);
    setIsOpen(true);
    setHighlighted(-1);
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    const { isValid, error, data } = validateSearch(value);
    if (!isValid) {
      setError(error);
      return;
    }
    const query = data!;
    applyAutoFilterIfMatch(query);
    onSearch(query);
    addToHistory(query);
    setIsOpen(false);
    setPreviewValue(null);
  };

  // Filtrar historial visible (CORREGIDO: usar useMemo)
  const visibleHistory = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length === 0) {
      return history.slice(0, 5);
    }
    return history.filter((h) => h.toLowerCase().includes(q)).slice(0, 5);
  }, [history, value]);

  // Filtrar sugerencias visibles (CORREGIDO: usar useMemo)
  const visibleSuggestions = React.useMemo(() => {
    return suggestions.slice(0, 5);
  }, [suggestions]);

  // Combinar arrays (CORREGIDO: usar useMemo)
  const visibleCombined = React.useMemo(() => {
    return [...visibleHistory, ...visibleSuggestions];
  }, [visibleHistory, visibleSuggestions]);

  // Hook de teclado
  const { handleKeyDown: handleKeyDownBase } = useSearchKeyboard({
    isOpen,
    highlighted,
    combinedItems: visibleCombined,
    onSelect: selectItem,
    onSearch: handleSearch,
    onClose: () => {
      setIsOpen(false);
      setHighlighted(-1);
      setPreviewValue(null);
    },
    setHighlighted,
    setPreviewValue,
    enablePreview: typeof window !== 'undefined' && window.innerWidth >= 640,
  });

  // Hook de touch
  const { handleTouchStart, handleTouchEnd, handlePointerDown, handlePointerUp } = useSearchTouch(
    (item) => setLongPressedItem(item),
    600,
  );

  // Click fuera para cerrar
  React.useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      if (ev.target instanceof Node && !containerRef.current.contains(ev.target)) {
        setIsOpen(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const hasError = !!error;
  const inputClasses = `pl-10 ${value.length > 0 ? 'pr-10' : 'pr-9'} w-full sm:min-w-80 rounded overflow-hidden text-ellipsis ${
    hasError ? 'border-red-500 border-[1.5px] outline-none shadow-[0_0_0_1px_red]' : ''
  }`;

  return (
    <div className='w-full' ref={containerRef}>
      <div className='flex flex-row w-full items-center gap-2'>
        <div className='relative flex-1 min-w-0 self-center'>
          <SearchIcon hasError={hasError} />
          <Input
            type='text'
            placeholder={t('placeholder')}
            className={inputClasses}
            value={previewValue ?? value}
            onChange={handleChange}
            maxLength={100}
            ref={(el) => {
              inputRef.current = el as HTMLInputElement | null;
            }}
            onKeyDown={handleKeyDownBase}
            onFocus={() => setIsOpen(true)}
          />
          {value.length > 0 && <ClearButton onClick={handleClear} />}

          <SearchDropdown
            isOpen={isOpen}
            history={visibleHistory}
            suggestions={visibleSuggestions}
            highlighted={highlighted}
            longPressedItem={longPressedItem}
            query={value}
            onSelectItem={selectItem}
            onPreviewItem={previewItem}
            onDeleteItem={removeFromHistory}
            onClearHistory={async () => {
              await clearHistory();
              setIsOpen(true);
            }}
            onHighlight={setHighlighted}
            onLongPressStart={(item) => {
              const handler = handleTouchStart(item);
              handler();
              const pointerHandler = handlePointerDown(item);
              return pointerHandler;
            }}
            onLongPressEnd={() => {
              handleTouchEnd();
              handlePointerUp();
            }}
            onCancelDelete={() => setLongPressedItem(null)}
          />
        </div>

        <div className='flex gap-2 items-center shrink-0'>
          <SearchButton onClick={handleSearch} />
          <AdvancedSearchButton />
          {onFilter && <FilterButton onClick={onFilter} />}
        </div>
      </div>
      <div className='min-h-5 mt-1'>
        {hasError && <p className='text-red-500 text-sm leading-4'>{error}</p>}
      </div>
    </div>
  );
};
