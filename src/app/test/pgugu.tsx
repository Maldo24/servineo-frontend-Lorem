

"use client";

import { useState, useEffect, useRef } from "react";

import MobileDayliView from '../../componentsLorem/calendar/mobile/MobileDayliView'
const fixer_id = "68e87a9cdae3b73d8040102f";
const requester_id = "68ec99ddf39c7c140f42fcfa"


export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handleDataChange = (newDate: Date) => {
        setSelectedDate(newDate);
    }



    return (
        <div className="flex flex-col bg-white min-h-screen">
            <div className="flex flex-col  justify-center gap-4" >
                <MobileDayliView
                    selectedDate={selectedDate}
                    fixerId={fixer_id}
                    requesterId={requester_id}
                    onDateChange={handleDataChange}
                />
            </div>

        </div>
    );
}
