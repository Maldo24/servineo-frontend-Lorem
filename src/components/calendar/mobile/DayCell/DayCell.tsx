
'use client';

import React from 'react';
interface DayCellProps {
    date: Date;
    isToday: boolean;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    color: string
}

export default function DayCell({
    date,
    isToday,
    selectedDate,
    onSelectDate,
    color
}: DayCellProps) {
    const dayNumber = date.getDate();

    const isSelected = false;
    const todayRing = isToday ? 'ring-2 ring-blue-600 ring-offset-2' : '';
    return (
        <button
            onClick={() => onSelectDate(date)}
            className={`
        relative flex items-center justify-center w-10 h-10 mx-auto rounded-full 
        select-none font-medium cursor-pointer  
        ${isSelected ? "bg-blue-500" : color} ${todayRing}
      `}
        >
            <span>{dayNumber}</span>

        </button>
    );
};

