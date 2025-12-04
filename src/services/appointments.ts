import { apiUrl } from '@/config/api';

export interface Appointment {
  _id: string;
  id_fixer: string;
  id_requester: string;
  selected_date: { $date: string };
  current_requester_name: string;
  appointment_type: string;
  appointment_description: string;
  link_id: string;
  current_requester_phone: string;
  starting_time: { $date: string };
  finishing_time: { $date: string };
  schedule_state: string;
  display_name_location: string;
  lat: string | null;
  lon: string | null;
  cancelled_fixer: boolean;
  reprogram_reason: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  __v: number;
}

export async function getAppointmentsByFixerId(fixerId: string): Promise<Appointment[]> {
  try {
    const res = await fetch(apiUrl(`api/appointments/fixer/${fixerId}`), {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch appointments');
    }

    const appointments = await res.json();

    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        `[appointments] Found ${appointments.length} appointments for fixer ${fixerId}`,
      );
    }

    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}
