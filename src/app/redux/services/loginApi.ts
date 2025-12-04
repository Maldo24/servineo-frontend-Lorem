const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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

      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Error desconocido' };
    } finally {
      clearTimeout(id);
    }
  }

  get<T>(url: string) {
    return this.request<T>(url, { method: 'GET' });
  }
  post<T, B = unknown>(url: string, body: B) {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient(BASE_URL);
