'use client';
import React from 'react';
import useCalendarNavigation from '@/hooks/useCalendarNavigation';
interface MobileHeaderProps {
  year: number;
  month: number;
  date: number;
  onChangeMonth: (newMonth: number) => void;
  onChangeYear: (newYear: number) => void;
  onChangeDate: (newDate: number) => void;
}

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const view = 'month';
export default function MobileHeader({
  year: initialYear,
  month: initialMonth,
  date: initialDate,
  onChangeMonth,
  onChangeYear,
  onChangeDate,
}: MobileHeaderProps) {
  const { year, month, handlePrev, handleNext, isPrevDisabled, isNextDisabled } =
    useCalendarNavigation({
      initialYear,
      initialMonth,
      initialDate,
      view,
      onChangeMonth,
      onChangeYear,
      onChangeDate,
    });

  return (
    <div className='text-black flex justify-between items-center mb-4 px-2'>
      <div className='flex items-center gap-2'>
        <button
          onClick={handlePrev}
          disabled={isPrevDisabled}
          className={`p-1 rounded-full transition-colors ${
            isPrevDisabled
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-gray-200 active:bg-gray-400'
          }`}
        >
          &lt;
        </button>

        <span className='text-lg font-semibold'>{monthNames[month]}</span>

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`p-1 rounded-full transition-colors ${
            isNextDisabled
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-gray-200 active:bg-gray-400'
          }`}
        >
          &gt;
        </button>
      </div>

      <div className='flex items-center gap-2'>
        <span className='text-lg font-semibold'>{year}</span>
      </div>
    </div>
  );
}
