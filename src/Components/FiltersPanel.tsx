'use client';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  toggleFixerName,
  toggleCity,
  toggleJobType,
  resetFilters,
  selectSelectedFixerNames,
  selectSelectedCities,
  selectSelectedJobTypes,
  selectIsAutoSelectedJobType,
  selectIsAutoSelectedCity,
  selectSidebarOpen,
  setSidebarOpen,
} from '../app/redux/slice/filterSlice';
import { DB_VALUES } from '@/app/redux/contants';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function FiltersPanel() {
  const t = useTranslations('filtersPanel');
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const selectedFixerNames = useAppSelector(selectSelectedFixerNames);
  const selectedCities = useAppSelector(selectSelectedCities);
  const selectedJobTypes = useAppSelector(selectSelectedJobTypes);
  const isAutoSelectedJobType = useAppSelector(selectIsAutoSelectedJobType);
  const isAutoSelectedCity = useAppSelector(selectIsAutoSelectedCity);

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-30 lg:hidden animate-fade-in'
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 overflow-y-auto z-40 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:top-auto lg:h-auto lg:w-64 ${
          sidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        }`}
      >
        <div className='p-4 space-y-6'>
          {/* Mobile Header */}
          <div className='flex items-center justify-between lg:hidden'>
            <h2 className='text-xl font-semibold text-gray-800'>{t('filters')}</h2>
            <button
              onClick={() => dispatch(setSidebarOpen(false))}
              className='p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Desktop Header */}
          <div className='hidden lg:flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-800'>{t('filters')}</h2>
            <button
              onClick={() => dispatch(resetFilters())}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
            >
              {t('resetButton.desktop')}
            </button>
          </div>

          {/* Mobile Reset Button */}
          <button
            onClick={() => dispatch(resetFilters())}
            className='lg:hidden w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
          >
            {t('resetButton.mobile')}
          </button>

          {/* Filter Sections */}
          <div className='space-y-6'>
            {/* Nombre de Fixer */}
            <div className='space-y-3'>
              <div className='px-3 py-2 bg-blue-50 rounded-lg'>
                <h3 className='font-medium text-blue-800'>{t('fixerName')}</h3>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                {DB_VALUES.ranges.slice(0, 5).map((range) => (
                  <label
                    key={range}
                    className='flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors'
                  >
                    <input
                      type='checkbox'
                      checked={selectedFixerNames.includes(range)}
                      onChange={() => dispatch(toggleFixerName(range))}
                      className='w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500'
                    />
                    <span className='text-sm text-gray-700'>{range}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ciudad */}
            <div className='space-y-3'>
              <div className='px-3 py-2 bg-blue-50 rounded-lg'>
                <h3 className='font-medium text-blue-800'>{t('city')}</h3>
              </div>
              <div className='space-y-2 max-h-48 overflow-y-auto pr-2'>
                {DB_VALUES.cities.map((city) => {
                  const isSelected = selectedCities.includes(city);
                  const isAutoMarked = isAutoSelectedCity && isSelected;
                  const isDisabled = isAutoSelectedCity && !isSelected;

                  return (
                    <label
                      key={city}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        isDisabled
                          ? 'cursor-not-allowed opacity-50 bg-gray-200'
                          : 'cursor-pointer hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => {
                          // Si es automarcado, no permite deseleccionar
                          if (isAutoMarked) return;
                          dispatch(toggleCity(city));
                        }}
                        disabled={isDisabled}
                        className={`w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer`}
                      />
                      <span className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                        {city}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Tipo de Trabajo */}
            <div className='space-y-3'>
              <div className='px-3 py-2 bg-blue-50 rounded-lg'>
                <h3 className='font-medium text-blue-800'>{t('jobCategory')}</h3>
              </div>
              <div className='space-y-2 max-h-48 overflow-y-auto pr-2'>
                {DB_VALUES.jobTypes.map((type) => {
                  const isSelected = selectedJobTypes.includes(type);
                  const isAutoMarked = isAutoSelectedJobType && isSelected;
                  const isDisabled = isAutoSelectedJobType && !isSelected;

                  return (
                    <label
                      key={type}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        isDisabled
                          ? 'cursor-not-allowed opacity-50 bg-gray-200'
                          : isAutoMarked
                            ? 'cursor-pointer hover:bg-gray-50'
                            : 'cursor-pointer hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => {
                          // Si es automarcado, no permite deseleccionar
                          if (isAutoMarked) return;
                          dispatch(toggleJobType(type));
                        }}
                        disabled={isDisabled}
                        className={`w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer`}
                      />
                      <span className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                        {type}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
