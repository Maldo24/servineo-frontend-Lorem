'use client';

import React from 'react';
import useDayUtilities from '@/hooks/useDayUtilities';

import { useAppointmentsContext } from '@/utils/contexts/AppointmentsContext/AppoinmentsContext';


interface DayCellProps {
    date: Date;
    selectedDate: Date;

    onSelectDate: (date: Date) => void;
}

export default function DayCell({
    date,
    selectedDate,
    onSelectDate
}: DayCellProps) {
    const dayNumber = date.getDate();
    const {
        isPast,
        isToday,
        isSameDay,
        getColor
    } = useDayUtilities(date);


    const {
        getAppointmentsForDay
    } = useAppointmentsContext();


    const isSelected = isSameDay(date, selectedDate);
    const todayRing = isToday ? 'ring-2 ring-blue-600 ring-offset-2' : '';


    const color = getColor(getAppointmentsForDay(date.getDate(), date.getMonth(), date.getFullYear()));
    const colorControl = () => {
        if (isSelected) {
            return "bg-blue-500 text-white";
        } else {
            if (!isPast) {

                return `${color} text-white`;
            } else {
                return 'text-black';
            }
        }

    }

    return (
        <button
            onClick={() => onSelectDate(date)}
            className={`
        relative flex items-center justify-center w-10 h-10 mx-auto rounded-full 
        select-none font-medium cursor-pointer 
        ${colorControl()} ${todayRing}`}
        >
            <span>{dayNumber}</span>

        </button>
    );
};
