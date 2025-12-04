'use client';
import React, { useState } from 'react';
import { Star } from 'lucide-react';
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

type Props = {
  value?: number | null;
  onChange?: (val: number | null) => void;
};

const CalificacionEstrella: React.FC<Props> = ({ value = null, onChange }) => {
  const t = useTranslations('advancedSearch.rating');
  const [hoverStar, setHoverStar] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMainStar, setSelectedMainStar] = useState<number | null>(null);
  const [hoverSubStar, setHoverSubStar] = useState<number | null>(null);

  const totalStars = 5;
  const subScales = 9; // .1 - .9

  // Limitar el valor entre 1 y 5
  const clampedValue = value != null ? Math.min(5, Math.max(1, value)) : null;
  const mainStarValue = clampedValue ? Math.floor(clampedValue) : null;

  const handleMainStarClick = (star: number) => {
    setSelectedMainStar(star);
    setShowModal(true);
  };

  const handleSubScaleClick = (subScale: number) => {
    if (selectedMainStar && onChange) {
      const decimalValue = subScale === 0 ? selectedMainStar : selectedMainStar + subScale / 10;

      onChange(decimalValue);
    }
    setShowModal(false);
    setSelectedMainStar(null);
  };

  return (
    <div className='relative'>
      <h3 className='text-base mb-2'>{t('label')}</h3>

      {/* Estrellas principales */}
      <div className='bg-white rounded-lg border border-gray-300 p-4 w-fit'>
        <div className='flex items-center gap-2'>
          {Array.from({ length: totalStars }, (_, idx) => {
            const starNumber = idx + 1;
            const filled = (hoverStar ?? mainStarValue ?? 0) >= starNumber;
            return (
              <button
                key={starNumber}
                type='button'
                onClick={() => handleMainStarClick(starNumber)}
                onMouseEnter={() => setHoverStar(starNumber)}
                onMouseLeave={() => setHoverStar(null)}
                className='transition-transform hover:scale-110 active:scale-95 touch-manipulation'
              >
                <Star
                  size={30}
                  fill={filled ? '#fbbf24' : '#ffffff'}
                  stroke='#000000'
                  strokeWidth={2}
                />
              </button>
            );
          })}
        </div>

        {clampedValue && (
          <div className='mt-2 text-sm text-gray-600 text-center'>
            {clampedValue.toFixed(1)} {t('stars')}
          </div>
        )}
      </div>

      {/* MODAL / DROPDOWN */}
      {showModal && (
        <>
          {/* CLIC FUERA PARA CERRAR */}
          <div
            className='fixed inset-0 z-[9998]'
            onClick={() => {
              setShowModal(false);
              setSelectedMainStar(null);
            }}
          />

          {/* CUADRO DE OPCIONES */}
          <div className='absolute mt-2 right-0 translate-x-[160px] bg-white rounded-lg border-2 border-gray-300 shadow-xl p-3 w-64 max-h-[60vh] z-[9999]'>
            <div className='flex items-center justify-between mb-2 pb-2 border-b border-gray-200'>
              <h3 className='text-sm font-semibold'>{t('label')}</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedMainStar(null);
                }}
                className='text-black-600 hover:text-black-800 text-xs font-bold'
              >
                ✖
              </button>
            </div>

            {/* CONTENEDOR CON SCROLL */}
            <div className='overflow-y-auto max-h-32'>
              {/* .0 */}
              <button
                onClick={() => handleSubScaleClick(0)}
                onMouseEnter={() => setHoverSubStar(0)}
                onMouseLeave={() => setHoverSubStar(null)}
                className={`w-full flex items-center gap-2 p-2 rounded-lg mb-1 transition-colors ${
                  hoverSubStar === 0 ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Star size={18} fill='#fbbf24' stroke='#000000' strokeWidth={2} />
                <span className='font-medium text-base'>{selectedMainStar}.0</span>
              </button>

              {/* .1 - .9 */}
              {Array.from({ length: subScales }, (_, idx) => {
                const subNumber = idx + 1; // inicia en .1
                return (
                  <button
                    key={subNumber}
                    onClick={() => handleSubScaleClick(subNumber)}
                    onMouseEnter={() => setHoverSubStar(subNumber)}
                    onMouseLeave={() => setHoverSubStar(null)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg mb-1 transition-colors ${
                      hoverSubStar === subNumber ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Star size={18} fill='#fbbf24' stroke='#000000' strokeWidth={2} />
                    <span className='font-medium text-base'>
                      {selectedMainStar}.{subNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalificacionEstrella;
