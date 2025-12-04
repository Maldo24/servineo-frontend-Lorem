import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { useGetOffersQuery } from '@/app/redux/services/jobOffersApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  setSearch,
  setFilters,
  setSortBy,
  setDate,
  setRating,
  setPaginaActual,
  setRegistrosPorPagina,
  setTitleOnly,
  setExact,
  updatePagination,
  //restoreSavedState,
  resetFilters,
  enablePersistence,
  setError,
} from '@/app/redux/slice/jobOfert';
import { selectSearchParams, selectJobOffersState } from './selectors';
import { parseUrlToFilters, filtersToUrlParams, parseAppliedParams } from './parsers';
// import { restoreFromStorage } from './storage';
import {
  isFromAdvSearch,
  clearAdvSearchMark,
  saveAppliedFilters,
  getAppliedFilters,
  clearAppliedFilters,
} from './session';
import { ParamsMap } from './types';
import { JOBOFERT_ALLOWED_LIMITS } from '@/app/lib/validations/pagination.validator';
import { sanitizePage } from '@/app/lib/validations/pagination.validator'; //

/**
 * Hook principal que combina RTK Query con el slice de Redux
 */

export function useJobOffers() {
  const dispatch = useAppDispatch();
  const params = useAppSelector(selectSearchParams);
  const [skipQuery, setSkipQuery] = useState(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldClearErrorRef = useRef(true);

  // ✅ Validar límite inválido (ANTES de la query)
  useEffect(() => {
    if (!JOBOFERT_ALLOWED_LIMITS.includes(params.limit)) {
      dispatch(
        setError(`Límite no permitido. Valores permitidos: ${JOBOFERT_ALLOWED_LIMITS.join(', ')}`),
      );
      setSkipQuery(true);
      shouldClearErrorRef.current = false;

      errorTimeoutRef.current = setTimeout(() => {
        dispatch(setRegistrosPorPagina(10));
        setSkipQuery(false);
        shouldClearErrorRef.current = true;
      }, 2500);

      return () => {
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      };
    }
  }, [params.limit, dispatch]);

  const { data, error, isLoading, isFetching } = useGetOffersQuery(
    {
      search: params.search,
      filters: params.filters,
      sortBy: params.sortBy,
      date: params.date || undefined,
      rating: params.rating || undefined,
      page: params.page,
      limit: params.limit,
      titleOnly: params.titleOnly,
      exact: params.exact,
    },
    {
      skip: skipQuery,
    },
  );

  // Validar página < 1 (DESPUÉS de declarar data)
  useEffect(() => {
    if (!data) return;

    const totalPages = Math.ceil(data.total / params.limit) || 1;
    const correctedPage = sanitizePage(params.page, totalPages);

    if (correctedPage !== params.page) {
      dispatch(setPaginaActual(correctedPage));
    }
  }, [params.page, params.limit, data, dispatch]);

  // Capturar error 400 del backend
  useEffect(() => {
    if (error && 'status' in error) {
      const fetchError = error as FetchBaseQueryError;

      if (fetchError.status === 400 && fetchError.data && typeof fetchError.data === 'object') {
        const message = (fetchError.data as { message?: string }).message;

        if (message) {
          dispatch(setError(message));
          shouldClearErrorRef.current = false;

          errorTimeoutRef.current = setTimeout(() => {
            dispatch(setPaginaActual(1));
            shouldClearErrorRef.current = true;
          }, 2500);

          return () => {
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
          };
        }
      }
    }
  }, [error, dispatch]);

  // ✅ Actualizar paginación
  useEffect(() => {
    if (data) {
      const totalPages = Math.ceil(data.total / params.limit) || 1;

      dispatch(
        updatePagination({
          total: data.total,
          page: params.page,
          limit: params.limit,
          totalPages,
          isInitialSearch: params.page === 1,
        }),
      );

      if (shouldClearErrorRef.current) {
        dispatch(setError(null));
      }
    }

    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, [data, dispatch, params.page, params.limit]);

  return {
    offers: data?.data || [],
    total: data?.total || 0,
    isLoading: isLoading || isFetching,
  };
}

/**
 * Hook para inicializar desde URL en el primer render
 */
export function useInitialUrlParams() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if ([...searchParams.keys()].length > 0) {
      const parsed = parseUrlToFilters(searchParams);

      dispatch(setSearch(parsed.search));
      dispatch(setFilters(parsed.filters));
      dispatch(setSortBy(parsed.sortBy));
      dispatch(setDate(parsed.date));
      dispatch(setRating(parsed.rating));
      dispatch(setTitleOnly(parsed.titleOnly));
      dispatch(setExact(parsed.exact));
      dispatch(setRegistrosPorPagina(parsed.limit));
      dispatch(setPaginaActual(parsed.page));
      dispatch(enablePersistence());
    } else {
      // const restored = restoreFromStorage();

      // 🔧 MIGRACIÓN: Convertir city de string a string[]
      // const migratedState = {
      //   ...restored,
      //   filters: {
      // ...restored.filters,
      // city: (() => {
      // const cityValue = restored.filters.city;
      // Si es string, convertir a array
      // if (typeof cityValue === 'string') {
      //   return cityValue ? [cityValue] : [];
      // }
      // Si ya es array, usar tal cual
      // if (Array.isArray(cityValue)) {
      //   return cityValue;
      // }
      // Fallback
      //     return [];
      //   })(),
      // },
      // };

      // dispatch(restoreSavedState(migratedState));
      dispatch(enablePersistence());
    }
  }, [searchParams, dispatch]);
}

