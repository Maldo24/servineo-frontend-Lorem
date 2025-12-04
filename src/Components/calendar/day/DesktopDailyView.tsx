'use client';
import React from 'react';
import DesktopDailyHours from './DesktopDailyHours';
import Hours from '../ui/Hours';

interface DesktopDailyViewProps {
  date: Date;
}
function getDayName(dayNumber: number): string {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayNumber];
}
export default function DesktopDailyView({ date }: DesktopDailyViewProps) {
  return (
    <div className='flex'>
      <div>
        <div className='text-white'>
          <p>--</p>
        </div>
        <Hours />
      </div>

      <div className='w-full'>
        <div className=' flex items-center justify-center border-r border-b bg-gray-300 text-black'>
          {getDayName(date.getDay())}{' '}
        </div>
        <DesktopDailyHours date={date} view={'day'} />
      </div>
    </div>
  );
}
