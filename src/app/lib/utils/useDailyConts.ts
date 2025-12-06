import { getSchedulesCont } from './getSchedulesCont';
import { useState, useCallback, useEffect, useRef } from 'react';
import { getAppointmentsDisable, Days } from './getAppointmentsDisable';

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
    6: 'sabado',
};

export default function useDailyConts({ date, fixer_id }: useDailyContsProps) {
    const [count, setCount] = useState<Record<string, Record<string, number>> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appointmentsDis, setAppointmentsDis] = useState<Days>({
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: [],
    });

    const hasFetched = useRef(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    useEffect(() => {
        if (hasFetched.current && refreshTrigger === 0) {
            return;
        }

        async function fetchData() {
            // ✅ VALIDACIÓN MEJORADA: evitar llamadas con IDs inválidos
            if (!fixer_id || fixer_id === '' || fixer_id === 'undefined' || fixer_id === 'placeholder') {
                console.warn('[useDailyConts] fixer_id no válido, saltando fetch:', fixer_id);
                setLoading(false);
                return;
            }

            console.log('[useDailyConts] Iniciando fetch con fixer_id:', fixer_id);
            setLoading(true);
            setError(null);

            try {
                const [countData, disabledData] = await Promise.all([
                    getSchedulesCont(fixer_id, month, year),
                    getAppointmentsDisable(fixer_id),
                ]);

                setCount(countData);
                setAppointmentsDis(disabledData);
                setError(null);
                hasFetched.current = true;
                console.log('[useDailyConts] ✅ Datos cargados exitosamente');
            } catch (err) {
                console.error('[useDailyConts] ❌ Error fetching schedules:', err);
                setError('Error al cargar los datos');
                setCount(null);
                setAppointmentsDis({
                    lunes: [],
                    martes: [],
                    miercoles: [],
                    jueves: [],
                    viernes: [],
                    sabado: [],
                    domingo: [],
                });
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [fixer_id, month, year, refreshTrigger]);

    const refetch = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    const getAppointmentsForDay = useCallback(
        (
            day: number,
            monthParam: number,
            yearParam: number,
        ): 'full' | 'partial' | 'available' | 'disabled' => {
            const date = new Date(yearParam, monthParam, day);
            const dayOfWeek = date.getDay();
            const dayName = DAY_MAP[dayOfWeek];

            const max = appointmentsDis[dayName].length;

            if (!count) return 'available';

            const monthStr = String(monthParam + 1).padStart(2, '0');
            const format1 = `${monthStr}-${yearParam}`;
            const monthData = count[format1];

            if (!monthData) return 'available';

            const appointmentsCont = monthData[String(day)];

            if (max === 0) {
                return 'disabled';
            } else if (appointmentsCont === undefined || appointmentsCont === 0) {
                return 'available';
            } else if (appointmentsCont >= max) {
                return 'full';
            }

            return 'partial';
        },
        [count, appointmentsDis],
    );

    return {
        count,
        loading,
        error,
        refetch,
        getAppointmentsForDay,
    };
}
