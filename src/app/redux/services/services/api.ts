const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_BASE = '/api/controlC/cliente';

export interface AuthProvider {
  provider: 'email' | 'google' | 'discord' | 'github';
  providerId?: string;
  email?: string;
  token?: string;
}

interface APIResponse {
  success?: boolean;
  message?: string;
  client?: {
    authProviders: AuthProvider[];
  };
}

export interface Client {
  id: string;
  email: string;
  name?: string;
  authProviders: AuthProvider[];
}

export async function obtenerMetodosCliente(): Promise<AuthProvider[]> {
  const token = localStorage.getItem('servineo_token');
  if (!token) throw new Error('No se encontró token de autenticación.');

  try {
    const res = await fetch(`${BASE_URL}${CLIENT_BASE}/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data: APIResponse = await res.json().catch(() => ({ client: { authProviders: [] } }));

    if (!res.ok) throw new Error(data.message || 'Error al cargar métodos de login.');

    return data.client?.authProviders || [];
  } catch (error) {
    console.error('Error obtenerMetodosCliente:', error);
    throw error;
  }
}

export async function desvincularMetodo(provider: string): Promise<AuthProvider[]> {
  const token = localStorage.getItem('servineo_token');
  if (!token) throw new Error('No se encontró token de autenticación.');

  try {
    const res = await fetch(`${BASE_URL}${CLIENT_BASE}/unlink`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ provider }),
    });

    const data: APIResponse = await res.json().catch(() => ({ client: { authProviders: [] } }));

    if (!res.ok) throw new Error(data.message || 'Error al desvincular método.');

    return data.client?.authProviders || [];
  } catch (error) {
    console.error('Error desvincularMetodo:', error);
    throw error;
  }
}

export interface VincularResultado {
  success: boolean;
  message: string;
  client?: Client;
}

export async function vincularCorreoContrasena(
  token: string,
  email: string,
  password: string,
): Promise<VincularResultado> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/controlC/cliente/link-email-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al vincular método');

    return { success: true, message: 'Método vinculado correctamente', client: data.client };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, message };
  }
}

export interface GitHubLinkResult {
  success: boolean;
  client?: Client;
  message?: string;
}

export function vincularGitHub(
  token: string,
  onSuccess?: (client: Client) => void,
  onError?: (msg: string) => void,
) {
  const state = encodeURIComponent(JSON.stringify({ mode: 'link', token }));

  const popup = window.open(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/github?state=${state}`,
    'GitHubLink',
    'width=600,height=700',
  );

  if (!popup) {
    onError?.('No se pudo abrir la ventana de GitHub');
    return;
  }

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== process.env.NEXT_PUBLIC_API_URL) return;

    const data = event.data;

    if (data.type === 'GITHUB_LINK_SUCCESS') {
      onSuccess?.(data.client);
      popup.close();
      window.removeEventListener('message', handleMessage);
    } else if (data.type === 'GITHUB_LINK_ERROR') {
      onError?.(data.message || 'Error al vincular cuenta GitHub');
      popup.close();
      window.removeEventListener('message', handleMessage);
    }
  };

  window.addEventListener('message', handleMessage);
}

export interface GoogleLinkResult {
  success: boolean;
  client?: Client;
  message?: string;
}

export async function vincularGoogle(
  tokenUsuario: string,
  tokenGoogle: string,
): Promise<GoogleLinkResult> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/controlC/cliente/link-google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenUsuario}`,
      },
      body: JSON.stringify({ tokenGoogle }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || 'Error al vincular Google' };
    }

    return {
      success: true,
      message: 'Cuenta de Google vinculada correctamente',
      client: data.client,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al vincular Google';
    return { success: false, message };
  }
}

export interface DiscordLinkResult {
  success: boolean;
  client?: Client;
  message?: string;
}

export function vincularDiscord(
  token: string,
  onSuccess?: (client: Client) => void,
  onError?: (msg: string) => void,
) {
  const rawState = JSON.stringify({ mode: 'link', token });
  const state = btoa(rawState);

  const baseUrl = BASE_URL;

  const finalUrl = `${baseUrl}/auth/discord?state=${state}`;

  const popup = window.open(finalUrl, 'DiscordLink', 'width=600,height=700');

  const allowedOrigin = BASE_URL;

  console.log('allowedOrigin:', allowedOrigin);

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== allowedOrigin) {
      console.warn('Mensaje rechazado por ORIGIN:', event.origin);
      return;
    }

    if (event.data.type === 'DISCORD_LINK_SUCCESS') {
      onSuccess?.(event.data.client);
      popup?.close();
      window.removeEventListener('message', handleMessage);
    } else if (event.data.type === 'DISCORD_LINK_ERROR') {
      onError?.(event.data.message);
      popup?.close();
      window.removeEventListener('message', handleMessage);
    }
  };

  window.addEventListener('message', handleMessage);
}
