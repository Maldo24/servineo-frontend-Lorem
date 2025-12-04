import { UserLocation, CreateJobRequestPayload } from '../types/job-request';
import { apiUrl } from '@/config/api';

export async function getUserLocation(token: string): Promise<UserLocation> {
  const res = await fetch(apiUrl('api/profile/location'), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Error al cargar la ubicación.');

  return {
    lat: data.coordinates[1],
    lng: data.coordinates[0],
  };
}

export async function createJobRequest(
  payload: CreateJobRequestPayload,
  token: string,
): Promise<unknown> {
  const res = await fetch(apiUrl('api/jobrequests'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Error al guardar la solicitud.');

  return data;
}
