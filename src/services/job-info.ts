import { API_BASE_URL } from '@/config/api';
import { JobDetails } from '@/types/job';

export type JobSummary = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  Ubicacion: string;
  UbicacionOriginal?: string;
  status: string;
};

export async function getJobInfo(jobId: string): Promise<JobSummary> {
  const res = await fetch(`${API_BASE_URL}/api/job-info/${encodeURIComponent(jobId)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`getJobInfo failed: ${res.status}`);
  }

  return res.json();
}

export const getJobForFixerInfo = async (jobId: string, fixerId: string): Promise<JobDetails> => {
  const res = await fetch(
    `${API_BASE_URL}/api/job-rating-details/${encodeURIComponent(fixerId)}/${encodeURIComponent(jobId)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!res.ok) {
    throw new Error(`getJobForFixerInfo failed: ${res.status}`);
  }

  return res.json();
};
