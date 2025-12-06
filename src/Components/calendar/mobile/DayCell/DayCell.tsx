'use client';

import React, { useState } from 'react';
import DisabledHourPopup from '@/Components/appointments/forms/popups/DisabledHourPopup';
import useDayUtilities from '@/hooks/useDayUtilities';

import { useAppointmentsContext } from '@/app/lib/utils/contexts/AppointmentsContext/AppoinmentsContext';

interface DayCellProps {
  date: Date;
  selectedDate: Date;

  onSelectDate: (date: Date) => void;
}

export default function DayCell({ date, selectedDate, onSelectDate }: DayCellProps) {
  const dayNumber = date.getDate();
  const { isPast, isToday, isSameDay, getColor } = useDayUtilities(date);
  const { getAppointmentsForDay } = useAppointmentsContext();
  const [disabledPopupOpen, setDisabledPopupOpen] = useState(false);

  const isSelected = isSameDay(date, selectedDate);
  const todayRing = isToday ? 'ring-2 ring-blue-600 ring-offset-2' : '';

  const color = getColor(
    getAppointmentsForDay(date.getDate(), date.getMonth(), date.getFullYear()),
  );
  const colorControl = () => {
    if (isSelected) {
      return 'bg-blue-500 text-white';
    } else {
      if (!isPast) {
        return `${color} text-white`;
      } else {
        return 'text-black';
      }
    }
  };

  // Mensaje para el popup de horario inhabilitado (puedes personalizarlo si tienes roles)
  const getDisabledMessage = () => 'Este horario se encuentra deshabilitado, por favor seleccione otro.';

  const handleClick = () => {
    if (isPast) {
      setDisabledPopupOpen(true);
      return;
    }
    onSelectDate(date);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          relative flex items-center justify-center w-10 h-10 mx-auto rounded-full 
          select-none font-medium cursor-pointer 
          ${colorControl()} ${todayRing}`}
      >
        <span>{dayNumber}</span>
      </button>
      <DisabledHourPopup open={disabledPopupOpen} onClose={() => setDisabledPopupOpen(false)} message={getDisabledMessage()} />
    </>
  );
}
