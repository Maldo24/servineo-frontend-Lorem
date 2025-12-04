import type { UserLocation, CreateJobRequestPayload, JobRequest } from '../types/job-request';
import { apiUrl } from '@/config/api';

export async function getUserLocation(token: string): Promise<UserLocation> {
  const userId = '68ec99ddf39c7c140f42fcfa';

  const res = await fetch(apiUrl(`api/jobrequests/${userId}/location`), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Error al cargar la ubicación');
  }

  const data = await res.json();

  return data;
}

export async function createJobRequest(
  payload: CreateJobRequestPayload,
  token: string,
): Promise<JobRequest> {
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

  return data as JobRequest;
}
