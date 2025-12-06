// frontend/src/components/ask_for_help/faq.types.ts

export enum FAQCategoria {
  PROBLEMAS = 'problemas',
  SERVICIOS = 'servicios',
  PAGOS = 'pagos',
  GENERAL = 'general'
}

export interface FAQ {
  _id: string;
  pregunta: string;
  respuesta: string;
  categoria: FAQCategoria;
  palabrasClave: string[];
  orden: number;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQResponse {
  success: boolean;
  data?: FAQ[];
  count?: number;
  message?: string;
  error?: string;
}

// ⬇️ ACTUALIZAR ESTA INTERFAZ
export interface UseFAQReturn {
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
  selectedCategory: FAQCategoria | 'all';  // ⬅️ AGREGAR
  searchFAQs: (query: string) => Promise<void>;
  fetchFAQs: () => Promise<void>;
  filterByCategory: (category: FAQCategoria | 'all') => void;  // ⬅️ AGREGAR
}