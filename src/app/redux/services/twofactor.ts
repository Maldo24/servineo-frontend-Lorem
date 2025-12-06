// src/app/redux/services/twofactor.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('servineo_token');
}

type ApiResponse = Record<string, unknown>;

type ApiError = Error & {
  status?: number;
  data?: ApiResponse;
  // campos adicionales que usamos más abajo
  locked?: boolean;
  lockedUntil?: string;
  retryAfterSeconds?: number;
  attemptsLeft?: number;
  attempts?: number;
};

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}/api/editProfile${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: ApiResponse = {};
  try {
    // intentamos parsear JSON; si no hay body válido, dejamos {}
    // (algunos endpoints pueden no devolver JSON)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    data = (await response.json()) as ApiResponse;
  } catch {
    // ignoramos fallo en parseo — mantenemos data = {}
  }

  if (!response.ok) {
    const error = new Error((data?.message as string) || `HTTP ${response.status}`) as ApiError;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// -----------------------------
// GENERAR QR
// -----------------------------
export async function generateQr(): Promise<ApiResponse> {
  return fetchWithAuth('/generate', { method: 'POST' });
}

// -----------------------------
// VERIFICAR TOKEN (AQUÍ ERA EL CAMBIO IMPORTANTE)
// -----------------------------
export async function verifyToken(token: string): Promise<ApiResponse> {
  try {
    return await fetchWithAuth('/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  } catch (err: unknown) {
    const apiErr = err as ApiError;
    const status = apiErr?.status;
    const data = (apiErr?.data as ApiResponse) ?? {};

    // ------------------------------------------------------
    // 💥 SI EL BACKEND INDICA BLOQUEO (423)
    // ------------------------------------------------------
    if (status === 423) {
      const e = new Error((data?.message as string) || 'Cuenta bloqueada temporalmente.') as ApiError;
      e.locked = true;
      e.lockedUntil = (data?.lockedUntil as string) ?? undefined;
      e.retryAfterSeconds = (data?.retryAfterSeconds as number) ?? undefined;
      throw e;
    }

    // ------------------------------------------------------
    // ❌ TOKEN INCORRECTO, PERO NO BLOQUEADO (400)
    // Back devuelve:
    // { message: "Token inválido", attemptsLeft, attempts }
    // ------------------------------------------------------
    if (status === 400) {
      const e = new Error((data?.message as string) || 'Token inválido') as ApiError;
      e.attemptsLeft = (data?.attemptsLeft as number) ?? undefined;
      e.attempts = (data?.attempts as number) ?? undefined;
      throw e;
    }

    // ------------------------------------------------------
    // ⚠️ Otros errores
    // ------------------------------------------------------
    const e = new Error((data?.message as string) || 'Error verificando código') as ApiError;
    throw e;
  }
}

// -----------------------------
// DESHABILITAR 2FA
// -----------------------------
export async function disable2fa(): Promise<ApiResponse> {
  return fetchWithAuth('/disable', { method: 'POST' });
}
