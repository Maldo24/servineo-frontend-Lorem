import { API_BASE_URL } from '@/config/api';
import type { Job } from '@/types/jobs';
import { getJobInfo } from './job-info';

const urlsForFixer = (fixerId: string) => [
  `${API_BASE_URL}/api/jobs/fixer/${encodeURIComponent(fixerId)}`, // si tienes esta ruta
  `${API_BASE_URL}/api/jobs?fixerId=${encodeURIComponent(fixerId)}`, // fallback
];

export async function getJobsByFixerId(fixerId: string): Promise<Job[]> {
  let jobs: Job[] = [];
  let fetched = false;

  for (const url of urlsForFixer(fixerId)) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        continue;
      }
      const data = await res.json();
      if (Array.isArray(data)) jobs = data;
      else if (data && Array.isArray(data.jobs)) jobs = data.jobs;
      else if (data && Array.isArray(data.data)) jobs = data.data;
      else jobs = [];
      fetched = true;
      break;
    } catch (err) {
      console.error('Error fetching jobs for fixer:', err);
    }
  }

  if (!fetched) return [];

  const enriched = await Promise.allSettled(
    jobs.map(async (job) => {
      try {
        const info = await getJobInfo(job._id);
        return {
          ...job,
          Ubicacion: job.Ubicacion ?? info.Ubicacion ?? 'Desconocida',
          UbicacionOriginal: info.UbicacionOriginal ?? 'Desconocida',
        } as Job;
      } catch {
        return {
          ...job,
          Ubicacion: job.Ubicacion ?? 'Desconocida',
        } as Job;
      }
    }),
  );

  return enriched
    .map((r) => (r.status === 'fulfilled' ? r.value : (r.reason ?? null)))
    .filter(Boolean) as Job[];
}
