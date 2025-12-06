import { useEffect, useState, useRef, useCallback } from 'react';
import { Appointment } from '@/app/lib/utils/getAppointmentsByHour';
import { getSixMonthAppointments } from '@/app/lib/utils/getSixMonthAppointments';
import { getAppointmentsByHour } from '@/app/lib/utils/getAppointmentsByHour';
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

export default function useSixMonthsAppointments(fixer_id: string, date: Date) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

  const hasFetched = useRef(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (hasFetched.current && refreshTrigger === 0) {
      return;
    }

    async function fetchData() {
      // ✅ VALIDACIÓN MEJORADA: evitar llamadas con IDs inválidos
      if (!fixer_id || fixer_id === '' || fixer_id === 'undefined' || fixer_id === 'placeholder') {
        console.warn('[useSixMonthsAppointments] fixer_id no válido, saltando fetch:', fixer_id);
        setLoading(false);
        return;
      }

      console.log('[useSixMonthsAppointments] Iniciando fetch con fixer_id:', fixer_id);
      setLoading(true);
      try {
        const [appointmentsData, availabilityData] = await Promise.all([
          getSixMonthAppointments(fixer_id, date.toISOString().split('T')[0]),
          getAppointmentsDisable(fixer_id),
        ]);

        setAppointments(appointmentsData);
        setAppointmentsDis(availabilityData);
        setError(null);
        hasFetched.current = true;
        console.log('[useSixMonthsAppointments] ✅ Datos cargados exitosamente');
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('[useSixMonthsAppointments] ❌ Error en fetchData:', err);
        setAppointments([]);
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
  }, [fixer_id, date, refreshTrigger]);

  const refetch = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const refetchHour = useCallback(
    async (date: Date, hour: number) => {
      try {
        const dateString = date.toISOString().split('T')[0];
        const hourAppointments = await getAppointmentsByHour(fixer_id, dateString, hour);

        setAppointments((prevAppointments) => {
          const otherAppointments = prevAppointments.filter((apt) => {
            const aptDate = new Date(apt.starting_time);
            return !(
              aptDate.getUTCFullYear() === date.getFullYear() &&
              aptDate.getUTCMonth() === date.getMonth() &&
              aptDate.getUTCDate() === date.getDate() &&
              aptDate.getUTCHours() === hour
            );
          });

          return [...otherAppointments, ...hourAppointments];
        });

        return hourAppointments;
      } catch (err) {
        console.error('Error en refetchHour:', err);
        return [];
      }
    },
    [fixer_id],
  );

  const isHourBookedFixer = useCallback(
    (day: Date, hour: number): boolean => {
      return appointments.some((apt: Appointment) => {
        const aptDate = new Date(apt.starting_time);
        const aptState = apt.schedule_state;
        const aptCanceledFixer = apt.cancelled_fixer;
        return (
          aptDate.getUTCFullYear() === day.getFullYear() &&
          aptDate.getUTCMonth() === day.getMonth() &&
          aptDate.getUTCDate() === day.getDate() &&
          aptDate.getUTCHours() === hour &&
          aptState === 'booked' &&
          aptCanceledFixer === false
        );
      });
    },
    [appointments],
  );

  const isHourBooked = useCallback(
    (day: Date, hour: number, requester_id: string): 'self' | 'other' | 'notBooked' => {
      const appointment = appointments.find((apt: Appointment) => {
        const aptDate = new Date(apt.starting_time);
        const aptCanceledFixer = apt.cancelled_fixer;
        const aptState = apt.schedule_state;
        return (
          aptDate.getUTCFullYear() === day.getFullYear() &&
          aptDate.getUTCMonth() === day.getMonth() &&
          aptDate.getUTCDate() === day.getDate() &&
          aptDate.getUTCHours() === hour &&
          aptState === 'booked' &&
          aptCanceledFixer === false
        );
      });

      if (!appointment) return 'notBooked';
      if (appointment.id_requester === requester_id) return 'self';
      return 'other';
    },
    [appointments],
  );

  const isEnabled = useCallback(
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

  const isCanceled = useCallback(
    (
      day: Date,
      hour: number,
      requester_id: string,
    ): 'fixer' | 'requester' | 'otherFixer' | 'otherRequester' | 'notCancel' => {
      const appointment = appointments.find((apt: Appointment) => {
        const aptDate = new Date(apt.starting_time);
        return (
          aptDate.getUTCFullYear() === day.getFullYear() &&
          aptDate.getUTCMonth() === day.getMonth() &&
          aptDate.getUTCDate() === day.getDate() &&
          aptDate.getUTCHours() === hour
        );
      });
      if (!appointment) return 'notCancel';

      if (appointment.id_requester === requester_id) {
        if (appointment.cancelled_fixer) {
          return 'fixer';
        } else {
          if (appointment.schedule_state === 'cancelled') {
            return 'requester';
          } else {
            return 'notCancel';
          }
        }
      } else {
        if (appointment.cancelled_fixer) {
          return 'otherFixer';
        } else {
          if (appointment.schedule_state === 'cancelled') {
            return 'otherRequester';
          } else {
            return 'notCancel';
          }
        }
      }
    },
    [appointments],
  );

  return {
    isHourBookedFixer,
    isHourBooked,
    isEnabled,
    loading,
    isCanceled,
    error,
    refetch,
    refetchHour,
  };
}
