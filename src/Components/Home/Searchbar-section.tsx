// src/Components/Home/Searchbar-section.tsx
'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSearchHistory } from '@/app/redux/features/searchHistory/useSearchHistory';
import { useSearchSuggestions } from '@/app/redux/features/searchHistory/useSearchSuggestions';
import { useSearchKeyboard } from '@/app/redux/features/searchHistory/useSearchKeyboard';
import { useSearchTouch } from '@/app/redux/features/searchHistory/useSearchTouch';
import { SearchDropdown } from '@/Components/Shared/SearchDropdown';
import { validateSearch } from '@/app/lib/validations/search.validator';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onSearch?: (query: string) => void;
  showButton?: boolean;
  buttonText?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar trabajos, ubicaciones, servicios...',
  className = '',
  disabled = false,
  onSearch,
  showButton = false,
  buttonText = 'Buscar',
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Estado local
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [longPressedItem, setLongPressedItem] = useState<string | null>(null);
  const [previewValue, setPreviewValue] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const currentLanguage = useMemo(() => {
    const pathSegments = (pathname || '').split('/').filter(Boolean);
    const langSegment = pathSegments[0];
    return ['en', 'es'].includes(langSegment) ? langSegment : 'es';
  }, [pathname]);

  // Hooks personalizados para historial y sugerencias
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory({
    useBackend: true,
  });

  const { suggestions } = useSearchSuggestions(value, {
    enabled: value.trim().length > 0,
    minLength: 1,
    debounceMs: 300,
    maxResults: 6,
    language: currentLanguage,
  });

  // Función para realizar la búsqueda con redirección
  const performSearch = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      if (trimmedQuery) {
        if (onSearch) {
          onSearch(trimmedQuery);
        } else {
          router.push(`/job-offer-list?search=${encodeURIComponent(trimmedQuery)}`);
        }
      } else {
        if (onSearch) {
          onSearch('');
        } else {
          router.push('/job-offer-list');
        }
      }
    },
    [router, onSearch],
  );

  // Filtrar elementos visibles con useMemo
  const visibleHistory = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length === 0) {
      return history.slice(0, 5);
    }
    return history.filter((h) => h.toLowerCase().includes(q)).slice(0, 5);
  }, [history, value]);

  const visibleSuggestions = useMemo(() => {
    return suggestions.slice(0, 5);
  }, [suggestions]);

  const visibleCombined = useMemo(() => {
    return [...visibleHistory, ...visibleSuggestions];
  }, [visibleHistory, visibleSuggestions]);

  // Seleccionar item (historial o sugerencia)
  const selectItem = useCallback(
    (item: string) => {
      onChange(item);
      addToHistory(item);
      setIsOpen(false);
      setHighlighted(-1);
      setPreviewValue(null);
      performSearch(item);
    },
    [onChange, addToHistory, performSearch],
  );

  // Preview item (llenar input sin buscar)
  const previewItem = useCallback(
    (item: string) => {
      onChange(item);
      setPreviewValue(null);
      setIsOpen(true);
      setHighlighted(-1);
      inputRef.current?.focus();
    },
    [onChange],
  );

  // Ejecutar búsqueda
  const handleSearch = useCallback(() => {
    const searchValue = previewValue ?? value;
    const trimmed = searchValue.trim();
    if (error) return;
    if (trimmed) {
      addToHistory(trimmed);
      setIsOpen(false);
      setHighlighted(-1);
      setPreviewValue(null);
      performSearch(trimmed);
    }
  }, [value, previewValue, addToHistory, performSearch, error]);

  // Hook de navegación por teclado
  const { handleKeyDown } = useSearchKeyboard({
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

  // Hook de gestos táctiles (long press)
  const { handleTouchStart, handleTouchEnd, handlePointerDown, handlePointerUp } = useSearchTouch(
    (item) => setLongPressedItem(item),
    600,
  );

  // Manejar cambios en el input
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (newValue.length > 100) {
        newValue = newValue.slice(0, 100);
        setError('Límite máximo de 100 caracteres.');
        onChange(newValue);
        return;
      }
      onChange(newValue);
      setPreviewValue(null);
      setHighlighted(-1);
      const { isValid, error } = validateSearch(newValue);
      setError(isValid ? undefined : error);
    },
    [onChange],
  );

  // Click fuera para cerrar dropdown
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      if (ev.target instanceof Node && !containerRef.current.contains(ev.target)) {
        setIsOpen(false);
        setHighlighted(-1);
        setPreviewValue(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className='relative'>
        {/* Icono de búsqueda */}
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>

        {/* Input de búsqueda */}
        <input
          ref={inputRef}
          type='text'
          placeholder={placeholder}
          value={previewValue ?? value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => {
              if (!containerRef.current?.contains(document.activeElement)) {
                setIsOpen(false);
                setPreviewValue(null);
              }
            }, 200);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            block w-full pl-10 ${showButton ? 'pr-32' : 'pr-3'} py-4 
            border border-gray-300 rounded-xl 
            shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
            text-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : ''}
            ${disabled ? 'bg-gray-100' : 'bg-white'}
          `}
        />

        {/* Botón de búsqueda (opcional) */}
        {showButton && (
          <button
            type='button'
            onClick={handleSearch}
            disabled={disabled}
            className='absolute right-1.5 top-1.5 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* Dropdown unificado */}
      <SearchDropdown
        isOpen={isOpen && !disabled}
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
          const touchHandler = handleTouchStart(item);
          touchHandler();
          const pointerHandler = handlePointerDown(item);
          return pointerHandler;
        }}
        onLongPressEnd={() => {
          handleTouchEnd();
          handlePointerUp();
        }}
        onCancelDelete={() => setLongPressedItem(null)}
        maxVisibleHistory={5}
        maxVisibleSuggestions={5}
        className='border border-gray-200 rounded-xl shadow-xl mt-2'
      />

      {/* Mensaje de error */}
      <div className='min-h-5 mt-1 pl-4'>
        {error && <p className='text-red-500 text-sm leading-4 text-left'>{error}</p>}
      </div>
    </div>
  );
}