/**
 * Hook para sincronizar Redux state con URL
 */
export function useSyncUrlParams() {
  const router = useRouter();
  const params = useAppSelector(selectSearchParams);
  const prevParamsRef = useRef<string>('');

  useEffect(() => {
    const currentParams = JSON.stringify(params);

    if (currentParams === prevParamsRef.current) return;
    prevParamsRef.current = currentParams;

    const urlParams = filtersToUrlParams({
      search: params.search,
      filters: params.filters,
      sortBy: params.sortBy,
      date: params.date,
      rating: params.rating,
      page: params.page,
      limit: params.limit,
      titleOnly: params.titleOnly,
      exact: params.exact,
    });

    const queryString = urlParams.toString();
    const target = queryString ? `?${queryString}` : '';

    router.replace(target, { scroll: false });
  }, [params, router]);
}

/**
 * Hook para manejar el reset de filtros
 */
export function useResetFilters() {
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetFilters());
    setTimeout(() => {
      dispatch(enablePersistence());
    }, 0);
  };

  return handleReset;
}

/**
 * Hook para obtener el estado completo de jobOffers
 */
export function useJobOffersState() {
  return useAppSelector(selectJobOffersState);
}

/**
 * Hook para manejar Applied Filters en ResultsAdvSearch
 */
export function useAppliedFilters() {
  const [showAppliedFilters, setShowAppliedFilters] = useState<boolean>(false);
  const [appliedParams, setAppliedParams] = useState<ParamsMap | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (isFromAdvSearch()) {
        const sp = new URLSearchParams(window.location.search);
        const params = parseAppliedParams(sp);

        setAppliedParams(params);
        setShowAppliedFilters(true);
        saveAppliedFilters(params);
        clearAdvSearchMark();
      } else {
        const saved = getAppliedFilters();
        if (saved) {
          setAppliedParams(saved);
          setShowAppliedFilters(true);
        }
      }
    } catch (error) {
      console.error('Error loading applied filters:', error);
    }
  }, []);

  const handleClearApplied = () => {
    setShowAppliedFilters(false);
    setAppliedParams(null);
    dispatch(resetFilters());
    clearAppliedFilters();

    if (typeof window !== 'undefined') {
      window.location.href = '/job-offer-list';
    }
  };

  return {
    showAppliedFilters,
    appliedParams,
    handleClearApplied,
  };
}
