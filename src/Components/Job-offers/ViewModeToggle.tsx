// src/Components/Job-offers/ViewModeToggle.tsx
'use client';

import React from 'react';
import { Map, List, LayoutGrid } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ViewMode } from './JobOffersView';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  variant?: 'mobile' | 'desktop';
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onChange,
  variant = 'desktop',
  className = '',
}) => {
  const t = useTranslations('jobOffers');

  if (variant === 'mobile') {
    return (
      <div
        className={`flex gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-sm ${className}`}
      >
        <button
          onClick={() => onChange('grid')}
          className={`p-2 rounded-md transition-all duration-200 ${
            viewMode === 'grid'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          title={t('viewModes.grid', { default: 'Vista cuadrícula' })}
        >
          <LayoutGrid className='w-5 h-5' />
        </button>
        <button
          onClick={() => onChange('map')}
          className={`p-2 rounded-md transition-all duration-200 ${
            viewMode === 'map'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          title={t('viewModes.map')}
        >
          <Map className='w-5 h-5' />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 shadow-sm ${className}`}
    >
      <button
        onClick={() => onChange('grid')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          viewMode === 'grid'
            ? 'bg-primary text-white shadow-md scale-105'
            : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-sm'
        }`}
        title={t('viewModes.grid', { default: 'Vista cuadrícula' })}
      >
        <LayoutGrid className='w-4 h-4' />
        <span className='text-sm'>{t('viewModes.grid', { default: 'Cuadrícula' })}</span>
      </button>
      <button
        onClick={() => onChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          viewMode === 'list'
            ? 'bg-primary text-white shadow-md scale-105'
            : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-sm'
        }`}
        title={t('viewModes.list')}
      >
        <List className='w-4 h-4' />
        <span className='text-sm'>{t('viewModes.list')}</span>
      </button>
      <button
        onClick={() => onChange('map')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          viewMode === 'map'
            ? 'bg-primary text-white shadow-md scale-105'
            : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-sm'
        }`}
        title={t('viewModes.map')}
      >
        <Map className='w-4 h-4' />
        <span className='text-sm'>{t('viewModes.map')}</span>
      </button>
    </div>
  );
};
