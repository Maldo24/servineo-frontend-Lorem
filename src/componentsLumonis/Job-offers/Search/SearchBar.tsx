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
import { useAppSelector } from '@/app/redux/hooks';
import { useTranslations } from 'next-intl';
import { useSearchHistory } from '@/app/redux/features/searchHistory/useSearchHistory';
import { useSearchSuggestions } from '@/app/redux/features/searchHistory/useSearchSuggestions';
import { useSearchKeyboard } from '@/app/redux/features/searchHistory/useSearchKeyboard';
import { useSearchTouch } from '@/app/redux/features/searchHistory/useSearchTouch';
import { SearchDropdown } from '@/Components/Shared/SearchDropdown';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter?: () => void;
}

export const SearchBar = ({ onSearch, onFilter }: SearchBarProps) => {
  const t = useTranslations('search');

  const searchFromStore = useAppSelector((state) => state.jobOfert.search);

  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState<number>(-1);
  const [longPressedItem, setLongPressedItem] = React.useState<string | null>(null);
  const [previewValue, setPreviewValue] = React.useState<string | null>(null);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const prevSearchFromStore = React.useRef(searchFromStore);

  // Hooks personalizados
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory({
    useBackend: true,
  });

  const { suggestions } = useSearchSuggestions(value, {
    enabled: value.trim().length > 0,
    minLength: 1,
    debounceMs: 300,
    maxResults: 6,
  });

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
    setValue(newValue);
    setPreviewValue(null);
    const { isValid, error } = validateSearch(newValue);
    setError(isValid ? undefined : error);
    setHighlighted(-1);
  };

  const handleClear = () => {
    setValue('');
    setError(undefined);
    onSearch('');
  };

  const selectItem = (item: string) => {
    setValue(item);
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
    <div className="w-full" ref={containerRef}>
      <div className="flex flex-row w-full items-center gap-2">
        <div className="relative flex-1 min-w-0 self-center">
          <SearchIcon hasError={hasError} />
          <Input
            type="text"
            placeholder={t('placeholder')}
            className={inputClasses}
            value={previewValue ?? value}
            onChange={handleChange}
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

        <div className="flex gap-2 items-center shrink-0">
          <SearchButton onClick={handleSearch} />
          <AdvancedSearchButton />
          {onFilter && <FilterButton onClick={onFilter} />}
        </div>
      </div>
      <div className="h-2 mt-1">{hasError && <p className="text-red-500 text-sm">{error}</p>}</div>
    </div>
  );
};
