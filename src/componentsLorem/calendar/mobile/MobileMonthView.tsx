'use client';
import React from "react";
import DayCell from "./DayCell/DayCell"
import useDayUtilities from '@/hooks/useDayUtilities';

import { useUserRole } from "@/utils/contexts/UserRoleContext";

import useDailyConts from "@/utils/useDailyConts";

const today = new Date();
interface MobileMonthViewProps {
    year: number;
    month: number;
    selectedDate: Date;

    onSelectDate: (date: Date) => void;
}


export default function MobileMonthView({
    year,
    month,

    selectedDate,
    onSelectDate,

}: MobileMonthViewProps) {
    const { fixer_id } = useUserRole();

    const {
        getColor
    } = useDayUtilities(
        today
    );

    const {
        getAppointmentsForDay,
    } = useDailyConts({ date: today, fixer_id });


    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

    const days: React.ReactNode[] = [];




    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);

        days.push(
            <DayCell
                key={day}
                date={date}
                selectedDate={selectedDate}
                onSelectDate={onSelectDate}
                color={getColor(getAppointmentsForDay(day, month, year))}
            />
        );

    }
    return (
        <div className="p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-2">
                <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
            </div>

            <div className="grid grid-cols-7 gap-y-4">
                {days}
            </div>
        </div>
    );
}
