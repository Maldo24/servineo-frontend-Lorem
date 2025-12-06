const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Helper: Convierte cualquier tipo de error (unknown) a un string seguro.
 * Esto evita usar 'any' dentro de la clase y maneja casos donde el error no es una instancia de Error.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      // Intentamos parsear la respuesta
      const data = await response.json();

      return {
        success: response.ok,
        data,
        message: data.message,
        // Si la respuesta no es OK, intentamos capturar el mensaje de error del backend
        error: !response.ok ? data.message || 'Error en la petición' : undefined,
      };
    } catch (error) {
      // 1. El 'catch' recibe el error (TS infiere unknown)
      // 2. 'getErrorMessage' lo transforma a string limpio inmediatamente
      return { success: false, error: getErrorMessage(error) };
    } finally {
      clearTimeout(id);
    }
  }

  get<T>(url: string) {
    return this.request<T>(url, { method: 'GET' });
  }

  post<T>(url: string, body: unknown) {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient(BASE_URL);
