'use client'
import React from "react";
import DateCell from "../dateCell/DateCell"
import useDayUtilities from "@/hooks/useDayUtilities";
import useDailyConts from "@/utils/useDailyConts";
import { useUserRole } from "@/utils/contexts/UserRoleContext";


const today = new Date();
interface DesktopMonthViewProps {
    year: number;
    month: number;

}
export default function DesktopMonthView({
    year,
    month,
}: DesktopMonthViewProps) {


    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

    const days: React.ReactNode[] = [];


    const { fixer_id } = useUserRole();
    const {
        getAppointmentsForDay,
    } = useDailyConts({ date: today, fixer_id });

    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="border-x border-[#b8bec6]" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const {
            isPast,
            isToday,
            getColor,
            getText
        } = useDayUtilities(date);


        days.push(
            <DateCell
                key={day}
                date={date}
                isToday={isToday}
                isPast={isPast}
                color={getColor(getAppointmentsForDay(day, month, year))}
                text={getText(getAppointmentsForDay(day, month, year))}

            />

        );
    }

    return (
        <div className="border border-[#b8bec6] w-full h-full" >
            <div className="text-black grid grid-cols-7 text-center text-sm font-medium  bg-[#D9D9D9] ">
                <div className="border border-[#b8bec6]"> Lunes</div ><div className="border border-[#b8bec6]">Martes</div><div className="border border-[#b8bec6]">Miercoles</div><div className="border border-[#b8bec6]">Jueves</div><div className="border border-[#b8bec6]">Viernes</div><div className="border border-[#b8bec6]">Sabado</div><div className="border border-[#b8bec6]">Domingo</div>
            </div >
            <div className="grid grid-cols-7 bg-[#D9D9D9]">
                {days}
            </div>

        </div >

    );

}

