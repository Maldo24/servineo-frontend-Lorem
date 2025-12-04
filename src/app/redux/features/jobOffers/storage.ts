export const STORAGE_KEYS = {
  PAGE: 'jobOffers_paginaActual',
  PAGE_SIZE: 'jobOffers_registrosPorPagina',
  SEARCH: 'jobOffers_search',
  FILTERS: 'jobOffers_filters',
  SORT: 'jobOffers_sortBy',
  TITLE_ONLY: 'jobOffers_titleOnly',
  EXACT: 'jobOffers_exact',
  DATE: 'jobOffers_date',
  RATING: 'jobOffers_rating',
  TOTAL_REGISTROS: 'jobOffers_totalRegistros',
  TOTAL_PAGES: 'jobOffers_totalPages',
  PRESERVED_TOTAL: 'jobOffers_preservedTotal',
} as const;

/**
 * Helper para leer localStorage de forma segura
 */ /*
export const getStoredValue = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};*/

/**
 * Helper para guardar en localStorage
 */ /*
export const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }
};*/

/**
 * Helper para limpiar TODO el localStorage relacionado
 */ /*
export const clearJobOffersStorage = (): void => {
  if (typeof window !== 'undefined') {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};*/

/**
 * Restaurar todo el estado desde localStorage
 */ /*
export const restoreFromStorage = () => {
  return {
    search: getStoredValue(STORAGE_KEYS.SEARCH, ''),
    filters: getStoredValue(STORAGE_KEYS.FILTERS, { range: [], city: '', category: [] }),
    sortBy: getStoredValue(STORAGE_KEYS.SORT, 'recent'),
    paginaActual: getStoredValue(STORAGE_KEYS.PAGE, 1),
    registrosPorPagina: getStoredValue(STORAGE_KEYS.PAGE_SIZE, 10),
    titleOnly: getStoredValue(STORAGE_KEYS.TITLE_ONLY, false),
    exact: getStoredValue(STORAGE_KEYS.EXACT, false),
    date: getStoredValue(STORAGE_KEYS.DATE, null),
    rating: getStoredValue(STORAGE_KEYS.RATING, null),
    totalRegistros: getStoredValue(STORAGE_KEYS.TOTAL_REGISTROS, 0),
    totalPages: getStoredValue(STORAGE_KEYS.TOTAL_PAGES, 0),
    preservedTotalRegistros: getStoredValue(STORAGE_KEYS.PRESERVED_TOTAL, 0),
  };
};*/
/*
export const saveCountsToStorage = (counts: {
  totalRegistros: number;
  totalPages: number;
  preservedTotalRegistros: number;
}): void => {
  saveToStorage(STORAGE_KEYS.TOTAL_REGISTROS, counts.totalRegistros);
  saveToStorage(STORAGE_KEYS.TOTAL_PAGES, counts.totalPages);
  saveToStorage(STORAGE_KEYS.PRESERVED_TOTAL, counts.preservedTotalRegistros);
};*/
