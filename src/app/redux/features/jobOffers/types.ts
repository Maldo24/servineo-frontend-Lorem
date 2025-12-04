export interface OfferData {
  _id: string;
  fixerId: string;
  fixerName: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  city: string;
  contactPhone: string;
  createdAt: string;
  rating?: number;
  photos?: string[];
  imagenUrl?: string;
  allImages?: string[];
  status?: boolean;
}

export interface FilterState {
  range: string[];
  city: string[];
  category: string[];
  tags?: string[];
  minPrice?: number | null;
  maxPrice?: number | null;
  isAutoSelectedCategory?: boolean;
  isAutoSelectedCity?: boolean;
}

export interface PaginationState {
  paginaActual: number;
  registrosPorPagina: number;
  totalRegistros: number;
  totalPages: number;
}

export interface JobOffersState {
  loading: boolean;
  error: string | null;
  filters: FilterState;
  sortBy: string;
  search: string;
  date?: string | null;
  rating?: number | null;
  titleOnly?: boolean;
  exact?: boolean;
  paginaActual: number;
  registrosPorPagina: number;
  totalRegistros: number;
  preservedTotalRegistros: number;
  totalPages: number;
  paginaciones: Record<string, PaginationState>;
  shouldPersist: boolean;
}

export interface OfferResponse {
  total: number;
  count: number;
  data: OfferData[];
  currentPage?: number;
}

export interface OfferFilters {
  range?: string[];
  city?: string[];
  category?: string[];
  tags?: string[];
  minPrice?: number | null;
  maxPrice?: number | null;
}

export interface OfferParams {
  search?: string;
  filters?: OfferFilters;
  sortBy?: string;
  date?: string;
  rating?: number;
  page?: number;
  limit?: number;
  titleOnly?: boolean;
  exact?: boolean;
  isInitialSearch?: boolean;
}

export type FilterParamValue = string | string[] | number | boolean | null;
export type ParamsMap = Record<string, FilterParamValue>;
