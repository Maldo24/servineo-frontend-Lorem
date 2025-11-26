import { useState, useCallback } from 'react';
import { getAppointmentsByHour, Appointment } from '../../utils/Appointments/getAppointmentsByHour';

interface UseHourRefetchProps {
    fixer_id: string;
}

export default function useHourAppointment({ fixer_id }: UseHourRefetchProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetchHour = useCallback(async (date: Date, hour: number): Promise<Appointment[]> => {
        if (!fixer_id || fixer_id === '' || fixer_id === 'undefined') {
            console.warn('fixer_id no válido:', fixer_id);
            return [];
        }

        setLoading(true);
        setError(null);

        try {
            const dateString = date.toISOString().split('T')[0];
            const hourAppointments = await getAppointmentsByHour(fixer_id, dateString, hour);

            setLoading(false);
            return hourAppointments;
        } catch (err) {
            console.error('Error en refetchHour:', err);
            setError('Error al cargar la hora');
            setLoading(false);
            return [];
        }
    }, [fixer_id]);

    return {
        refetchHour,
        loading,
        error
    };
}
