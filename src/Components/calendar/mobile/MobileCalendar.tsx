'use client';
import React, { useState, useEffect } from 'react';
import MobileHeader from './MobileHeader';
import MobileMonthView from './MobileMonthView';

interface MobileCalendarProps {
  selectedDate: Date;
  onSelectDate: (dato: Date) => void;
}
export default function MobileCalendar({ selectedDate, onSelectDate }: MobileCalendarProps) {
  const today = selectedDate || new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [date, setDate] = useState(today.getDate());
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (selectedDate) {
      setTempSelectedDate(selectedDate);
      setYear(selectedDate.getFullYear());
      setMonth(selectedDate.getMonth());
    }
  }, [selectedDate]);

  const [tempSelectedDate, setTempSelectedDate] = useState<Date>(selectedDate);
  const handleSelectedClick = () => {
    if (tempSelectedDate) {
      onSelectDate(tempSelectedDate);
    } else {
      setMessage('Por favor selecciona una fecha primero');
    }
  };

  return (
    <div className='bg-white rounded-2xl shadow p-4 max-w-md mx-auto'>
      <MobileHeader
        month={month}
        year={year}
        date={date}
        onChangeMonth={setMonth}
        onChangeYear={setYear}
        onChangeDate={setDate}
      />

      <MobileMonthView
        year={year}
        month={month}
        selectedDate={tempSelectedDate}
        onSelectDate={setTempSelectedDate}
      />

      <div className='flex justify-end mt-4'>
        <button
          onClick={handleSelectedClick}
          className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-2xl
               active:bg-gray-500 transition-colors'
        >
          Seleccionar
        </button>
      </div>

      {message && <div className='mt-2 text-gray-700 font-medium text-center'>{message}</div>}
    </div>
  );
}
