'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useGetTagsQuery } from '@/app/redux/services/jobOffersApi';

interface DropdownListProps {
  onFilterChange?: (filters: { categories: string[] }) => void;
  clearSignal?: number;
  searchQuery?: string;
  categoryFilters?: string[];
}

const DropdownList: React.FC<DropdownListProps> = ({
  onFilterChange,
  clearSignal,
  searchQuery = '',
  categoryFilters = [],
}) => {
  const tCommon = useTranslations('advancedSearch');

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hasRestoredFromUrl, setHasRestoredFromUrl] = useState(false);

  // Ref to store the latest onFilterChange callback
  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  const {
    data: tagsData,
    isLoading,
    error: fetchError,
  } = useGetTagsQuery({
    search: searchQuery?.trim() || undefined,
    category: categoryFilters.length > 0 ? categoryFilters : undefined,
  });

  // Normalizar respuesta del backend
  const categories = useMemo(() => {
    if (!tagsData) return [];
    if (Array.isArray(tagsData)) return tagsData;
    return [];
  }, [tagsData]);

  const error = fetchError ? 'Error al cargar categorías' : null;

  // Restaurar desde URL (solo se ejecuta una vez)
  useEffect(() => {
    if (typeof window === 'undefined' || hasRestoredFromUrl) return;

    const sp = new URLSearchParams(window.location.search);
    const tagsFromAll = sp.getAll('tags') || [];
    let urlTags: string[] = [];

    if (tagsFromAll.length) {
      urlTags = tagsFromAll
        .flatMap((s) => (typeof s === 'string' ? s.split(',') : []))
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      const t = sp.get('tags');
      if (t != null) {
        urlTags = t
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    if (urlTags.length > 0) {
      setSelectedCategories(urlTags);
      onFilterChangeRef.current?.({ categories: urlTags });
    }

    setHasRestoredFromUrl(true);
  }, [hasRestoredFromUrl]); // Solo se ejecuta al montar el componente

  // Limpiar selección cuando cambia clearSignal
  useEffect(() => {
    if (!hasRestoredFromUrl || !clearSignal) return;

    setSelectedCategories([]);
    onFilterChangeRef.current?.({ categories: [] });
  }, [clearSignal, hasRestoredFromUrl]);

  const handleCheckboxChange = useCallback((categoryValue: string) => {
    setSelectedCategories((prev) => {
      const newSelectedCategories = prev.includes(categoryValue)
        ? prev.filter((cat) => cat !== categoryValue)
        : [...prev, categoryValue];

      // Llamar a onFilterChange después de actualizar el estado
      setTimeout(() => {
        onFilterChangeRef.current?.({ categories: newSelectedCategories });
      }, 0);

      return newSelectedCategories;
    });
  }, []);

  if (isLoading) {
    return (
      <div className='w-full border border-gray-300 rounded-lg p-8 text-center'>
        <div className='animate-pulse space-y-3'>
          <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto'></div>
          <div className='h-4 bg-gray-200 rounded w-2/3 mx-auto'></div>
          <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto'></div>
        </div>
        <p className='text-gray-500 text-xs mt-2'>{tCommon('resultsCounter.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full border border-red-300 rounded-lg p-4 bg-red-50'>
        <div className='text-center'>
          <p className='text-red-600 text-sm font-semibold mb-2'>⚠️ Error al cargar categorías</p>
          <p className='text-red-500 text-xs mb-3'>{error}</p>
        </div>
      </div>
    );
  }

  const selectedButNotInFilter = selectedCategories.filter(
    (selectedTag) => !categories.includes(selectedTag),
  );

  const displayCategories = [...categories, ...selectedButNotInFilter];

  if (displayCategories.length === 0) {
    return (
      <div className='w-full border border-gray-300 rounded-lg p-4'>
        <p className='text-gray-500 text-sm text-center'>{tCommon('resultsCounter.noResults')}</p>
      </div>
    );
  }

  return (
    <div className='w-full border border-gray-300 rounded-lg overflow-hidden'>
      <div className='max-h-64 overflow-y-auto'>
        {displayCategories.map((category, index) => (
          <label
            key={`${category}-${index}`}
            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              index !== displayCategories.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <input
              type='checkbox'
              checked={selectedCategories.includes(category)}
              onChange={() => handleCheckboxChange(category)}
              className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer'
            />
            <span className='ml-3 text-sm text-gray-700 capitalize'>{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DropdownList;
