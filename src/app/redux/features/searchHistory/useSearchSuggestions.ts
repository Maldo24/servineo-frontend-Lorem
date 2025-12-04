// src/app/redux/features/searchHistory/useSearchSuggestions.ts
import { useState, useEffect, useRef } from 'react';
import { useLazyGetSearchSuggestionsQuery } from '@/app/redux/services/searchHistoryApi';
import {
  translateSuggestions,
  translateWithDictionary,
} from '@/app/lib/utils/translate/dictionary';

interface UseSearchSuggestionsOptions {
  enabled?: boolean;
  minLength?: number;
  debounceMs?: number;
  maxResults?: number;
  language?: string;
}

interface UseSearchSuggestionsReturn {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
}

export function useSearchSuggestions(
  query: string,
  options: UseSearchSuggestionsOptions = {},
): UseSearchSuggestionsReturn {
  const {
    enabled = true,
    minLength = 1,
    debounceMs = 300,
    maxResults = 6,
    language = 'es',
  } = options;

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  // RTK Query lazy query
  const [trigger, { data, isLoading, error }] = useLazyGetSearchSuggestionsQuery();

  // Timer para debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ===== EFFECT CON DEBOUNCE =====
  useEffect(() => {
    // Limpiar timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Resetear si no está habilitado
    if (!enabled) {
      setSuggestions([]);
      setLocalError(null);
      return;
    }

    const trimmed = query.trim();

    // No buscar si no cumple longitud mínima
    if (trimmed.length < minLength) {
      setSuggestions([]);
      setLocalError(null);
      return;
    }

    // Configurar nuevo timer con debounce
    debounceTimerRef.current = setTimeout(() => {
      let queryToSearch = trimmed;
      if (language === 'en') {
        queryToSearch = translateWithDictionary(trimmed, 'es');
      }
      trigger({ query: queryToSearch, limit: maxResults })
        .unwrap()
        .then((results) => {
          let processedResults = results;
          if (language === 'en' && results.length > 0) {
            console.log('✅ Translating suggestions to English');
            processedResults = translateSuggestions(results, 'en');
          }
          setSuggestions(processedResults.slice(0, maxResults));
          setLocalError(null);
        })
        .catch((err) => {
          console.error('Error fetching suggestions:', err);
          setLocalError('Error al cargar sugerencias');
          setSuggestions([]);
        });
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, enabled, minLength, debounceMs, maxResults, trigger, language]);

  // Actualizar sugerencias cuando cambian los datos
  useEffect(() => {
    if (data) {
      let processedData = data;
      if (language === 'en' && data.length > 0) {
        processedData = translateSuggestions(data, 'en');
      }
      setSuggestions(processedData.slice(0, maxResults));
    }
  }, [data, maxResults, language]);

  return {
    suggestions,
    isLoading,
    error: localError || (error ? 'Error al cargar sugerencias' : null),
  };
}
