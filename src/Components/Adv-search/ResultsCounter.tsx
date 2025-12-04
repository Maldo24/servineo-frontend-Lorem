'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

type NoResultsMessageProps = {
  search: string;
};

export const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ search }) => {
  const t = useTranslations('search');
  const trimmed = search?.trim();

  return (
    <div className='text-center py-12'>
      <p className='text-gray-500 text-xl font-roboto font-normal'>
        {t('noResults')}
        {trimmed && (
          <>
            {' '}
            {t('for')} <span className='font-bold'>&quot;{trimmed}&quot;</span>
          </>
        )}
      </p>
    </div>
  );
};

interface ResultsCounterProps {
  total: number;
  loading?: boolean;
}

export function ResultsCounter({ total, loading = false }: ResultsCounterProps) {
  const t = useTranslations('search'); // o 'resultsAdvSearch', donde tengas la key

  return (
    <div className='flex items-center gap-2' style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Móvil */}
      <p className='block md:hidden text-sm font-bold text-gray-900 whitespace-nowrap'>
        {t('resultsCountLabel')}{' '}
        {loading ? (
          <span className='inline-block w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin align-middle ml-1' />
        ) : (
          <span className='text-gray-900'>{total}</span>
        )}
      </p>

      {/* Desktop */}
      <div className='hidden md:flex items-center gap-2'>
        <div className='relative w-10 h-10 flex-shrink-0'>
          <svg viewBox='0 0 120 150' className='w-full h-full' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M 15 20 Q 15 10 25 10 L 95 10 Q 105 10 105 20 L 105 100 L 60 140 L 15 100 Z'
              fill='#E8F4FD'
              stroke='none'
            />
          </svg>

          {/* Ícono dentro del escudo */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <svg className='w-5 h-5 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>

        {/* Texto */}
        <p className='text-sm font-bold text-gray-900 whitespace-nowrap'>
          {t('resultsCountLabel')}{' '}
          {loading ? (
            <span className='inline-block w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin align-middle ml-1' />
          ) : (
            <span className='text-gray-900'>{total}</span>
          )}
        </p>
      </div>
    </div>
  );
}
