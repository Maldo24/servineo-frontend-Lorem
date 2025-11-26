// src/Components/Home/Searchbar-section.tsx
'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchHistory } from '@/app/redux/features/searchHistory/useSearchHistory';
import { useSearchSuggestions } from '@/app/redux/features/searchHistory/useSearchSuggestions';
import { useSearchKeyboard } from '@/app/redux/features/searchHistory/useSearchKeyboard';
import { useSearchTouch } from '@/app/redux/features/searchHistory/useSearchTouch';
import { SearchDropdown } from '@/Components/Shared/SearchDropdown';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar trabajos, ubicaciones, servicios...',
  className = '',
  disabled = false,
  onSearch,
}: SearchBarProps) {
  const router = useRouter();

  // Estado local
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [longPressedItem, setLongPressedItem] = useState<string | null>(null);
  const [previewValue, setPreviewValue] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Hooks personalizados para historial y sugerencias
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory({
    useBackend: true,
  });

  const { suggestions } = useSearchSuggestions(value, {
    enabled: value.trim().length > 0,
    minLength: 1,
    debounceMs: 300,
    maxResults: 6,
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

  // Filtrar elementos visibles con useMemo (CORREGIDO)
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

    if (trimmed) {
      addToHistory(trimmed);
      setIsOpen(false);
      setHighlighted(-1);
      setPreviewValue(null);
      performSearch(trimmed);
    }
  }, [value, previewValue, addToHistory, performSearch]);

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
      onChange(e.target.value);
      setPreviewValue(null);
      setHighlighted(-1);
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
    <div className={`flex-1 relative group ${className}`} ref={containerRef}>
      {/* Icono de búsqueda */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <Search
          className={`w-5 h-5 transition-all duration-300 ${
            isFocused
              ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
              : 'text-muted-foreground group-hover:text-blue-500'
          }`}
        />
      </div>

      {/* Botón para limpiar */}
      {value && !disabled && (
        <button
          onClick={() => {
            onChange('');
            setPreviewValue(null);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Input de búsqueda */}
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={previewValue ?? value}
        onChange={handleInputChange}
        onFocus={() => {
          setIsFocused(true);
          setIsOpen(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          // Delay para permitir clicks en el dropdown
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
          w-full pl-12 pr-12 py-4 
          bg-white/90 backdrop-blur-md
          border-2 rounded-2xl
          font-medium text-foreground placeholder:text-muted-foreground/60
          transition-all duration-300 ease-out
          shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isFocused
              ? 'border-primary shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02] bg-white'
              : 'border-primary hover:border-blue-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
          }
          ${disabled ? 'bg-gray-100' : ''}
        `}
      />

      {/* Línea de animación en focus */}
      {isFocused && !disabled && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
      )}

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
        className="border-2 border-primary/20 rounded-2xl shadow-2xl backdrop-blur-md"
      />
    </div>
  );
}
