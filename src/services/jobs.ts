import { Job } from '@/types/job';
import { apiUrl } from '@/config/api';

export async function getJobsByFixerId(fixerId: string, init?: RequestInit): Promise<Job[]> {
  if (!fixerId) throw new Error('fixerId is required');
  const url = apiUrl(`api/fixers/${encodeURIComponent(fixerId)}/jobs`);
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[jobs] GET:', url);
  }

  const res = await fetch(url, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch jobs (${res.status}): ${text || res.statusText}`);
  }

  let data: unknown;
  try {
    data = (await res.json()) as unknown;
  } catch {
    const raw = await res.text().catch(() => '');
    throw new Error(`Invalid JSON from jobs endpoint. Body: ${raw?.slice(0, 200)}`);
  }
  const list = extractJobsArray(data);
  if (!Array.isArray(list)) {
    throw new Error('Unexpected response: expected an array of jobs');
  }
  const cleaned = list.filter((j: unknown): j is Job => isJobLike(j));
  return cleaned as Job[];
}

function extractJobsArray(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return null;

  const jobs = getArrayProp(payload, 'jobs');
  if (jobs) return jobs;

  const dataArr = getArrayProp(payload, 'data');
  if (dataArr) return dataArr;

  const dataObj = getObjectProp(payload, 'data');
  if (dataObj) {
    const nestedJobs = getArrayProp(dataObj, 'jobs');
    if (nestedJobs) return nestedJobs;
  }

  const items = getArrayProp(payload, 'items');
  if (items) return items;

  const results = getArrayProp(payload, 'results');
  if (results) return results;

  const anyTopArray = findFirstArray(payload);
  if (anyTopArray) return anyTopArray;

  const nestedObj = findFirstObject(payload);
  if (nestedObj) {
    const nestedArray = findFirstArray(nestedObj);
    if (nestedArray) return nestedArray;
  }

  return null;
}

function getArrayProp(o: unknown, key: string): unknown[] | null {
  if (!o || typeof o !== 'object') return null;
  const val = (o as Record<string, unknown>)[key];
  return Array.isArray(val) ? (val as unknown[]) : null;
}

function getObjectProp(o: unknown, key: string): Record<string, unknown> | null {
  if (!o || typeof o !== 'object') return null;
  const val = (o as Record<string, unknown>)[key];
  return val && typeof val === 'object' ? (val as Record<string, unknown>) : null;
}

function findFirstArray(o: unknown): unknown[] | null {
  if (!o || typeof o !== 'object') return null;
  for (const v of Object.values(o as Record<string, unknown>)) {
    if (Array.isArray(v)) return v as unknown[];
  }
  return null;
}

function findFirstObject(o: unknown): Record<string, unknown> | null {
  if (!o || typeof o !== 'object') return null;
  for (const v of Object.values(o as Record<string, unknown>)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
  }
  return null;
}

function isJobLike(x: unknown): x is Job {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return typeof o._id === 'string' && typeof o.title === 'string';
}
