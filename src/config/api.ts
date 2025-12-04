const raw = process.env.NEXT_PUBLIC_API_URL;

if (!raw) {
  throw new Error('NEXT_PUBLIC_API_URL no definida');
}

export const API_BASE_URL = raw.replace(/\/+$/, '');

export function apiUrl(path: string): string {
  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
}

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const url = apiUrl(path);
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[apiFetch]', init.method || 'GET', url);
  }
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  let body: unknown = null;
  const text = await res.text();
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    let msg: string | undefined;
    if (body && typeof body === 'object') {
      const b = body as Record<string, unknown>;
      const cand = b.msg || b.error;
      if (typeof cand === 'string') msg = cand;
    }
    msg = msg || res.statusText || 'Error de API';
    throw new Error(`${msg} (${res.status})`);
  }
  return body as T;
}

export function withQuery(path: string, params: Record<string, unknown>): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    usp.append(k, String(v));
  });
  const q = usp.toString();
  return q ? `${path}?${q}` : path;
}
