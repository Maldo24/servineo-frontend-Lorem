
'use client';

import { getSchedulesCont } from '@/utils/getSchedulesCont';
import React, { useEffect, useState } from 'react';
import useDayUtilities from '@/hooks/useDayUtilities';
interface DayCellProps {
    date: Date;
    today: Date;
    fixer_id: string;
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
}

export default function DayCell({
    date,
    today,
    fixer_id,
    selectedDate,
    onSelectDate,
}: DayCellProps) {
    const {
        isToday,
        isPast,
        isSameDay,
        getColor
    } = useDayUtilities(
        date
    );
    const dayNumber = date.getDate();
    const isSelected = selectedDate && isSameDay(date, selectedDate);


    const todayRing = isToday ? 'ring-2 ring-blue-600 ring-offset-2' : '';
    return (
        <button
            onClick={() => onSelectDate(date)}
            className={`
        relative flex items-center justify-center w-10 h-10 mx-auto rounded-full 
        transition-all duration-200 select-none font-medium cursor-pointer  
        ${isSelected ? "bg-blue-500" : getColor()} ${todayRing}
      `}
        >
            <span>{dayNumber}</span>

        </button>
    );
};

