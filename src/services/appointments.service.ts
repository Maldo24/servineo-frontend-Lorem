// src/services/appointments.service.ts
import axios from "axios";

const BASE_URL = "https://servineo-backend-lorem.onrender.com/api/crud_create/appointments";

export async function createAppointment(payload: any) {
  const res = await axios.post(`${BASE_URL}/create`, payload);
  return res.data;
}