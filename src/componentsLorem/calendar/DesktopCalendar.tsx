
'use client';
import { useState, useMemo } from "react";
import DesktopMonthView from "@/componentsLorem/calendar/month/DesktopMonthView/DesktopMonthView";
import HeaderDesktop from "@/componentsLorem/calendar/Header/HeaderDesktop";
import useAppointmentsByDate from "@/hooks/useDailyAppointments";
import useCalendarView from "@/hooks/useCalendarView";
import DesktopDailyView from "./day/DesktopDailyView";
import DesktopWeekView from "./week/DesktopWeekView";





interface DesktopCalendarProps {
    fixer_id: string;
    requester_id: string;
}


export default function DesktopCalendar({
    fixer_id,
    requester_id
}: DesktopCalendarProps) {
    const date = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);
    const [month, setMonth] = useState(date.getMonth());
    const [year, setYear] = useState(date.getFullYear());
    const [day, setDay] = useState(date.getDate());
    const {
        view,
        handleMonthView,
        handleWeekView,
        handleDayView
    } = useCalendarView();

    const selectedDate = useMemo(() => {
        return new Date(year, month, day);
    }, [year, month, day, view]);




    //    console.log(`Esta es la fecha actual ${selectedDate}`);
    return (


        <div className="w-full flex flex-col items-center bg-white">
            <div className="w-full max-w-5xl">
                <div className="bg-blue-500 w-full p-1 flex items-center">
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

                <div className=" w-full  justify-center">
                    {view === 'month' && <DesktopMonthView
                        year={year}
                        month={month}
                    />}

                    {view === 'week' && <DesktopWeekView
                        date={selectedDate}
                    />}

                    {view === 'day' && <DesktopDailyView
                        date={selectedDate}
                        fixer_id={fixer_id}
                        requester_id={requester_id}
                    />}
                </div>
            </div>
        </div>
    );
}
