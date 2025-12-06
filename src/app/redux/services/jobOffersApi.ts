// src/app/redux/services/jobOffersApi.ts
import { baseApi } from './baseApi';
import { OfferParams, OfferResponse } from '@/app/redux/features/jobOffers/types';

// ===== TIPOS PARA PRICE RANGES =====
interface PriceRangeItem {
  label: string;
  min?: number | null;
  max?: number | null;
}

interface PriceRangesResponse {
  min: number | null;
  max: number | null;
  ranges: PriceRangeItem[];
}

// ===== TIPOS PARA RESPUESTAS DE LA API =====
interface TagsApiResponse {
  tags?: string[];
  data?: {
    tags?: string[];
  };
}

interface PriceRangesApiResponse {
  min?: number | null;
  max?: number | null;
  ranges?: PriceRangeItem[];
  data?: {
    min?: number | null;
    max?: number | null;
    ranges?: PriceRangeItem[];
  };
}

// ===== TIPOS PARA FILTER COUNTS =====
interface FilterCountsResponse {
  ranges: Record<string, number>;
  cities: Record<string, number>;
  categories: Record<string, number>;
  ratings: Record<string, number>;
  total: number;
}

interface FilterCountsParams {
  range?: string[];
  city?: string;
  category?: string[];
  search?: string;
  minRating?: number;
  maxRating?: number;
}

// ===== HELPER: OBTENER USERID =====
function getUserId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const userStr = localStorage.getItem('servineo_user');
    if (!userStr) return null;

    const userData = JSON.parse(userStr);
    return userData._id || userData.id || null;
  } catch (error) {
    console.warn('Error parsing servineo_user:', error);
    return null;
  }
}

// ===== HELPER: OBTENER O CREAR SESSIONID =====
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';

  const userId = getUserId();
  if (userId) return ''; // No necesitamos sessionId si hay userId

  let sid = localStorage.getItem('search_sessionId');
  if (!sid) {
    sid = `anon-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem('search_sessionId', sid);
  }
  return sid;
}

// ===== HELPER: OBTENER IDENTIFICADOR =====
function getIdentifier(): { userId?: string; sessionId?: string } {
  const userId = getUserId();

  if (userId) {
    return { userId };
  }

  const sessionId = getOrCreateSessionId();
  return { sessionId };
}

// Extender el baseApi con endpoints específicos de ofertas
export const jobOffersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Query principal
    getOffers: builder.query<OfferResponse, OfferParams>({
      query: (params) => {
        const urlParams = new URLSearchParams();

        // ===== AGREGAR IDENTIFICADOR =====
        const identifier = getIdentifier();
        if (identifier.userId) {
          urlParams.append('userId', identifier.userId);
        } else if (identifier.sessionId) {
          urlParams.append('sessionId', identifier.sessionId);
        }

        if (params.search?.trim()) urlParams.append('search', params.search);
        if (params.filters?.range?.length)
          params.filters.range.forEach((r) => urlParams.append('range', r));
        if (params.filters?.city?.length) urlParams.append('city', params.filters.city.join(','));
        if (params.filters?.category?.length)
          params.filters.category.forEach((c) => urlParams.append('category', c));
        if (params.filters?.tags?.length) urlParams.append('tags', params.filters.tags.join(','));
        if (params.filters?.minPrice != null)
          urlParams.append('minPrice', String(params.filters.minPrice));
        if (params.filters?.maxPrice != null)
          urlParams.append('maxPrice', String(params.filters.maxPrice));
        if (params.sortBy) urlParams.append('sortBy', params.sortBy);
        if (params.date) urlParams.append('date', params.date);
        if (params.rating != null) urlParams.append('rating', String(params.rating));
        if (params.titleOnly) urlParams.append('titleOnly', 'true');
        if (params.exact) urlParams.append('exact', 'true');

        // Filtrar solo ofertas activas
        urlParams.append('status', 'true');

        urlParams.append('page', String(params.page || 1));
        urlParams.append('limit', String(params.limit || 10));

        const url = `/devmaster/offers?${urlParams.toString()}`;
        return url;
      },
      providesTags: ['JobOffer'],
    }),

    // 2. Ofertas recientes (Home)
    getRecentOffers: builder.query<OfferResponse, { category?: string; limit?: number }>({
      query: ({ category, limit = 8 }) => {
        const params = new URLSearchParams({
          sortBy: 'recent',
          page: '1',
          limit: String(limit),
          status: 'true',
          record: 'false', // No guardar estas búsquedas en historial
        });
        if (category && category !== 'Todos') params.append('category', category);
        return `/devmaster/offers?${params.toString()}`;
      },
      providesTags: ['JobOffer'],
    }),

    // 3. Tags dinámicos
    getTags: builder.query<string[], { search?: string; category?: string[] }>({
      query: ({ search, category }) => {
        const params = new URLSearchParams({ limit: '20' });
        if (search?.trim()) params.append('search', search);
        if (category?.length) params.append('category', category.join(','));
        if (!search && !category?.length) params.append('recent', 'true');
        return `/devmaster/tags?${params.toString()}`;
      },
      transformResponse: (response: TagsApiResponse | string[]) => {
        if (Array.isArray(response)) return response;
        if (response.tags) return response.tags;
        if (response.data?.tags) return response.data.tags;
        return [];
      },
    }),

    // 4. Rangos de precios
    getPriceRanges: builder.query<PriceRangesResponse, void>({
      query: () => {
        return '/devmaster/offers?action=getPriceRanges';
      },
      transformResponse: (response: PriceRangesApiResponse) => {
        // Si la respuesta ya tiene el formato correcto
        if (response.ranges) {
          return {
            min: response.min ?? null,
            max: response.max ?? null,
            ranges: response.ranges,
          };
        }

        // Si viene envuelto en data
        if (response.data?.ranges) {
          return {
            min: response.data.min ?? null,
            max: response.data.max ?? null,
            ranges: response.data.ranges,
          };
        }

        // Fallback: estructura vacía
        return {
          min: null,
          max: null,
          ranges: [],
        };
      },
    }),

    // 5. Filter Counts
    getFilterCounts: builder.query<FilterCountsResponse, FilterCountsParams>({
      query: (params) => {
        const urlParams = new URLSearchParams();

        if (params.range?.length) params.range.forEach((r) => urlParams.append('range', r));
        if (params.city) urlParams.set('city', params.city);
        if (params.category?.length)
          params.category.forEach((c) => urlParams.append('category', c));
        if (params.search) urlParams.set('search', params.search);
        if (params.minRating != null) urlParams.set('minRating', String(params.minRating));
        if (params.maxRating != null) urlParams.set('maxRating', String(params.maxRating));

        return `/devmaster/filter-counts?${urlParams.toString()}`;
      },
      transformResponse: (response: { success: boolean; data: FilterCountsResponse }) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useGetOffersQuery,
  useLazyGetOffersQuery,
  useGetRecentOffersQuery,
  useGetTagsQuery,
  useGetPriceRangesQuery,
  useGetFilterCountsQuery,
  useLazyGetFilterCountsQuery,
} = jobOffersApi;
