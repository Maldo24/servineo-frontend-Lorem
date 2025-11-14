
"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import DesktopCalendar from "@/componentsLorem/calendar/DesktopCalendar";

import MobileCalendar from "@/componentsLorem/calendar/mobile/MobileCalendar";
import MobileList from "@/componentsLorem/list/MobileList";
import { AppointmentsStatusProvider } from "@/utils/contexts/DayliViewRequesterContext";


const fixer_id = "68e87a9cdae3b73d8040102f";
const requester_id = "68ec99ddf39c7c140f42fcfa"

interface CalendarPageProps {
    fixer_id: string;
    requester_id: string;
    view: 'fixer' | 'requester';

}

export default function CalendarPage({
    fixer_id,
    requester_id,
    view

}: CalendarPageProps) {

    const router = useRouter();


    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const today = new Date();

    const handleDataChange = (newDate: Date) => {
        setSelectedDate(newDate);
    }

    return (

        <div className="flex flex-col bg-white min-h-screen">

            <div className="flex items-center">
                <button
                    onClick={() => router.back()}
                    className="p-2 m-4 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors self-start">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 6l12 12M6 18L18 6"
                            strokeWidth={2}
                        />
                    </svg>
                </button>
                <h2 className="text-black p-4 text-2xl text-center">Calendario Diego Paredes</h2>
            </div>

            <AppointmentsStatusProvider
                fixerId={fixer_id}
                requesterId={requester_id}
                selectedDate={selectedDate}
            >
            <div className="flex justify-center md:block hidden">
                <DesktopCalendar
                    fixer_id={fixer_id}
                    requester_id={requester_id}
                />

            </div>

            <div className="flex flex-col md:hidden justify-center gap-4" >
                <MobileCalendar
                    fixer_id={fixer_id}
                    selectedDate={selectedDate}
                    onSelectDate={handleDataChange}

                />
                <div></div>
                <MobileList
                    selectedDate={selectedDate}
                    fixerId={fixer_id}
                    requesterId={requester_id}
                    onDateChange={handleDataChange}
                />
            </div>
            </AppointmentsStatusProvider>
        </div>
    );
}
