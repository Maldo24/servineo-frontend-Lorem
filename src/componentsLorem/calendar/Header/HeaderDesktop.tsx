'use client';

import React from "react";
import { useState, useEffect } from "react";
import useCalendarNavigation from "@/hooks/useCalendarNavigation";
import HeaderSection from "./HeaderSection";




interface HeaderDesktopProps {
    year: number;
    month: number;
    day: number;
    onChangeMonth: (newMonth: number) => void;
    onChangeYear: (newYear: number) => void;
    onChangeDate: (newDate: number) => void;
    view: 'month' | 'week' | 'day';
    onViewChange: {
        handleMonthView: () => void;
        handleWeekView: () => void;
        handleDayView: () => void;
    }
}

const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
export default function HeaderDesktop({
    year: initialYear,
    month: initialMonth,
    day: initialDay,
    onChangeMonth,
    onChangeYear,
    onChangeDate,
    view,
    onViewChange
}: HeaderDesktopProps) {

    const {
        year,
        month,
        date,
        handlePrev,
        handleNext,
        handleToday,
        isPrevDisabled,
        isNextDisabled,
        getWeekRange
    } = useCalendarNavigation({
        initialYear,
        initialMonth,
        initialDate: initialDay,
        view,
        onChangeMonth,
        onChangeYear,
        onChangeDate
    });


    const { start, end } = getWeekRange();


    return (

        <div className="text-black flex  justify-between items-center my-1 px-2 w-full">
            <HeaderSection buttons={[
                { label: "Anterior", onClick: handlePrev, disabled: isPrevDisabled },
                { label: "Hoy", onClick: handleToday, disabled: isPrevDisabled },
                { label: "Siguiente", onClick: handleNext, disabled: isNextDisabled },
            ]} />


            {view === 'month' && <span className="text-lg font-semibold">{monthNames[month]} {year} </span>}
            {view === 'week' && <span className="text-lg font-semibold">{monthNames[month]} {start.getDate()} - {end.getDate()}</span>}
            {view === 'day' && <span className="text-lg font-semibold">{monthNames[month]} {date} </span>}


            <HeaderSection buttons={[
                { label: "Mes", onClick: onViewChange.handleMonthView, disabled: view === "month" },
                { label: "Semana", onClick: onViewChange.handleWeekView, disabled: view === "week" },
                { label: "Día", onClick: onViewChange.handleDayView, disabled: view === "day" },
            ]} />
        </div >
    );



}



