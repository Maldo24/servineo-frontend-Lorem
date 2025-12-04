'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { roboto } from '@/app/fonts';
import { validateFilters } from '@/app/lib/validations/filter.validator';
import { useTranslations } from 'next-intl';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { DB_VALUES } from '@/app/redux/contants';
import type { FilterState } from '@/app/redux/features/jobOffers/types';
import { setRating } from '@/app/redux/slice/jobOfert';
import { useGetFilterCountsQuery } from '@/app/redux/services/jobOffersApi';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersApply?: (filters: FilterState) => void;
  onRatingChange?: (rating: number | null) => void;
  onReset?: () => void;
}

export function FilterDrawer({ isOpen, onClose, onFiltersApply, onReset }: FilterDrawerProps) {
  const filtersFromStore = useAppSelector((state) => state.jobOfert.filters);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    fixer: false,
    ciudad: false,
    trabajo: false,
    rating: false,
  });

  const t = useTranslations('filtersPanel');
  const tName = useTranslations('advancedSearch.fixerName');
  const tCity = useTranslations('advancedSearch.city');
  const tJob = useTranslations('advancedSearch.jobType');

  const [selectedRanges, setSelectedRanges] = useState<string[]>(filtersFromStore.range || []);
  const [selectedCities, setSelectedCities] = useState<string[]>(filtersFromStore.city || []);
  const [selectedJobs, setSelectedJobs] = useState<string[]>(filtersFromStore.category || []);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const storeRating = useAppSelector((s) => s.jobOfert.rating);
  const storeSearch = useAppSelector((s) => s.jobOfert.search);

  // 🔧 Petición de contadores: NO enviar la categoría para obtener totales por categoría
  const { data: backendCounts, isLoading: loadingCounts } = useGetFilterCountsQuery(
    {
      range: selectedRanges.length > 0 ? selectedRanges : undefined,
      city: selectedCities.length > 0 ? selectedCities.join(',') : undefined,
      // Enviar las categorías seleccionadas como ARRAY para que el builder
      // de query agregue correctamente múltiples params `category=`.
      // (Antes se enviaba una cadena con comas y provocaba errores al iterar.)
      category: selectedJobs.length > 0 ? selectedJobs : undefined,
      search: storeSearch?.trim() ? storeSearch : undefined,
      minRating: selectedRating ?? undefined,
      maxRating: selectedRating !== null && selectedRating < 5 ? selectedRating + 0.99 : undefined,
    },
    {
      skip: !isOpen,
    },
  );

  useEffect(() => {
    setSelectedRanges(filtersFromStore.range || []);
    setSelectedCities(filtersFromStore.city || []);
    setSelectedJobs(filtersFromStore.category || []);
    setSelectedRating(storeRating ?? null);
  }, [filtersFromStore, storeRating]);

  // Cuando se abre el drawer, mantener abiertas las secciones que ya tienen filtros aplicados
  useEffect(() => {
    if (!isOpen) return;

    setOpenSections((prev) => ({
      fixer: prev.fixer || (filtersFromStore.range && filtersFromStore.range.length > 0),
      ciudad: prev.ciudad || (filtersFromStore.city && filtersFromStore.city.length > 0),
      trabajo: prev.trabajo || (filtersFromStore.category && filtersFromStore.category.length > 0),
      rating: prev.rating || storeRating != null,
    }));
  }, [isOpen, filtersFromStore, storeRating]);

  useEffect(() => {
    setSelectedRating(storeRating ?? null);
  }, [storeRating]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'scroll';
    } else {
      document.body.style.overflowY = 'unset';
    }
    return () => {
      document.body.style.overflowY = 'unset';
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleRatingClick = (star: number) => {
    const newRating = selectedRating === star ? null : star;
    setSelectedRating(newRating);
    dispatch(setRating(newRating));
    applyFilters(
      selectedRanges,
      selectedCities,
      selectedJobs,
      filtersFromStore.isAutoSelectedCategory,
      filtersFromStore.isAutoSelectedCity,
    );
  };

  const handleRangeChange = (dbValue: string) => {
    const newRanges = selectedRanges.includes(dbValue)
      ? selectedRanges.filter((r) => r !== dbValue)
      : [...selectedRanges, dbValue];

    setSelectedRanges(newRanges);
    applyFilters(
      newRanges,
      selectedCities,
      selectedJobs,
      filtersFromStore.isAutoSelectedCategory,
      filtersFromStore.isAutoSelectedCity,
    );
  };

  const handleCityChange = (dbValue: string) => {
    if (process.env.NODE_ENV === 'development')
      console.debug('[FilterDrawer] handleCityChange click:', dbValue, {
        selectedCities,
        filtersFromStore,
      });
    const isAutoMarked =
      filtersFromStore.isAutoSelectedCity && filtersFromStore.city.includes(dbValue);
    if (isAutoMarked && selectedCities.includes(dbValue)) {
      return;
    }

    let newCities: string[];
    if (filtersFromStore.isAutoSelectedCity) {
      newCities = selectedCities.includes(dbValue) ? [] : [dbValue];
    } else {
      newCities = selectedCities.includes(dbValue)
        ? selectedCities.filter((c) => c !== dbValue)
        : [...selectedCities, dbValue];
    }

    setSelectedCities(newCities);
    applyFilters(
      selectedRanges,
      newCities,
      selectedJobs,
      filtersFromStore.isAutoSelectedCategory,
      false,
    );
  };

  const handleJobChange = (dbValue: string) => {
    if (process.env.NODE_ENV === 'development')
      console.debug('[FilterDrawer] handleJobChange click:', dbValue, {
        selectedJobs,
        filtersFromStore,
      });
    // Si hay auto-selección, permitir cambio libre entre categorías
    let newJobs: string[];

    if (filtersFromStore.isAutoSelectedCategory) {
      // Si clickea en otra categoría, cambiar a esa (comportamiento de radio button)
      newJobs = selectedJobs.includes(dbValue) ? [] : [dbValue];
    } else {
      // Comportamiento normal de checkbox múltiple
      newJobs = selectedJobs.includes(dbValue)
        ? selectedJobs.filter((j) => j !== dbValue)
        : [...selectedJobs, dbValue];
    }

    setSelectedJobs(newJobs);
    // Quitar el flag de auto-selección ya que el usuario hizo un cambio manual
    applyFilters(
      selectedRanges,
      selectedCities,
      newJobs,
      false,
      filtersFromStore.isAutoSelectedCity,
    );
  };

  const applyFilters = (
    ranges: string[],
    cities: string[],
    jobs: string[],
    isAutoCat: boolean = false,
    isAutoCity: boolean = false,
  ) => {
    if (process.env.NODE_ENV === 'development')
      console.debug('[FilterDrawer] applyFilters called with:', {
        ranges,
        cities,
        jobs,
        isAutoCat,
        isAutoCity,
        filtersFromStore,
      });
    const filtersToValidate = { range: ranges, city: cities, category: jobs };
    const { isValid, data } = validateFilters(filtersToValidate);

    if (!isValid || !data) return;

    const filterState: FilterState = {
      range: data.range ?? [],
      city: data.city ?? [],
      category: data.category ?? [],
      isAutoSelectedCategory: isAutoCat,
      isAutoSelectedCity: isAutoCity,
    };

    // Evitar disparar el handler si no hay cambios reales respecto al store
    const arraysEqual = (a: string[] = [], b: string[] = []) => {
      if (a.length !== b.length) return false;
      const sa = [...a].sort();
      const sb = [...b].sort();
      for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return false;
      return true;
    };

    const sameAsStore =
      arraysEqual(filterState.range, filtersFromStore.range) &&
      arraysEqual(filterState.city, filtersFromStore.city) &&
      arraysEqual(filterState.category, filtersFromStore.category);

    if (!sameAsStore && onFiltersApply) {
      if (process.env.NODE_ENV === 'development')
        console.debug('[FilterDrawer] applyFilters -> dispatching onFiltersApply', filterState);
      onFiltersApply(filterState);
    } else {
      if (process.env.NODE_ENV === 'development')
        console.debug('[FilterDrawer] applyFilters -> no-op (sameAsStore)', {
          sameAsStore,
          filterState,
          store: filtersFromStore,
        });
    }
  };

  const handleReset = () => {
    setSelectedRanges([]);
    setSelectedCities([]);
    setSelectedJobs([]);
    setSelectedRating(null);
    dispatch(setRating(null));

    if (onReset) {
      onReset();
    } else if (onFiltersApply) {
      onFiltersApply({
        range: [],
        city: [],
        category: [],
        isAutoSelectedCategory: false,
        isAutoSelectedCity: false,
      } as FilterState);
    }
  };

  const getRangeCount = (dbValue: string): number => {
    if (!backendCounts?.ranges) return 0;
    return backendCounts.ranges[dbValue] || 0;
  };

  const getRatingCount = (starNumber: number): number => {
    if (!backendCounts?.ratings) return 0;
    const key = `${starNumber}-${starNumber + 1}`;
    return backendCounts.ratings[key] || 0;
  };

  const nameRanges = [
    [
      { dbValue: DB_VALUES.ranges[0], label: tName('ranges.ac') },
      { dbValue: DB_VALUES.ranges[1], label: tName('ranges.df') },
      { dbValue: DB_VALUES.ranges[2], label: tName('ranges.gi') },
      { dbValue: DB_VALUES.ranges[3], label: tName('ranges.jl') },
      { dbValue: DB_VALUES.ranges[4], label: tName('ranges.mn') },
    ],
    [
      { dbValue: DB_VALUES.ranges[5], label: tName('ranges.oq') },
      { dbValue: DB_VALUES.ranges[6], label: tName('ranges.rt') },
      { dbValue: DB_VALUES.ranges[7], label: tName('ranges.uw') },
      { dbValue: DB_VALUES.ranges[8], label: tName('ranges.xz') },
    ],
  ];

  const nameOptions = nameRanges.flat();

  const cities = DB_VALUES.cities.map((dbValue, index) => ({
    dbValue,
    label: tCity(
      `options.${['beni', 'chuquisaca', 'cochabamba', 'laPaz', 'oruro', 'pando', 'potosi', 'santaCruz', 'tarija'][index]}`,
    ),
  }));

  // SIEMPRE mostrar todas las categorías estáticas con sus traducciones
  // Obtener los contadores del backend, pero mantener la lista completa
  const jobTypes = DB_VALUES.jobTypes.map((dbValue, index) => ({
    dbValue,
    label: tJob(
      `options.${['mason', 'carpenter', 'locksmith', 'decorator', 'electrician', 'plumber', 'fumigator', 'installer', 'gardener', 'cleaner', 'mechanic', 'assembler', 'painter', 'polisher', 'welder', 'roofer', 'glazier', 'plasterer'][index]}`,
    ),
  }));
  // Mantener orden alfabético por etiqueta (no reordenar por conteos)
  const jobTypesSorted = React.useMemo(() => {
    return [...jobTypes].sort((a, b) =>
      a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }),
    );
  }, [jobTypes]);
  return (
    <>
      <div
        className={`fixed inset-0 bg-black duration-300 z-40 ${
          isOpen ? 'opacity-0' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`${roboto.variable} font-sans fixed top-0 left-0 h-full w-full max-w-[265px] md:w-64 md:max-w-none bg-white shadow-xl z-80 transform transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>

        <div className='p-4 sm:p-6 h-full flex flex-col'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-base sm:text-lg font-bold'>{t('filters')}</h2>

            <div className='flex items-center gap-2'>
              <button
                onClick={handleReset}
                className='bg-[#2B6AE0] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2B31E0] transition-colors'
              >
                {t('resetButton.desktop')}
              </button>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto custom-scrollbar'>
            {/* Filtro: Nombre de Fixer */}
            <div className='mb-6'>
              <div
                className='bg-[#2B6AE0] text-white px-4 py-2 text-sm font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors'
                onClick={() => toggleSection('fixer')}
              >
                <span className='truncate'>{t('fixerName')}</span>
              </div>
              {openSections.fixer && (
                <div className='bg-white border border-gray-200 p-4 rounded max-h-[130px] overflow-y-auto custom-scrollbar'>
                  <div className='flex flex-col gap-2'>
                    {nameOptions.map((range) => {
                      const count = getRangeCount(range.dbValue);
                      const disabled = false;
                      return (
                        <label
                          key={range.dbValue}
                          className={`flex items-center justify-between gap-2 text-xs min-w-0 transition-colors ${'cursor-pointer hover:text-[#2B31E0]'}`}
                        >
                          <div className={`flex items-center gap-2`}>
                            <input
                              type='checkbox'
                              className='w-4 h-4 cursor-pointer flex-shrink-0'
                              checked={selectedRanges.includes(range.dbValue)}
                              onChange={() => handleRangeChange(range.dbValue)}
                              disabled={disabled}
                            />
                            <span className='truncate'>{range.label}</span>
                          </div>
                          {loadingCounts ? (
                            <span className='inline-block h-4 w-8 bg-gray-200 rounded animate-pulse' />
                          ) : (
                            <span
                              className={`${count > 0 ? 'text-[#2B6AE0]' : 'text-gray-400'} text-xs`}
                            >
                              ({count})
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Filtro: Ciudad */}
            <div className='mb-6'>
              <div
                className='bg-[#2B6AE0] text-white px-4 py-2 text-sm font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors'
                onClick={() => toggleSection('ciudad')}
              >
                <span className='truncate'>{t('city')}</span>
              </div>
              {openSections.ciudad && (
                <div className='bg-white border border-gray-200 p-4 rounded max-h-[130px] overflow-y-auto custom-scrollbar'>
                  <div className='flex flex-col gap-2'>
                    {cities.map((city) => {
                      const isSelected = selectedCities.includes(city.dbValue);
                      const isAutoMarked =
                        filtersFromStore.isAutoSelectedCity &&
                        filtersFromStore.city.includes(city.dbValue);
                      const count = backendCounts?.cities?.[city.dbValue] ?? 0;
                      const disabled = filtersFromStore.isAutoSelectedCity && !isAutoMarked;

                      return (
                        <label
                          key={city.dbValue}
                          className={`flex items-center justify-between gap-2 text-xs min-w-0 transition-colors ${
                            disabled
                              ? 'opacity-50 cursor-not-allowed text-gray-400 pointer-events-none'
                              : 'cursor-pointer hover:text-[#2B31E0]'
                          }`}
                        >
                          <div
                            className={`flex items-center gap-2 ${disabled ? 'pointer-events-none' : ''}`}
                          >
                            <input
                              type='checkbox'
                              className='w-4 h-4 flex-shrink-0 cursor-pointer'
                              checked={isSelected}
                              onChange={() => handleCityChange(city.dbValue)}
                              disabled={disabled}
                            />
                            <span className='truncate'>{city.label}</span>
                          </div>
                          {loadingCounts ? (
                            <span className='inline-block h-4 w-8 bg-gray-200 rounded animate-pulse' />
                          ) : (
                            <span
                              className={`${count > 0 ? 'text-[#2B6AE0]' : 'text-gray-400'} text-xs`}
                            >
                              ({count})
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Filtro: Tipo de Trabajo */}
            <div className='mb-6'>
              <div
                className='bg-[#2B6AE0] text-white px-4 py-2 text-sm font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors'
                onClick={() => toggleSection('trabajo')}
              >
                <span className='truncate'>{t('jobCategory')}</span>
              </div>
              {openSections.trabajo && (
                <div className='bg-white border border-gray-200 p-4 rounded max-h-[130px] overflow-y-auto custom-scrollbar'>
                  <div className='flex flex-col gap-2'>
                    {jobTypesSorted.map((job) => {
                      const isSelected = selectedJobs.includes(job.dbValue);
                      const count = backendCounts?.categories?.[job.dbValue] ?? 0;
                      // Nunca deshabilitar, siempre permitir selección
                      const disabled = false;

                      return (
                        <label
                          key={job.dbValue}
                          className='flex items-center justify-between gap-2 text-xs min-w-0 transition-colors cursor-pointer hover:text-[#2B31E0]'
                        >
                          <div className='flex items-center gap-2'>
                            <input
                              type='checkbox'
                              className='w-4 h-4 flex-shrink-0 cursor-pointer'
                              checked={isSelected}
                              onChange={() => handleJobChange(job.dbValue)}
                              disabled={disabled}
                            />
                            <span className='truncate'>{job.label}</span>
                          </div>
                          {loadingCounts ? (
                            <span className='inline-block h-4 w-8 bg-gray-200 rounded animate-pulse' />
                          ) : (
                            <span
                              className={`${count > 0 ? 'text-[#2B6AE0]' : 'text-gray-400'} text-xs`}
                            >
                              ({count})
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Filtro: Calificación */}
            <div className='mb-6'>
              <div
                className='bg-[#2B6AE0] text-white px-4 py-2 text-sm font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors'
                onClick={() => toggleSection('rating')}
              >
                <span className='truncate'>Calificación</span>
              </div>
              {openSections.rating && (
                <div className='bg-white border border-gray-200 p-3 sm:p-4 rounded'>
                  <div className='flex items-center gap-1 justify-center'>
                    {Array.from({ length: 5 }, (_, idx) => {
                      const starNumber = idx + 1;
                      const filled = (selectedRating ?? 0) >= starNumber;
                      const count = getRatingCount(starNumber);
                      const disabled = false;

                      return (
                        <div
                          key={starNumber}
                          className='flex flex-col items-center gap-1 min-w-[32px]'
                        >
                          <button
                            type='button'
                            onClick={() => !disabled && handleRatingClick(starNumber)}
                            className={`transition-transform touch-manipulation flex-shrink-0 ${
                              disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:scale-110 active:scale-95'
                            }`}
                            aria-label={`${starNumber} estrellas`}
                            disabled={disabled}
                          >
                            <Star
                              className='w-[22px] h-[22px] sm:w-[26px] sm:h-[26px]'
                              fill={filled ? '#fbbf24' : '#ffffff'}
                              stroke='#000000'
                              strokeWidth={2}
                            />
                          </button>
                          {loadingCounts ? (
                            <span className='inline-block h-4 w-8 bg-gray-200 rounded animate-pulse' />
                          ) : (
                            <span
                              className={`${count > 0 ? 'text-[#2B6AE0]' : 'text-gray-400'} text-xs whitespace-nowrap`}
                            >
                              ({count})
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
