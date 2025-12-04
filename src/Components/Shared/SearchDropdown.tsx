// src/Components/shared/SearchDropdown.tsx
'use client';

import React from 'react';
import { Clock, Trash2, Star, X, ArrowUpLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface SearchDropdownProps {
  isOpen: boolean;
  history: string[];
  suggestions: string[];
  highlighted: number;
  longPressedItem: string | null;
  query: string;
  onSelectItem: (item: string) => void;
  onPreviewItem: (item: string) => void;
  onDeleteItem: (item: string) => void;
  onClearHistory: () => void;
  onHighlight: React.Dispatch<React.SetStateAction<number>>;
  onLongPressStart: (item: string) => void;
  onLongPressEnd: () => void;
  onCancelDelete: () => void;
  maxVisibleHistory?: number;
  maxVisibleSuggestions?: number;
  className?: string;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  history,
  suggestions,
  highlighted,
  longPressedItem,
  query,
  onSelectItem,
  onPreviewItem,
  onDeleteItem,
  onClearHistory,
  onHighlight,
  onLongPressStart,
  onLongPressEnd,
  onCancelDelete,
  maxVisibleHistory = 5,
  maxVisibleSuggestions = 5,
  className = '',
}) => {
  const t = useTranslations('search');

  // Filtrar historial visible
  const visibleHistory = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) {
      return history.slice(0, maxVisibleHistory);
    }
    return history.filter((h) => h.toLowerCase().includes(q)).slice(0, maxVisibleHistory);
  }, [history, query, maxVisibleHistory]);

  const visibleSuggestions = suggestions.slice(0, maxVisibleSuggestions);

  if (!isOpen) return null;

  return (
    <div
      className={`absolute left-0 right-0 mt-2 bg-white border rounded shadow-md z-50 ${className}`}
      onMouseLeave={() => onHighlight(-1)}
      onPointerLeave={() => onHighlight(-1)}
    >
      {/* SECCIÓN DE HISTORIAL */}
      <div className='px-2 py-1 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Clock className='w-4 h-4 text-slate-500' />
          <span className='text-xs font-semibold uppercase text-slate-500'>
            {t('recentSearches')}
          </span>
        </div>
        <div className='w-8 flex items-center justify-center sm:justify-end sm:w-auto'>
          <button
            type='button'
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              onClearHistory();
            }}
            className='mr-1 flex items-center gap-1 text-sm text-red-500 cursor-pointer px-2 py-1 rounded hover:bg-red-50 whitespace-nowrap'
            aria-label={t('clearHistory')}
          >
            <Trash2 className='w-5 h-5 sm:w-4 sm:h-4' />
            <span className='ml-1 text-sm hidden sm:inline'>{t('clearHistory')}</span>
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className='p-3 text-sm text-slate-500'>{t('noRecentSearches')}</div>
      ) : (
        <ul>
          {visibleHistory.map((item, idx) => (
            <li key={`history-${item}-${idx}`}>
              {longPressedItem === item ? (
                <div className='w-full flex items-center justify-between px-2 py-2 bg-red-50 border-l-4 border-red-500 min-w-0'>
                  <div className='flex-1 min-w-0 text-xs sm:text-sm text-red-700 font-medium sm:truncate'>
                    <span className='block sm:inline leading-tight'>{t('deleteSearch')}</span>
                  </div>
                  <div className='flex items-center gap-2 flex-shrink-0 ml-2'>
                    <button
                      type='button'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onDeleteItem(item);
                        onCancelDelete();
                      }}
                      className='bg-red-500 text-white px-2 py-0.5 rounded text-xs sm:text-sm flex items-center gap-1 max-[420px]:px-1'
                      aria-label={`${t('delete')} ${item}`}
                    >
                      <Trash2 className='hidden max-[420px]:inline w-3.5 h-3.5 sm:w-4 sm:h-4' />
                      <span className='ml-1 max-[420px]:hidden'>{t('delete')}</span>
                    </button>
                    <button
                      type='button'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={onCancelDelete}
                      className='bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs sm:text-sm text-slate-700 hover:bg-slate-200 flex items-center gap-1 max-[420px]:px-1'
                      aria-label={t('cancel')}
                    >
                      <X className='hidden max-[420px]:inline w-3.5 h-3.5 sm:w-4 sm:h-4' />
                      <span className='ml-1 max-[420px]:hidden'>{t('cancel')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  role='button'
                  tabIndex={0}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectItem(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSelectItem(item);
                  }}
                  onMouseEnter={() => onHighlight(idx)}
                  onTouchStart={() => onLongPressStart(item)}
                  onTouchEnd={onLongPressEnd}
                  onTouchMove={onLongPressEnd}
                  onTouchCancel={onLongPressEnd}
                  className={`group w-full flex items-center justify-between gap-2 px-2 py-1 hover:bg-slate-50 focus:bg-slate-50 cursor-pointer ${
                    highlighted === idx ? 'bg-slate-50' : ''
                  }`}
                >
                  <div className='flex items-center gap-1 min-w-0 flex-1'>
                    <Clock className='w-4 h-4 text-slate-400 flex-shrink-0' />
                    <span
                      className='text-sm text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left'
                      title={item}
                    >
                      {item}
                    </span>
                  </div>

                  <div className='flex items-center justify-end gap-2 flex-shrink-0'>
                    <button
                      type='button'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewItem(item);
                      }}
                      className='2xl:hidden p-1 rounded text-slate-400'
                      aria-label={`${t('preview')} ${item}`}
                    >
                      <ArrowUpLeft className='w-4 h-4' />
                    </button>

                    <button
                      type='button'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item);
                      }}
                      className='hidden 2xl:inline-flex opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity cursor-pointer'
                      aria-label={`${t('delete')} ${item}`}
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* SECCIÓN DE SUGERENCIAS */}
      {query.trim().length > 0 && (
        <div className='mt-2'>
          <div className='px-2 py-1'>
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-yellow-400' />
              <span className='text-xs font-semibold uppercase text-slate-500'>
                {t('suggestions')}
              </span>
            </div>
          </div>

          {visibleSuggestions.length === 0 ? (
            <div className='p-3 text-sm text-slate-500'>{t('noSuggestions')}</div>
          ) : (
            <ul>
              {visibleSuggestions.map((sugg, i) => {
                const combinedIndex = visibleHistory.length + i;
                return (
                  <li key={`suggestion-${sugg}-${i}`}>
                    <div
                      role='button'
                      tabIndex={0}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => onSelectItem(sugg)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onSelectItem(sugg);
                      }}
                      onMouseEnter={() => onHighlight(combinedIndex)}
                      className={`w-full flex items-center gap-2 px-2 py-1 hover:bg-slate-50 cursor-pointer min-w-0 ${
                        highlighted === combinedIndex ? 'bg-slate-50' : ''
                      }`}
                    >
                      <Star className='w-4 h-4 text-yellow-400 flex-shrink-0' />
                      <span
                        className='text-sm text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap'
                        title={sugg}
                      >
                        {sugg}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
