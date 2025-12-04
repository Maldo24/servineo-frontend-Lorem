'use client';

import { Filter, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface FilterBarProps {
  filters: string[];
  selectedFilters: string[];
  onFilterChange: (filter: string) => void;
  onClearFilters: () => void;
  className?: string;
  disabled?: boolean;
}

export function FilterBar({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  className = '',
  disabled = false,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center justify-center gap-3 px-6 py-4
          bg-white/90 backdrop-blur-md
          border-2 rounded-2xl
          font-semibold text-foreground
          transition-all duration-300 ease-out
          shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isOpen
              ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105 bg-white'
              : 'border-blue-200 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-102'
          }
          ${disabled ? 'bg-gray-100' : ''}
        `}
      >
        <Filter
          className={`w-5 h-5 transition-all duration-300 ${
            isOpen ? 'text-blue-500 rotate-180 scale-110' : 'text-blue-600'
          }`}
        />
        <span className='text-blue-900'>Filtros</span>

        {selectedFilters.length > 0 && (
          <span className='px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/50 animate-pulse'>
            {selectedFilters.length}
          </span>
        )}
      </button>

      {!disabled && isOpen && filters.length > 0 && (
        <>
          {/* Backdrop overlay */}
          <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />

          <div className='absolute top-full left-0 right-0 mt-3 p-6 bg-white/95 backdrop-blur-xl border-2 border-blue-300 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.3)] z-50 animate-in fade-in slide-in-from-top-4 duration-300'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <Sparkles className='w-4 h-4 text-blue-500' />
                <h3 className='text-sm font-bold text-blue-900'>Selecciona tus filtros</h3>
              </div>
              {selectedFilters.length > 0 && (
                <button
                  onClick={onClearFilters}
                  className='flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors'
                >
                  <X className='w-3 h-3' />
                  Limpiar todo
                </button>
              )}
            </div>

            <div className='flex flex-wrap gap-2'>
              {filters.map((filter, index) => {
                const isSelected = selectedFilters.includes(filter);
                return (
                  <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`
                      px-4 py-2.5 rounded-xl text-sm font-semibold
                      transition-all duration-300 ease-out
                      animate-in fade-in slide-in-from-bottom-2
                      ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105 border-2 border-blue-400'
                          : 'bg-blue-50 text-blue-700 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-100 hover:scale-105 hover:shadow-md'
                      }
                    `}
                  >
                    {filter}
                    {isSelected && (
                      <span className='ml-2 inline-block w-2 h-2 bg-white rounded-full animate-pulse' />
                    )}
                  </button>
                );
              })}
            </div>

            <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50' />
          </div>
        </>
      )}
    </div>
  );
}
