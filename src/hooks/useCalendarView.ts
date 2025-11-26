
import { useState } from "react";
export default function useCalendarView() {
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const handleMonthView = () => setView('month');
    const handleWeekView = () => setView('week');
    const handleDayView = () => setView('day');

    return { view, handleMonthView, handleWeekView, handleDayView };

}
