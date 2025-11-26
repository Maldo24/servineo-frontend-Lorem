'use client';
import React from 'react';

import useDayUtilities from "@/hooks/useDayUtilities";
import { useAppointmentsContext } from "@/utils/contexts/AppointmentsContext/AppoinmentsContext";

interface DateCellProps {
    date: Date;
}

export default function DateCell({
    date
}: DateCellProps) {
    const day = date.getDate();

    const {
        isPast,
        isToday,
        getColor,
        getText
    } = useDayUtilities(date);


    const {
        getAppointmentsForDay
    } = useAppointmentsContext();


    const color = getColor(getAppointmentsForDay(date.getDate(), date.getMonth(), date.getFullYear()));
    const text = getText(getAppointmentsForDay(date.getDate(), date.getMonth(), date.getFullYear()));

    return (
        <div className="border border-[#b8bec6]">
            <div className={`h-30 flex flex-col ${isToday ? "bg-blue-300" : "bg-white"}`}>
                <div className="text-right text-black">{day}</div>
                {!isPast && (
                    <div className="flex-1 flex items-center">
                        <div className={`w-full p-2 rounded-md text-center text-white ${color}`}>
                            <p>{text}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
