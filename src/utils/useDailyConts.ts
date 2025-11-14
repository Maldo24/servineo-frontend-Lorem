import { getSchedulesCont } from "@/utils/getSchedulesCont";
import { useState, useCallback, useEffect } from "react";

import { getAppointmentsDisable, Days } from "@/utils/getAppointmentsDisable";
interface useDailyContsProps {
    date: Date;
    fixer_id: string;
}


export type DayOfWeek = keyof Days;
const DAY_MAP: { [key: number]: DayOfWeek } = {
    0: 'domingo',
    1: 'lunes',
    2: 'martes',
    3: 'miercoles',
    4: 'jueves',
    5: 'viernes',
    6: 'sabado'
};





export default function useDailyConts({
    date,
    fixer_id
}: useDailyContsProps) {
    const [count, setCount] = useState<Record<string, Record<string, number>> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [appointmentsDis, setAppointmentsDis] = useState<Days>({
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: []
    });


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
            const resultDis = await getAppointmentsDisable(fixer_id);
            setAppointmentsDis(resultDis);

        } catch (err) {
            console.error('Error fetching schedules:', err);
            setError('Error al cargar los datos');
            setCount(null);
            setAppointmentsDis({
                lunes: [],
                martes: [],
                miercoles: [],
                jueves: [],
                viernes: [],
                sabado: [],
                domingo: []
            });

        } finally {
            setLoading(false);
        }
    }, [fixer_id, month, year]);

    useEffect(() => {
        fetchData();
    }, []);


    const getAppointmentsForDay = useCallback((day: number, month: number, year: number):
        'full' | 'partial' | 'available' | 'disabled' => {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const dayName = DAY_MAP[dayOfWeek];

        const max = appointmentsDis[dayName].length;

        if (!count) return 'available';

        const monthStr = String(month + 1).padStart(2, '0');

        const format1 = `${monthStr}-${year}`;

        const monthData = count[format1];


        if (!monthData) return 'available';

        const appointmentsCont = monthData[String(day)];

        if (max === 0) {
            return 'disabled'
        } else if (appointmentsCont === 0) {
            return 'available'
        } else if (appointmentsCont === max) {
            return 'full';
        }
        return 'partial';
    }, [count, month, year]);




    return {
        count,
        loading,
        error,
        refetch: fetchData,
        getAppointmentsForDay,
    };
}
