'use client';
import React from 'react';

interface DateCellProps {
    date: Date;
    isToday: boolean;
    isPast: boolean;
    color: string;
    text: string;
}

export default function DateCell({
    date,
    isToday,
    isPast,
    color,
    text
}: DateCellProps) {
    const day = date.getDate();

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
