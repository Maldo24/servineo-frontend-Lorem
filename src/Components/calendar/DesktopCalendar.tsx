'use client';
import { useState, useEffect } from 'react';
import DesktopMonthView from './month/DesktopMonthView/DesktopMonthView';
import HeaderDesktop from './Header/HeaderDesktop';
import useCalendarView from '@/hooks/useCalendarView';
import DesktopDailyView from './day/DesktopDailyView';
import DesktopWeekView from './week/DesktopWeekView';

interface DesktopCalendarProps {
    selectedDate: Date;
    onDateChange: (newDate: Date) => void;
}

export default function DesktopCalendar({
    selectedDate: selectDate,
    onDateChange
}: DesktopCalendarProps) {
    const [month, setMonth] = useState(selectDate.getMonth());
    const [year, setYear] = useState(selectDate.getFullYear());
    const [day, setDay] = useState(selectDate.getDate());

    const { view, handleMonthView, handleWeekView, handleDayView } = useCalendarView();

    useEffect(() => {
        const newDate = new Date(year, month, day);
        const currentDate = new Date(selectDate);

        if (newDate.getTime() !== currentDate.getTime()) {
            onDateChange(newDate);
        }
    }, [year, month, day]);

    useEffect(() => {
        const selectMonth = selectDate.getMonth();
        const selectYear = selectDate.getFullYear();
        const selectDay = selectDate.getDate();

        if (month !== selectMonth || year !== selectYear || day !== selectDay) {
            setMonth(selectMonth);
            setYear(selectYear);
            setDay(selectDay);
        }
    }, [selectDate]);

    const selectedDate = new Date(year, month, day);


    return (
        <div className="w-full flex flex-col items-center bg-white">
            <div className="w-full max-w-5xl">

                <div className="bg-blue-500 w-full p-1 flex items-center sticky top-0 z-10">
                    <HeaderDesktop
                        year={year}
                        month={month}
                        day={day}
                        onChangeMonth={setMonth}
                        onChangeYear={setYear}
                        onChangeDate={setDay}
                        view={view}
                        onViewChange={{ handleMonthView, handleWeekView, handleDayView }}
                    />
                </div>

                <div className="w-full justify-center overflow-y-auto max-h-[70vh] px-1">
                    {view === 'month' && <DesktopMonthView year={year} month={month} />}
                    {view === 'week' && <DesktopWeekView date={selectedDate} />}
                    {view === 'day' && <DesktopDailyView date={selectedDate} />}
                </div>
            </div>
        </div>
    );
}
