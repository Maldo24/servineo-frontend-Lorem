'use client';

import React from 'react';
import { Input } from '@/Components/ui/input';
import { SearchIcon } from './SearchIcon';
import { ClearButton } from './ClearButton';
import { validateSearch } from '@/app/lib/validations/search.validator';
import { useTranslations } from 'next-intl';

type NoResultsMessageProps = {
  search: string;
};
export const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ search }) => {
  const t = useTranslations('search');
  const trimmed = search?.trim();

  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-xl font-roboto font-normal">
        {t('noResults')}
        {trimmed && (
          <>
            {' '}
            {t('for')} <span className="font-bold">&quot;{trimmed}&quot;</span>
          </>
        )}
      </p>
    </div>
  );
};


interface InputOnlySearchProps {
  onSearch: (query: string) => void;
  onValueChange?: (value: string) => void;
}

export const InputOnlySearch = ({ onSearch, onValueChange }: InputOnlySearchProps) => {
  const t = useTranslations('search');
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();

  // Use a ref to track if we've already initialized from URL
  const hasInitialized = React.useRef(false);

  // On mount, if there's a `search` query param (coming from AdvSearch "Modificar"), populate the input
  React.useEffect(() => {
    if (typeof window === 'undefined' || hasInitialized.current) return;

    try {
      const sp = new URLSearchParams(window.location.search);
      const s = sp.get('search');
      if (s && s.length) {
        setValue(s);
        if (typeof onValueChange === 'function') onValueChange(s);
        hasInitialized.current = true;
      }
    } catch {
      // ignore
    }
  }, [onValueChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (typeof onValueChange === 'function') onValueChange(e.target.value);
    const { isValid, error } = validateSearch(e.target.value);
    setError(isValid ? undefined : error);
  };

  const handleClear = () => {
    setValue('');
    setError(undefined);
    // Only clear the input value locally and notify parent of the value change.
    // Do NOT trigger a search/navigation here.
    if (typeof onValueChange === 'function') onValueChange('');
  };

  const handleSearch = () => {
    const { isValid, error, data } = validateSearch(value);
    if (!isValid) {
      setError(error);
      return;
    }
    onSearch(data!);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const hasError = !!error;
  const inputClasses = `pl-10 ${value.length > 0 ? 'pr-10' : 'pr-9'} w-full sm:min-w-80 rounded ${
    hasError ? 'border-red-500 border-[1.5px] outline-none shadow-[0_0_0_1px_red]' : ''
  }`;

  return (
    <div className="w-full">
      <div className="relative">
        <SearchIcon hasError={hasError} />
        <Input
          type="text"
          placeholder={t('placeholder')}
          className={inputClasses}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {value.length > 0 && <ClearButton onClick={handleClear} />}
      </div>
      <div className="h-2 mt-1">{hasError && <p className="text-red-500 text-sm">{error}</p>}</div>
    </div>
  );
};
