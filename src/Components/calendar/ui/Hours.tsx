'use client';
import React from 'react';
export default function Hours() {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const setZero = (hour: number) => {
    return hour < 10 ? `0${hour}` : `${hour}`;
  };
  return (
    <div className='w-24 flex-shrink-0 bg-[#D9D9D9] border-b border-black '>
      {hours.map((hour) => (
        <div
          key={`hour-${hour}`}
          className='h-15 flex items-center px-1 text-black text-sm border-x'
        >
          {setZero(hour)}:00 - {setZero(hour + 1)}:00
        </div>
      ))}
    </div>
  );
}
