'use client';

import React, { useState, useEffect } from 'react';
import { roboto } from '@/app/fonts';
import { validateFilters } from '@/app/lib/validations/filter.validator';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/app/redux/hooks';
import { DB_VALUES } from '@/app/redux/contants';

interface FilterState {
  range: string[];
  city: string;
  category: string[];
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersApply?: (filters: FilterState) => void;
  onReset?: () => void;
}

export function FilterDrawer({ isOpen, onClose, onFiltersApply, onReset }: FilterDrawerProps) {
  const filtersFromStore = useAppSelector((state) => state.jobOfert.filters);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    fixer: false,
    ciudad: false,
    trabajo: false,
  });

  const t = useTranslations('filtersPanel');
  const tName = useTranslations('advancedSearch.fixerName');
  const tCity = useTranslations('advancedSearch.city');
  const tJob = useTranslations('advancedSearch.jobType');

  const [selectedRanges, setSelectedRanges] = useState<string[]>(filtersFromStore.range || []);
  const [selectedCity, setSelectedCity] = useState<string>(filtersFromStore.city || '');
  const [selectedJobs, setSelectedJobs] = useState<string[]>(filtersFromStore.category || []);

  useEffect(() => {
    setSelectedRanges(filtersFromStore.range || []);
    setSelectedCity(filtersFromStore.city || '');
    setSelectedJobs(filtersFromStore.category || []);
  }, [filtersFromStore]);

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

  const handleRangeChange = (dbValue: string) => {
    const newRanges = selectedRanges.includes(dbValue)
      ? selectedRanges.filter((r) => r !== dbValue)
      : [...selectedRanges, dbValue];

    setSelectedRanges(newRanges);
    applyFilters(newRanges, selectedCity, selectedJobs);
  };

  const handleCityChange = (dbValue: string) => {
    const newCity = selectedCity === dbValue ? '' : dbValue;
    setSelectedCity(newCity);
    applyFilters(selectedRanges, newCity, selectedJobs);
  };

  const handleJobChange = (dbValue: string) => {
    const newJobs = selectedJobs.includes(dbValue)
      ? selectedJobs.filter((j) => j !== dbValue)
      : [...selectedJobs, dbValue];

    setSelectedJobs(newJobs);
    applyFilters(selectedRanges, selectedCity, newJobs);
  };

  const applyFilters = (ranges: string[], city: string, jobs: string[]) => {
    const filtersToValidate = { range: ranges, city, category: jobs };
    const { isValid, data } = validateFilters(filtersToValidate);

    if (!isValid || !data) return;

    if (onFiltersApply) {
      onFiltersApply({
        ...data,
        city: data.city || '',
      });
    }
  };

  const handleReset = () => {
    setSelectedRanges([]);
    setSelectedCity('');
    setSelectedJobs([]);

    if (onReset) {
      onReset();
    } else if (onFiltersApply) {
      onFiltersApply({
        range: [],
        city: '',
        category: [],
      });
    }
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

  const cities = DB_VALUES.cities.map((dbValue, index) => ({
    dbValue,
    label: tCity(
      `options.${['beni', 'chuquisaca', 'cochabamba', 'laPaz', 'oruro', 'pando', 'potosi', 'santaCruz', 'tarija'][index]}`,
    ),
  }));

  const jobTypes = DB_VALUES.jobTypes.map((dbValue, index) => ({
    dbValue,
    label: tJob(
      `options.${['mason', 'carpenter', 'locksmith', 'decorator', 'electrician', 'plumber', 'fumigator', 'installer', 'gardener', 'cleaner', 'mechanic', 'assembler', 'painter', 'polisher', 'welder', 'roofer', 'glazier', 'plasterer'][index]}`,
    ),
  }));

  return (
    <>
      <div
        className={`fixed inset-0 bg-black duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`${roboto.variable} font-sans fixed top-0 left-0 h-full w-[75%] sm:w-63 bg-white shadow-xl z-80 transform transition-transform duration-300 ease-in-out overflow-hidden ${
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

        <div className="p-4 sm:p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base sm:text-lg font-bold">{t('filters')}</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="bg-[#2B6AE0] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2B31E0] transition-colors"
              >
                {t('resetButton.desktop')}
              </button>
              <button
                onClick={onClose}
                className="sm:hidden text-gray-500 hover:text-gray-700 p-2"
                aria-label="Cerrar filtros"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Filtro: Nombre de Fixer */}
            <div className="mb-6">
              <div
                className="bg-[#2B6AE0] text-white px-4 py-2 text-sm font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors"
                onClick={() => toggleSection('fixer')}
              >
                <span className="truncate">{t('fixerName')}</span>
              </div>
              {openSections.fixer && (
                <div className="bg-white border border-gray-200 p-4 rounded">
                  <div className="flex gap-2">
                    {nameRanges.map((column, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-2 flex-1">
                        {column.map((range) => (
                          <label
                            key={range.dbValue}
                            className="flex items-center gap-2 text-xs cursor-pointer hover:text-[#2B31E0] transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 cursor-pointer flex-shrink-0"
                              checked={selectedRanges.includes(range.dbValue)}
                              onChange={() => handleRangeChange(range.dbValue)}
                            />
                            <span className="truncate">{range.label}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filtro: Ciudad */}
            <div className="mb-6">
              <div
                className="bg-[#2B6AE0] text-white px-4 py-2 text-sm font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors"
                onClick={() => toggleSection('ciudad')}
              >
                <span className="truncate">{t('city')}</span>
              </div>
              {openSections.ciudad && (
                <div className="bg-white border border-gray-200 p-4 rounded max-h-[130px] overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col gap-2">
                    {cities.map((city) => (
                      <label
                        key={city.dbValue}
                        className="flex items-center gap-2 text-xs cursor-pointer min-w-0 hover:text-[#2B31E0] transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer flex-shrink-0"
                          checked={selectedCity === city.dbValue}
                          onChange={() => handleCityChange(city.dbValue)}
                        />
                        <span className="truncate">{city.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filtro: Tipo de Trabajo */}
            <div className="mb-6">
              <div
                className="bg-[#2B6AE0] text-white px-4 py-2 text-sm font-semibold mb-3 cursor-pointer hover:bg-[#2B31E0] rounded-none transition-colors"
                onClick={() => toggleSection('trabajo')}
              >
                <span className="truncate">{t('jobCategory')}</span>
              </div>
              {openSections.trabajo && (
                <div className="bg-white border border-gray-200 p-4 rounded max-h-[130px] overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col gap-2">
                    {jobTypes.map((job) => (
                      <label
                        key={job.dbValue}
                        className="flex items-center gap-2 text-xs cursor-pointer min-w-0 hover:text-[#2B31E0] transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer flex-shrink-0"
                          checked={selectedJobs.includes(job.dbValue)}
                          onChange={() => handleJobChange(job.dbValue)}
                        />
                        <span className="truncate">{job.label}</span>
                      </label>
                    ))}
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
