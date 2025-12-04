// src/app/redux/services/searchHistoryApi.ts
import { baseApi } from './baseApi';

interface SearchHistoryItem {
  searchTerm: string;
}

interface HistoryResponse {
  success: boolean;
  sessionId?: string;
  searchHistory?: SearchHistoryItem[];
  deleted?: boolean;
  cleared?: number;
}

interface SuggestionItem {
  term?: string;
  count?: number;
  score?: number;
  source?: string;
}

interface SuggestionsResponse {
  success: boolean;
  sessionId?: string;
  suggestions?: SuggestionItem[];
}

// Helper seguro que obtiene sessionId solo en cliente
function getClientSessionId(): string {
  if (typeof window === 'undefined') {
    console.warn('⚠️ getClientSessionId llamado en servidor, retornando vacío');
    return '';
  }

  let sid = localStorage.getItem('sessionId');

  if (!sid) {
    sid = crypto.randomUUID?.() || `sid-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem('sessionId', sid);
  }

  return sid;
}

// Helper para actualizar sessionId desde backend
function updateSessionIdFromResponse(response: { sessionId?: string }) {
  if (typeof window === 'undefined') return;

  if (response.sessionId) {
    const currentSid = localStorage.getItem('sessionId');
    if (currentSid !== response.sessionId) {
      localStorage.setItem('sessionId', response.sessionId);
    }
  }
}

// Helper para construir URLs con params
function buildUrlWithParams(
  base: string,
  params: Record<string, string | number | boolean>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${base}?${queryString}` : base;
}

export const searchHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== OBTENER HISTORIAL =====
    getSearchHistory: builder.query<string[], string>({
      query: (searchTerm = '') => {
        const sessionId = getClientSessionId();

        if (!sessionId) {
          console.error('❌ No se pudo obtener sessionId');
          return { url: '/devmaster/offers', method: 'GET' };
        }

        const url = buildUrlWithParams('/devmaster/offers', {
          action: 'getHistory',
          search: searchTerm,
          sessionId: sessionId,
        });

        return { url, method: 'GET' };
      },
      transformResponse: (response: HistoryResponse) => {
        updateSessionIdFromResponse(response);

        if (response.success && response.searchHistory) {
          return response.searchHistory.map((item) => item.searchTerm);
        }

        return [];
      },
      providesTags: ['SearchHistory'],
    }),

    // ===== ELIMINAR ITEM =====
    deleteSearchHistory: builder.mutation<{ success: boolean; updatedHistory: string[] }, string>({
      query: (searchTerm) => {
        const sessionId = getClientSessionId();

        if (!sessionId) {
          console.error('❌ No se pudo obtener sessionId');
          return { url: '/devmaster/offers', method: 'GET' };
        }

        const url = buildUrlWithParams('/devmaster/offers', {
          action: 'deleteHistory',
          searchTerm: searchTerm,
          sessionId: sessionId,
        });

        return { url, method: 'GET' };
      },
      transformResponse: (response: HistoryResponse) => {
        updateSessionIdFromResponse(response);

        const updatedHistory = response.searchHistory?.map((i) => i.searchTerm) || [];
        return { success: response.success, updatedHistory };
      },
      invalidatesTags: ['SearchHistory'],
    }),

    // ===== LIMPIAR TODO =====
    clearSearchHistory: builder.mutation<{ success: boolean; updatedHistory: string[] }, void>({
      query: () => {
        const sessionId = getClientSessionId();

        if (!sessionId) {
          console.error('❌ No se pudo obtener sessionId');
          return { url: '/devmaster/offers', method: 'GET' };
        }

        const url = buildUrlWithParams('/devmaster/offers', {
          action: 'clearAllHistory',
          sessionId: sessionId,
        });

        return { url, method: 'GET' };
      },
      transformResponse: (response: HistoryResponse) => {
        updateSessionIdFromResponse(response);

        const updatedHistory = response.searchHistory?.map((i) => i.searchTerm) || [];
        return { success: response.success, updatedHistory };
      },
      invalidatesTags: ['SearchHistory'],
    }),

    // ===== OBTENER SUGERENCIAS =====
    getSearchSuggestions: builder.query<string[], { query: string; limit?: number }>({
      query: ({ query, limit = 6 }) => {
        const sessionId = getClientSessionId();

        if (!sessionId) {
          console.error('❌ No se pudo obtener sessionId');
          return { url: '/devmaster/offers', method: 'GET' };
        }

        const url = buildUrlWithParams('/devmaster/offers', {
          search: query,
          limit: limit,
          record: false,
          sessionId: sessionId,
        });

        return { url, method: 'GET' };
      },
      transformResponse: (response: SuggestionsResponse) => {
        updateSessionIdFromResponse(response);

        if (response.success && response.suggestions) {
          return response.suggestions.map((s) => String(s.term ?? '')).filter(Boolean);
        }

        return [];
      },
    }),
  }),
  overrideExisting: false,
});

// EXPORT HOOKS
export const {
  useGetSearchHistoryQuery,
  useDeleteSearchHistoryMutation,
  useClearSearchHistoryMutation,
  useGetSearchSuggestionsQuery,
  useLazyGetSearchSuggestionsQuery,
} = searchHistoryApi;
