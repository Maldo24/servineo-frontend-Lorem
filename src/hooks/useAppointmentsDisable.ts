import { useEffect, useState, useCallback } from 'react';
import { getAppointmentsDisable, Days } from '@/app/lib/utils/getAppointmentsDisable';

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

export default function useAppointmentsDisable(fixer_id: string, date: Date) {
  const [appointmentsDis, setAppointmentsDis] = useState<Days>({
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: [],
    domingo: [],
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
        const [availabilityData] = await Promise.all([getAppointmentsDisable(fixer_id)]);

        setAppointmentsDis(availabilityData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error en fetchData:', err);
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
  }, [fixer_id, date]);

  const isDisabledDay = useCallback(
    (day: Date): boolean => {
      const dayOfWeek = day.getDay();
      const dayName = DAY_MAP[dayOfWeek];

      return appointmentsDis[dayName].length === 24;
    },
    [appointmentsDis],
  );

  const isDisabled = useCallback(
    (day: Date, hour: number): boolean => {
      const dayOfWeek = day.getDay();
      const dayName = DAY_MAP[dayOfWeek];

      if (!appointmentsDis || !appointmentsDis[dayName]) {
        return false;
      }

      return appointmentsDis[dayName].includes(hour);
    },
    [appointmentsDis],
  );

  return {
    isDisabledDay,
    isDisabled,
    loading,
    error,
  };
}
