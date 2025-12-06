// src/app/redux/services/searchHistoryApi.ts
import { baseApi } from './baseApi';

interface SearchHistoryItem {
  searchTerm: string;
}

interface HistoryResponse {
  success: boolean;
  sessionId?: string;
  searchHistory?: SearchHistoryItem[];
  updatedHistory?: string[];
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

// ===== OBTENER USERID DESDE LOCALSTORAGE =====
function getUserId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const userStr = localStorage.getItem('servineo_user');
    if (!userStr) {
      return null;
    }

    const userData = JSON.parse(userStr);
    const userId = userData._id || userData.id || null;

    if (userId) {
    } else {
      console.warn('⚠️ servineo_user existe pero no tiene _id ni id');
    }

    return userId;
  } catch (error) {
    console.error('❌ Error parsing servineo_user:', error);
    return null;
  }
}

// ===== OBTENER O CREAR SESSIONID (SOLO PARA ANÓNIMOS) =====
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';

  // Si hay userId, NO usar sessionId
  const userId = getUserId();
  if (userId) {
    return '';
  }

  // Solo crear sessionId si es anónimo
  let sid = localStorage.getItem('search_sessionId');
  if (!sid) {
    sid = `anon-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem('search_sessionId', sid);
  }
  return sid;
}

// ===== OBTENER IDENTIFICADOR (USERID O SESSIONID) =====
function getIdentifier(): { userId?: string; sessionId?: string } {
  const userId = getUserId();

  if (userId) {
    return { userId };
  }

  const sessionId = getOrCreateSessionId();
  return { sessionId };
}

// Helper para actualizar sessionId desde backend (solo si viene en respuesta)
function updateSessionIdFromResponse(response: { sessionId?: string }) {
  if (typeof window === 'undefined') return;

  // No actualizar si hay userId
  const userId = getUserId();
  if (userId) return;

  // Si el backend devuelve un sessionId, actualizarlo
  if (response.sessionId) {
    const currentSid = localStorage.getItem('search_sessionId');
    if (currentSid !== response.sessionId) {
      localStorage.setItem('search_sessionId', response.sessionId);
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
        const identifier = getIdentifier();

        if (!identifier.userId && !identifier.sessionId) {
          console.error('❌ No se pudo obtener identificador');
          return { url: '/devmaster/offers', method: 'GET' };
        }

        const params: Record<string, string> = {
          action: 'getHistory',
        };

        // El backend espera 'search' para filtrar, o vacío para todo
        if (searchTerm && searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        if (identifier.userId) {
          params.userId = identifier.userId;
        } else if (identifier.sessionId) {
          params.sessionId = identifier.sessionId;
        }

        const url = buildUrlWithParams('/devmaster/offers', params);
        return { url, method: 'GET' };
      },
      transformResponse: (response: HistoryResponse) => {
        updateSessionIdFromResponse(response);

        if (response.success && response.searchHistory) {
          const history = response.searchHistory.map((item) => item.searchTerm);
          return history;
        }
        return [];
      },
      providesTags: ['SearchHistory'],
    }),

    // ===== ELIMINAR ITEM =====
    deleteSearchHistory: builder.mutation<{ success: boolean; updatedHistory: string[] }, string>({
      query: (searchTerm) => {
        const identifier = getIdentifier();

        if (!identifier.userId && !identifier.sessionId) {
          console.error('❌ No se pudo obtener identificador para delete');
          return { url: '/devmaster/offers', method: 'GET' };
        }

        const params: Record<string, string> = {
          action: 'deleteHistory',
          searchTerm: searchTerm,
        };

        if (identifier.userId) {
          params.userId = identifier.userId;
        } else if (identifier.sessionId) {
          params.sessionId = identifier.sessionId;
        }

        const url = buildUrlWithParams('/devmaster/offers', params);
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
        const identifier = getIdentifier();

        if (!identifier.userId && !identifier.sessionId) {
          console.error('❌ No se pudo obtener identificador para clear');
          return { url: '/devmaster/offers', method: 'GET' };
        }

        const params: Record<string, string> = {
          action: 'clearAllHistory',
        };

        if (identifier.userId) {
          params.userId = identifier.userId;
        } else if (identifier.sessionId) {
          params.sessionId = identifier.sessionId;
        }

        const url = buildUrlWithParams('/devmaster/offers', params);
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
        const identifier = getIdentifier();

        if (!identifier.userId && !identifier.sessionId) {
          console.error('❌ No se pudo obtener identificador para suggestions');
          return { url: '/devmaster/offers', method: 'GET' };
        }

        const params: Record<string, string | number | boolean> = {
          search: query,
          limit: limit,
          record: 'false',
        };

        if (identifier.userId) {
          params.userId = identifier.userId;
        } else if (identifier.sessionId) {
          params.sessionId = identifier.sessionId;
        }

        const url = buildUrlWithParams('/devmaster/offers', params);
        return { url, method: 'GET' };
      },
      transformResponse: (response: SuggestionsResponse) => {
        updateSessionIdFromResponse(response);

        if (response.success && response.suggestions) {
          const suggestions = response.suggestions.map((s) => String(s.term ?? '')).filter(Boolean);
          return suggestions;
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
