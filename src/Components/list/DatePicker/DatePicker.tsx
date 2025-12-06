'use client';
import React, { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
    selectedDate: Date;
    onDateChange: (newDate: Date) => void;
}

const DEBOUNCE_DELAY = 300; // milliseconds

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
    const [day, setDay] = useState<string>(selectedDate.getDate().toString());
    const [month, setMonth] = useState<string>((selectedDate.getMonth() + 1).toString());
    const [year, setYear] = useState<string>(selectedDate.getFullYear().toString());
    const [isFocused, setIsFocused] = useState(false);

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSelectedDateRef = useRef<Date>(selectedDate);

    useEffect(() => {
        // Only update local state if selectedDate changed externally (not from our own updates)
        // and the component is not currently focused (user is not typing)
        if (!isFocused && selectedDate.getTime() !== lastSelectedDateRef.current.getTime()) {
            setDay(selectedDate.getDate().toString());
            setMonth((selectedDate.getMonth() + 1).toString());
            setYear(selectedDate.getFullYear().toString());
            lastSelectedDateRef.current = selectedDate;
        }
    }, [selectedDate, isFocused]);

    // Cleanup debounce timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
    };

    const notifyDateChange = (newDay: number, newMonth: number, newYear: number) => {
        // Clear any existing debounce timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Debounce the parent notification to prevent feedback loop during rapid typing
        debounceTimeoutRef.current = setTimeout(() => {
            if (onDateChange) {
                const newDate = new Date(newYear, newMonth - 1, newDay, 12, 0, 0);
                lastSelectedDateRef.current = newDate; // Track that we're updating
                onDateChange(newDate);
            }
        }, DEBOUNCE_DELAY);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Only allow numeric input
        if (value !== '' && !/^\d+$/.test(value)) return;

        setDay(value);

        const newDay = parseInt(value);
        if (isNaN(newDay) || value === '') return;

        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        if (isNaN(monthNum) || isNaN(yearNum)) return;

        const maxDays = getDaysInMonth(monthNum, yearNum);
        const validDay = Math.min(Math.max(1, newDay), maxDays);

        // Update display if value exceeds valid range
        if (newDay > maxDays) {
            setDay(validDay.toString());
        }

        notifyDateChange(validDay, monthNum, yearNum);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Only allow numeric input
        if (value !== '' && !/^\d+$/.test(value)) return;

        setMonth(value);
        const newMonth = parseInt(value);
        if (isNaN(newMonth) || value === '') return;

        // Limit month to 1-12 range
        const validMonth = Math.min(Math.max(1, newMonth), 12);
        if (newMonth > 12) {
            setMonth('12');
        }

        const dayNum = parseInt(day);
        const yearNum = parseInt(year);
        if (isNaN(dayNum) || isNaN(yearNum)) return;

        const maxDays = getDaysInMonth(validMonth, yearNum);
        const validDay = Math.min(Math.max(1, dayNum), maxDays);
        if (dayNum > maxDays) {
            setDay(validDay.toString());
        }
        notifyDateChange(validDay, validMonth, yearNum);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Only allow numeric input and limit to reasonable year length (4 digits)
        if (value !== '' && (!/^\d+$/.test(value) || value.length > 4)) return;

        setYear(value);
        const newYear = parseInt(value);
        if (isNaN(newYear) || value === '') return;

        const dayNum = parseInt(day);
        const monthNum = parseInt(month);
        if (isNaN(dayNum) || isNaN(monthNum)) return;

        // Validate day for the new year (in case of leap year changes)
        const maxDays = getDaysInMonth(monthNum, newYear);
        const validDay = Math.min(Math.max(1, dayNum), maxDays);
        if (dayNum > maxDays) {
            setDay(validDay.toString());
        }

        notifyDateChange(validDay, monthNum, newYear);
    };

    const handleDayBlur = () => {
        const dayNum = parseInt(day);
        if (isNaN(dayNum) || day === '') {
            setDay(selectedDate.getDate().toString());
        } else {
            // Clear debounce and immediately notify parent if date changed
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            if (!isNaN(monthNum) && !isNaN(yearNum)) {
                const maxDays = getDaysInMonth(monthNum, yearNum);
                const validDay = Math.min(Math.max(1, dayNum), maxDays);
                if (validDay !== dayNum) {
                    setDay(validDay.toString());
                }
                const newDate = new Date(yearNum, monthNum - 1, validDay, 12, 0, 0);
                // Only notify if the date is actually different
                if (newDate.getTime() !== selectedDate.getTime()) {
                    lastSelectedDateRef.current = newDate;
                    onDateChange(newDate);
                }
            }
        }
    };

    const handleMonthBlur = () => {
        const monthNum = parseInt(month);
        if (isNaN(monthNum) || month === '') {
            setMonth((selectedDate.getMonth() + 1).toString());
        } else {
            // Enforce valid month range 1-12
            const validMonth = Math.min(Math.max(1, monthNum), 12);
            if (validMonth !== monthNum) {
                setMonth(validMonth.toString());
            }

            // Clear debounce and immediately notify parent if date changed
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            const dayNum = parseInt(day);
            const yearNum = parseInt(year);
            if (!isNaN(dayNum) && !isNaN(yearNum)) {
                const maxDays = getDaysInMonth(validMonth, yearNum);
                const validDay = Math.min(Math.max(1, dayNum), maxDays);
                if (validDay !== dayNum) {
                    setDay(validDay.toString());
                }
                const newDate = new Date(yearNum, validMonth - 1, validDay, 12, 0, 0);
                // Only notify if the date is actually different
                if (newDate.getTime() !== selectedDate.getTime()) {
                    lastSelectedDateRef.current = newDate;
                    onDateChange(newDate);
                }
            }
        }
    };

    const handleYearBlur = () => {
        const yearNum = parseInt(year);
        if (isNaN(yearNum) || year === '') {
            setYear(selectedDate.getFullYear().toString());
        } else {
            // Clear debounce and immediately notify parent if date changed
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            const dayNum = parseInt(day);
            const monthNum = parseInt(month);
            if (!isNaN(dayNum) && !isNaN(monthNum)) {
                const maxDays = getDaysInMonth(monthNum, yearNum);
                const validDay = Math.min(Math.max(1, dayNum), maxDays);
                if (validDay !== dayNum) {
                    setDay(validDay.toString());
                }
                const newDate = new Date(yearNum, monthNum - 1, validDay, 12, 0, 0);
                // Only notify if the date is actually different
                if (newDate.getTime() !== selectedDate.getTime()) {
                    lastSelectedDateRef.current = newDate;
                    onDateChange(newDate);
                }
            }
        }
    };

    return (
        <div
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onClick={() => setIsFocused(true)}
            className={`flex items-center justify-center bg-white text-gray-800 rounded-xl shadow-sm px-3 py-2 border transition-all duration-200 w-fit cursor-text
                ${isFocused ? 'border-blue-500 ring-2 ring-blue-300 shadow-md' : 'border-gray-200 hover:shadow-md'}
            `}
        >
            <input
                className="w-10 text-center font-medium text-xl focus:outline-none bg-transparent"
                type="text"
                value={day}
                onChange={handleDateChange}
                onBlur={handleDayBlur}
                placeholder="DD"
                onFocus={() => setIsFocused(true)}
            />
            <span className="text-gray-400 text-2xl mx-1">/</span>
            <input
                className="w-10 text-center font-medium text-xl focus:outline-none bg-transparent"
                type="text"
                value={month}
                onChange={handleMonthChange}
                onBlur={handleMonthBlur}
                placeholder="MM"
                onFocus={() => setIsFocused(true)}
            />
            <span className="text-gray-400 text-2xl mx-1">/</span>
            <input
                className="w-14 text-center font-medium text-xl focus:outline-none bg-transparent"
                type="text"
                value={year}
                onChange={handleYearChange}
                onBlur={handleYearBlur}
                placeholder="YYYY"
                onFocus={() => setIsFocused(true)}
            />
        </div>
    );
}
