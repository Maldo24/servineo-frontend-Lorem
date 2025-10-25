'use client';
import React, { useState, useEffect } from "react";

interface DatePickerProps {
    selectedDate: Date;
    onDateChange?: (newDate: Date) => void;
}

export default function DatePicker({
    selectedDate,
    onDateChange
}: DatePickerProps) {
    // Usa strings para permitir valores vacíos temporalmente
    const [day, setDay] = useState<string>(selectedDate.getDate().toString());
    const [month, setMonth] = useState<string>((selectedDate.getMonth() + 1).toString());
    const [year, setYear] = useState<string>(selectedDate.getFullYear().toString());
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setDay(selectedDate.getDate().toString());
        setMonth((selectedDate.getMonth() + 1).toString());
        setYear(selectedDate.getFullYear().toString());
    }, [selectedDate]);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
    };

    const notifyDateChange = (newDay: number, newMonth: number, newYear: number) => {
        if (onDateChange) {
            const newDate = new Date(newYear, newMonth - 1, newDay, 12, 0, 0);
            onDateChange(newDate);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDay(value);  // Permite vacío temporalmente

        const newDay = parseInt(value);
        if (isNaN(newDay) || value === '') return;  // No notifica si está vacío

        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        if (isNaN(monthNum) || isNaN(yearNum)) return;

        const maxDays = getDaysInMonth(monthNum, yearNum);
        const validDay = newDay > maxDays ? maxDays : newDay;
        notifyDateChange(validDay, monthNum, yearNum);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMonth(value);  // Permite vacío temporalmente

        const newMonth = parseInt(value);
        if (isNaN(newMonth) || value === '') return;  // No notifica si está vacío

        const dayNum = parseInt(day);
        const yearNum = parseInt(year);
        if (isNaN(dayNum) || isNaN(yearNum)) return;

        const maxDays = getDaysInMonth(newMonth, yearNum);
        const validDay = dayNum > maxDays ? maxDays : dayNum;
        if (dayNum > maxDays) {
            setDay(validDay.toString());
        }
        notifyDateChange(validDay, newMonth, yearNum);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setYear(value);  // Permite vacío temporalmente

        const newYear = parseInt(value);
        if (isNaN(newYear) || value === '') return;  // No notifica si está vacío

        const dayNum = parseInt(day);
        const monthNum = parseInt(month);
        if (isNaN(dayNum) || isNaN(monthNum)) return;

        notifyDateChange(dayNum, monthNum, newYear);
    };

    // Validar al perder el foco (blur) para asegurar valores válidos
    const handleDayBlur = () => {
        const dayNum = parseInt(day);
        if (isNaN(dayNum) || day === '') {
            setDay(selectedDate.getDate().toString());  // Restaura valor original
        }
    };

    const handleMonthBlur = () => {
        const monthNum = parseInt(month);
        if (isNaN(monthNum) || month === '') {
            setMonth((selectedDate.getMonth() + 1).toString());  // Restaura valor original
        }
    };

    const handleYearBlur = () => {
        const yearNum = parseInt(year);
        if (isNaN(yearNum) || year === '') {
            setYear(selectedDate.getFullYear().toString());  // Restaura valor original
        }
    };

    return (
        <div
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onClick={() => setIsFocused(true)}
            className={`flex items-center justify-center bg-white text-gray-800 rounded-xl shadow-sm px-3 py-2 border transition-all duration-200 w-fit cursor-text
                ${isFocused ? "border-blue-500 ring-2 ring-blue-300 shadow-md" : "border-gray-200 hover:shadow-md"}
            `}
        >
            <input
                className="w-10 text-center font-medium text-sm focus:outline-none bg-transparent"
                type="text"  // ← Cambiado a "text" para permitir vacío
                value={day}
                onChange={handleDateChange}
                onBlur={handleDayBlur}  // ← Valida al salir
                placeholder="DD"
                onFocus={() => setIsFocused(true)}
            />
            <span className="text-gray-400 text-lg mx-1">/</span>
            <input
                className="w-10 text-center font-medium text-sm focus:outline-none bg-transparent"
                type="text"  // ← Cambiado a "text"
                value={month}
                onChange={handleMonthChange}
                onBlur={handleMonthBlur}  // ← Valida al salir
                placeholder="MM"
                onFocus={() => setIsFocused(true)}
            />
            <span className="text-gray-400 text-lg mx-1">/</span>
            <input
                className="w-14 text-center font-medium text-sm focus:outline-none bg-transparent"
                type="text"  // ← Cambiado a "text"
                value={year}
                onChange={handleYearChange}
                onBlur={handleYearBlur}  // ← Valida al salir
                placeholder="YYYY"
                onFocus={() => setIsFocused(true)}
            />
        </div>
    );
}
