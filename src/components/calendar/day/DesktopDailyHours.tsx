'use client';
import React from "react";

import HourCell from "./HourCell/HourCell";


interface DesktopDailyViewProps {

    date: Date;
    view: 'week' | 'day';
}

const today = new Date();
const currentHour = today.getHours();

export default function DesktopDailyHours({
    date,
    view
}: DesktopDailyViewProps) {

    const isPast = (hour: number) => {
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (dateOnly < todayOnly) {
            return true;
        }

        if (dateOnly.getTime() === todayOnly.getTime()) {
            return hour < currentHour;
        }

        return false;
    }
    const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();



    const hours = Array.from({ length: 24 }, (_, i) => i);


    return (
        <div className="flex-1 flex flex-col">
            {hours.map(hour => (
                <HourCell
                    key={hour}
                    date={date}
                    hour={hour}
                    isPast={isPast(hour)}
                    isToday={isToday}
                    view={view}
                />
            ))}
        </div>
    );

}
