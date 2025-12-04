const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('servineo_token');
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}/api/controlC/2fa${endpoint}`;
  console.log('🔍 Fetch URL:', url);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Error ${response.status}`;
    console.error('❌ Error response:', errorData);
    throw new Error(message);
  }

  return response.json();
}

export async function generateQr() {
  try {
    console.log('🔍 Generando QR...');
    const data = await fetchWithAuth('/generate', {
      method: 'POST',
    });
    console.log('✅ QR generado:', data);
    return data; // { qrDataUrl, issuer }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al generar código QR';
    console.error('❌ Error al generar QR:', errorMessage);
    throw new Error(errorMessage);
  }
}

export async function verifyToken(token: string) {
  try {
    console.log('🔍 Verificando token...');
    const data = await fetchWithAuth('/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    console.log('✅ Token verificado:', data);
    return data; // { recoveryCodes: [...] }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Código incorrecto o expirado';
    console.error('❌ Error al verificar token:', errorMessage);
    throw new Error(errorMessage);
  }
}

export async function disable2fa() {
  try {
    console.log('🔍 Deshabilitando 2FA...');
    const data = await fetchWithAuth('/disable', {
      method: 'POST',
    });
    console.log('✅ 2FA deshabilitado:', data);
    return data;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al deshabilitar 2FA';
    console.error('❌ Error al deshabilitar 2FA:', errorMessage);
    throw new Error(errorMessage);
  }
}
