// src/hooks/useAppointment.ts
import { useState } from "react";
import { createAppointment } from "../services/appointments.service";
import { AppointmentFormData } from "../schemas/appointments.schema";
import { parseDatetimeForBackend } from "../utils/datetime";

export function useAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateAppointment(fixerId: string, requesterId: string, datetimeISO: string, formData: AppointmentFormData) {
    setLoading(true);
    setError(null);

    try {
      const { selected_date, starting_time, finishing_time } = parseDatetimeForBackend(datetimeISO);

      const payload = {
        id_fixer: fixerId,
        id_requester: requesterId,
        selected_date,
        starting_time,
        finishing_time,
        schedule_state: "booked",
        appointment_type: formData.modality,
        appointment_description: formData.description,
        current_requester_name: formData.client,
        current_requester_phone: formData.contact,
        link_id: formData.modality === "virtual" ? formData.meetingLink : "",
        display_name_location: formData.modality === "presential" ? formData.location?.address : "",
        lat: formData.modality === "presential" ? formData.location?.lat : null,
        lon: formData.modality === "presential" ? formData.location?.lon : null,
      };

      const data = await createAppointment(payload);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || "No se pudo crear la cita");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { handleCreateAppointment, loading, error };
}