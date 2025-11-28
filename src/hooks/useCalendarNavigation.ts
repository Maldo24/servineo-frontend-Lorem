import { useState } from "react";

interface useCalendarNavigationProps {
    initialYear: number;
    initialMonth: number;
    initialDate: number;
    view: 'month' | 'week' | 'day';
    onChangeMonth: (m: number) => void;
    onChangeYear: (y: number) => void;
    onChangeDate: (d: number) => void;
}

interface WeekRange {
    start: Date;
    end: Date;
}
export default function useCalendarNavigation({
    initialYear,
    initialMonth,
    initialDate,
    view,
    onChangeMonth,
    onChangeYear,
    onChangeDate
}: useCalendarNavigationProps) {
    const [year, setYear] = useState(initialYear);
    const [month, setMonth] = useState(initialMonth);
    const [date, setDate] = useState(initialDate);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const updateDate = (newDate: number, newMonth: number, newYear: number) => {
        setDate(newDate);
        setMonth(newMonth);
        setYear(newYear);
        if (onChangeDate) onChangeDate(newDate);
        if (onChangeMonth) onChangeMonth(newMonth);
        if (onChangeYear) onChangeYear(newYear);
    };

    const getWeekRange = (): WeekRange => {
        const current = new Date(year, month, date);
        current.setHours(0, 0, 0, 0);

        const dayOfWeek = current.getDay();

        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        const start = new Date(current);
        start.setDate(current.getDate() + diff);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    };
    const handlePrev = () => {
        if (view === 'month') {
            if (month === 0) {
                updateDate(date, 11, year - 1);
            } else {
                updateDate(date, month - 1, year);
            }
        } else if (view === 'week') {
            const current = new Date(year, month, date);
            current.setDate(current.getDate() - 7);
            updateDate(current.getDate(), current.getMonth(), current.getFullYear());
        } else if (view === 'day') {
            const current = new Date(year, month, date);
            current.setDate(current.getDate() - 1);
            updateDate(current.getDate(), current.getMonth(), current.getFullYear());
        }
    };

    const handleNext = () => {
        if (view === 'month') {
            const nextDate = new Date(year, month + 1, 1);
            const diffMonths =
                (nextDate.getFullYear() - currentDate.getFullYear()) * 12 +
                (nextDate.getMonth() - currentDate.getMonth());
            if (diffMonths > 6) return;

            if (month === 11) {
                updateDate(date, 0, year + 1);
            } else {
                updateDate(date, month + 1, year);
            }
        } else if (view === 'week') {
            const current = new Date(year, month, date);
            current.setDate(current.getDate() + 7);

            const diffTime = current.getTime() - currentDate.getTime();
            const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);
            if (diffMonths > 6) return;

            updateDate(current.getDate(), current.getMonth(), current.getFullYear());
        } else if (view === 'day') {
            const current = new Date(year, month, date);
            current.setDate(current.getDate() + 1);

            const diffTime = current.getTime() - currentDate.getTime();
            const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);
            if (diffMonths > 6) return;

            updateDate(current.getDate(), current.getMonth(), current.getFullYear());
        }
    };

    const handleToday = () => {
        updateDate(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
    };

    const isNextDisabled = (() => {
        if (view === 'month') {
            const nextDate = new Date(year, month + 1, 1);
            const diffMonths = (nextDate.getFullYear() - currentDate.getFullYear()) * 12 + (nextDate.getMonth() - currentDate.getMonth());
            return diffMonths > 6;
        } else if (view === 'week') {
            const current = new Date(year, month, date);
            current.setDate(current.getDate() + 7);
            const diffTime = current.getTime() - currentDate.getTime();
            const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);
            return diffMonths > 6;
        } else if (view === 'day') {
            const current = new Date(year, month, date);
            current.setDate(current.getDate() + 1);
            const diffTime = current.getTime() - currentDate.getTime();
            const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);
            return diffMonths > 6;
        }
        return false;
    })();

    const isPrevDisabled = (() => {
        if (view === 'month') {

            const prevDate = new Date(year, month - 1, 1);
            return prevDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);


        } else if (view === 'week') {

            const current = new Date(year, month, date);
            current.setDate(current.getDate() - 7);

            const todayWeekStart = new Date(currentDate);
            const dayOfWeek = todayWeekStart.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            todayWeekStart.setDate(todayWeekStart.getDate() + diff);
            todayWeekStart.setHours(0, 0, 0, 0);

            return current < todayWeekStart;

        } else if (view === 'day') {
            const current = new Date(year, month, date);
            current.setDate(current.getDate() - 1);
            return current < currentDate;
        }
        return false;
    })();

    return {
        year,
        month,
        date,
        handleToday,
        handlePrev,
        handleNext,
        isPrevDisabled,
        isNextDisabled,
        getWeekRange
    };
}
