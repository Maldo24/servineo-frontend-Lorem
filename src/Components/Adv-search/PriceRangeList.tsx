// src/Components/Adv-search/PriceRangeList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useGetPriceRangesQuery } from '@/app/redux/services/jobOffersApi';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type RangeItem = { label: string; min: number | null; max: number | null };

interface PriceRangeListProps {
  onFilterChange?: (filters: { priceRanges: string[]; priceKey?: string }) => void;
  clearSignal?: number;
}

// Tipo para el error de la API
interface ApiErrorData {
  message?: string;
  [key: string]: unknown;
}

const PriceRangeList: React.FC<PriceRangeListProps> = ({ onFilterChange, clearSignal }) => {
  const t = useTranslations('advancedSearch');
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [ranges, setRanges] = useState<RangeItem[]>([]);

  // ===== RTK QUERY =====
  const { data: priceRangesData, isLoading, error: queryError } = useGetPriceRangesQuery();

  // ===== CARGAR CACHÉ DE SESSIONSTORAGE AL MONTAR =====
  useEffect(() => {
    // Try to read cached ranges from sessionStorage to avoid flicker on remount
    try {
      const cached = sessionStorage.getItem('adv_price_ranges');
      if (cached) {
        const parsed = JSON.parse(cached) as RangeItem[];
        if (Array.isArray(parsed) && parsed.length) {
          setRanges(parsed);
        }
      }
    } catch (err) {
      console.error('❌[PriceRangeList] Error loading cache:', err);
    }
  }, []);

  // ===== SINCRONIZAR CON RESPUESTA DE RTK QUERY =====
  useEffect(() => {
    if (priceRangesData) {
      const items: RangeItem[] = Array.isArray(priceRangesData.ranges)
        ? priceRangesData.ranges.map((r) => ({
            label: r.label,
            min: r.min ?? null,
            max: r.max ?? null,
          }))
        : [];

      setRanges(items);

      // Guardar en sessionStorage para futuros montajes
      try {
        sessionStorage.setItem('adv_price_ranges', JSON.stringify(items));
      } catch (err) {
        console.error('❌ [PriceRangeList] Error saving cache:', err);
      }
    }
  }, [priceRangesData]);

  // ===== MANEJAR CAMBIOS DE CHECKBOX =====
  const handleCheckboxChange = (rangeValue: string) => {
    const newSelectedRanges = selectedRanges.includes(rangeValue)
      ? selectedRanges.filter((range) => range !== rangeValue)
      : [...selectedRanges, rangeValue];

    setSelectedRanges(newSelectedRanges);

    // If exactly one range is selected, provide priceKey so parent can parse min/max
    const priceKey = newSelectedRanges.length === 1 ? newSelectedRanges[0] : '';
    onFilterChange?.({ priceRanges: newSelectedRanges, priceKey });
  };

  // ===== RESETEAR SELECCIONES CUANDO EL PADRE SEÑALA UN CLEAR =====
  useEffect(() => {
    if (typeof clearSignal === 'undefined') return;
    setSelectedRanges([]);
    onFilterChange?.({ priceRanges: [], priceKey: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSignal]);

  // ===== FORMATEAR ETIQUETAS =====
  function formatRangeLabel(label: string) {
    if (!label) return label;
    // Convert occurrences like "$90" or "$ 90" to "90bs"
    return label.replace(/\$\s*([0-9]+(?:\.[0-9]+)?)/g, '$1bs');
  }

  // ===== FUNCIÓN AUXILIAR PARA EXTRAER MENSAJE DE ERROR =====
  function getErrorMessage(error: FetchBaseQueryError | SerializedError): string {
    if ('status' in error) {
      // FetchBaseQueryError
      if (error.data && typeof error.data === 'object') {
        const apiError = error.data as ApiErrorData;
        return apiError.message || JSON.stringify(error.data);
      }
      return `Error ${error.status}`;
    }
    // SerializedError
    return error.message || 'Error desconocido';
  }

  // ===== ESTADOS DE CARGA Y ERROR =====
  // Mostrar loading solo si NO hay datos en caché
  if (isLoading && ranges.length === 0) {
    return <div className='p-4 text-sm text-gray-500'>{t('resultsCounter.loading')}</div>;
  }

  if (queryError) {
    const errorMessage = getErrorMessage(queryError);
    return <div className='p-4 text-sm text-red-500'>Error: {errorMessage}</div>;
  }

  if (!ranges.length) {
    return <div className='p-4 text-sm text-gray-500'>{t('resultsCounter.noResults')}</div>;
  }

  return (
    <div className='w-full border border-gray-300 rounded-lg overflow-hidden'>
      <div className='max-h-64 overflow-y-auto'>
        {ranges.map((r, index) => (
          <label
            key={`${r.label}-${index}`}
            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              index !== ranges.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <input
              type='checkbox'
              checked={selectedRanges.includes(r.label)}
              onChange={() => handleCheckboxChange(r.label)}
              className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer'
            />
            <span className='ml-3 text-sm text-gray-700 capitalize'>
              {formatRangeLabel(r.label)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeList;
