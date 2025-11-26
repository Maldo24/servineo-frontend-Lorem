import { useEffect, useState, useRef, useCallback } from "react";
import { getAppointmentsByDate, Appointment } from '@/utils/getAppointmentsByDate';
import { getAppointmentsDisable, Days } from "@/utils/getAppointmentsDisable";

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




;



export default function useAppointmentsByDate(fixer_id: string, date: Date) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [appointmentsDis, setAppointmentsDis] = useState<Days>({
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);




    useEffect(() => {
        async function fetchData() {
            if (!fixer_id || fixer_id === '' || fixer_id === 'undefined') {
                console.warn('fixer_id no válido:', fixer_id);
                setLoading(false);
                return;
            }

            setLoading(true);


            try {
                const [appointmentsData, availabilityData] = await Promise.all([
                    getAppointmentsByDate(fixer_id, date.toISOString().split('T')[0]),
                    getAppointmentsDisable(fixer_id)
                ]);

                setAppointments(appointmentsData);
                setAppointmentsDis(availabilityData);
                setError(null);
            } catch (err) {
                setError('Error al cargar los datos');
                console.error('Error en fetchData:', err);
                setAppointments([]);
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
        }

        fetchData();
    }, [fixer_id, date]);






    const isHourBooked = useCallback((day: Date, hour: number): boolean => {
        return appointments.some((apt: Appointment) => {
            const aptDate = new Date(apt.starting_time);
            return (
                aptDate.getFullYear() === day.getFullYear() &&
                aptDate.getMonth() === day.getMonth() &&
                aptDate.getDate() === day.getDate() &&
                aptDate.getUTCHours() === hour
            );
        });
    }, [appointments]);

    /// todosa <= isHourBooked

    const isDisabled = useCallback((day: Date, hour: number): boolean => {
        const dayOfWeek = day.getDay();
        const dayName = DAY_MAP[dayOfWeek];

        if (!appointmentsDis || !appointmentsDis[dayName]) {
            return false;
        }

        return appointmentsDis[dayName].includes(hour);
    }, [appointmentsDis]);




    return {
        isHourBooked,
        isDisabled,
        loading,
        error
    };
}
