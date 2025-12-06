// frontend/src/components/ask_for_help/faq.service.ts
import { FAQ, FAQResponse } from './faq.types';

// Leemos SOLO lo que ya existe en el .env
const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Normalizamos:
// - Si es "http://localhost:8000"      → "http://localhost:8000/api"
// - Si algún día fuera "http://localhost:8000/api" → se queda igual
const API_BASE_URL = (() => {
  const trimmed = RAW_API_URL.replace(/\/+$/, '');

  if (trimmed.endsWith('/api/devon')) {
    return `${trimmed}/devon`;
  }
  return `${trimmed}/api/devon`;
})();

export class FAQService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAllFAQs(): Promise<FAQ[]> {
    const response = await fetch(`${this.baseURL}/faqs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: FAQResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Error al obtener FAQs');
    }

    return data.data;
  }

  // Ejemplo de otros métodos, adapta a lo que ya tenías:
  async getFAQById(id: string): Promise<FAQ> {
    const response = await fetch(`${this.baseURL}/faqs/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: FAQResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Error al obtener la FAQ');
    }

    // asumiendo que data.data es un FAQ cuando es por ID
    return data.data as unknown as FAQ;
  }

  async searchFAQs(query: string): Promise<FAQ[]> {
    const response = await fetch(
      `${this.baseURL}/faqs/search?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data: FAQResponse = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Error al buscar FAQs');
    }

    return data.data;
  }
}

// si ya usabas una instancia:
export const faqService = new FAQService();