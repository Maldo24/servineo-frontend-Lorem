"use client";

import { useState } from "react";
import DaySchedule from "../calendar/mobile/MobileDayliView";
import WeekSchedule from "../calendar/mobile/MobileWeekView";

interface MobileListProps {
  selectedDate: Date;
  fixerId: string;
  requesterId: string;
  onDateChange: (newDate: Date) => void;
}


export default function MobileList({
  selectedDate,
  fixerId,
  requesterId,
  onDateChange,
}: MobileListProps) {
  const [type, setType] = useState<"day" | "week">("day");

  return (
    <div>
      <div className="flex flex-col bg-gray-200 rounded-full p-1 w-fit mx-auto cursor-pointer">
        <div>
          <button
            onClick={() => setType("day")}
            className={`px-4 py-1 rounded-full text-base font-semibold transition-colors duration-200 ${
              type === "day" ? "bg-blue-600 text-white" : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Horario del día
          </button>
          <button
            onClick={() => setType("week")}
            className={`px-4 py-1 rounded-full text-base font-semibold transition-colors duration-200 ${
              type === "week" ? "bg-blue-600 text-white" : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Horario de la semana
          </button>
        </div>
      </div>


      <div className="mt-4">
          {type === "day" && (
            <DaySchedule
              fixerId={fixerId}
              requesterId={requesterId}
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
          )}
      </div>

      <div className="mt-4">
        {type === "week" && (
          <WeekSchedule
            fixerId={fixerId}
            requesterId={requesterId}
            selectedDate={selectedDate}
            onChangeDate={onDateChange}
          />
        )}
      </div>
    </div>
  );
}
