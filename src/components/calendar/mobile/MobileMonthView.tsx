'use client';
import React from "react";
import DayCell from "./DayCell/DayCell"


interface MobileMonthViewProps {
    year: number;
    month: number; // 0 = enero
    fixer_id: string;
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
}

export default function MobileMonthView({
    year,
    month,
    fixer_id,
    selectedDate,
    onSelectDate,
}: MobileMonthViewProps) {
    const today = new Date();


    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

    const days: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-12" />);
    }
    //    console.log(selectedDate);

    // Agregar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);

        days.push(
            <DayCell
                key={day}
                date={date}
                fixer_id={fixer_id}
                selectedDate={selectedDate}
                onSelectDate={onSelectDate}

                today={today}

            />
        );
    }
    return (
        <div className="p-4">
            {/* Encabezado de días (lunes = primer día) */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-2">
                <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
            </div>

            {/* Grilla de fechas */}
            <div className="grid grid-cols-7 gap-y-4">
                {days}
            </div>
        </div>
    );
}
