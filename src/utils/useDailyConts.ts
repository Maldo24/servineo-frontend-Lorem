import { getSchedulesCont } from "@/utils/getSchedulesCont";
import { useState, useCallback, useEffect } from "react";

interface useDailyContsProps {
    date: Date;
    fixer_id: string;
}

export default function useDailyConts({
    date,
    fixer_id
}: useDailyContsProps) {
    const [count, setCount] = useState<Record<string, Record<string, number>> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const fetchData = useCallback(async () => {
        if (!fixer_id || fixer_id === '' || fixer_id === 'undefined') {
            console.warn('fixer_id no válido:', fixer_id);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const result = await getSchedulesCont(fixer_id, month, year);
            setCount(result);
        } catch (err) {
            console.error('Error fetching schedules:', err);
            setError('Error al cargar los datos');
            setCount(null);
        } finally {
            setLoading(false);
        }
    }, [fixer_id, month, year]);

    useEffect(() => {
        fetchData();
    }, []);


    const getAppointmentsForDay = useCallback((day: number, month: number, year: number): number => {

        if (!count) return 0;

        const monthStr = String(month + 1).padStart(2, '0');

        const format1 = `${monthStr}-${year}`;


        const monthData = count[format1];

        if (!monthData) return 0;

        return monthData[String(day)];
    }, [count, month, year]);



    const getAppointmentsForDate = useCallback((date: Date): number => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return getAppointmentsForDay(day, month, year);
    }, [getAppointmentsForDay]);



    return {
        count,
        loading,
        error,
        refetch: fetchData,
        getAppointmentsForDay,
        getAppointmentsForDate
    };
}
