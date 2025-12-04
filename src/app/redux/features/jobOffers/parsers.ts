import { FilterState, ParamsMap } from './types';

/**
 * Parsear rango de precio desde string
 */
export function parsePriceRange(key: string): { minPrice: number | null; maxPrice: number | null } {
  if (!key) return { minPrice: null, maxPrice: null };
  const normalized = key.replace(/[$€£,]/g, '').trim();
  const lowerLabel = normalized.toLowerCase();
  const matches = normalized.match(/-?\d+(?:\.\d+)?/g) || [];

  // Detect "Menos de" (less than) => max = number
  if (/(^|\s)menos(\s|$)|menos\s+de|^<\s*/i.test(lowerLabel)) {
    if (matches[0]) return { minPrice: null, maxPrice: Number(matches[0]) };
    return { minPrice: null, maxPrice: null };
  }

  // Detect "Más de" (greater than) => min = number
  if (/(^|\s)m(a|á)s(\s|$)|m(a|á)s\s+de|^>\s*/i.test(lowerLabel)) {
    if (matches[0]) return { minPrice: Number(matches[0]), maxPrice: null };
    return { minPrice: null, maxPrice: null };
  }

  // Range with two numbers
  if (matches.length >= 2) return { minPrice: Number(matches[0]), maxPrice: Number(matches[1]) };

  // Single number without qualifiers -> treat as min (>=)
  if (matches.length === 1) return { minPrice: Number(matches[0]), maxPrice: null };

  return { minPrice: null, maxPrice: null };
}

/**
 * Parsear parámetros de URL a filtros
 */
export function parseUrlToFilters(searchParams: URLSearchParams): {
  search: string;
  filters: FilterState;
  sortBy: string;
  page: number;
  limit: number;
  titleOnly: boolean;
  exact: boolean;
  date: string | null;
  rating: number | null;
} {
  const search = searchParams.get('search') || '';
  const ranges = searchParams.getAll('range');
  const cityRaw = searchParams.get('city') || '';
  const city = cityRaw ? cityRaw.split(',').filter(Boolean) : [];

  const categoryRaw = searchParams.get('category') || '';
  const category = categoryRaw ? categoryRaw.split(',').filter(Boolean) : [];

  const tagsRaw = searchParams.get('tags') || '';
  const tags = tagsRaw ? tagsRaw.split(',').filter(Boolean) : [];

  const minPriceRaw = searchParams.get('minPrice');
  const maxPriceRaw = searchParams.get('maxPrice');
  const minPrice = minPriceRaw != null ? Number(minPriceRaw) : null;
  const maxPrice = maxPriceRaw != null ? Number(maxPriceRaw) : null;

  const page = parseInt(searchParams.get('page') || '1', 10) || 1;
  const limit = parseInt(searchParams.get('limit') || '10', 10) || 10;

  const sortBy = searchParams.get('sort') || searchParams.get('sortBy') || 'recent';

  const titleOnly = searchParams.get('titleOnly') === 'true';
  const exact = searchParams.get('exact') === 'true' || searchParams.get('exactWords') === 'true';

  const date = searchParams.get('date') || null;

  const ratingRaw = searchParams.get('rating');
  const rating =
    ratingRaw != null ? (Number.isNaN(Number(ratingRaw)) ? null : Number(ratingRaw)) : null;

  // ✅ NUEVO: Detectar si la categoría fue automarcada desde búsqueda
  const isAutoSelectedCategory = search.trim() !== '' && category.length > 0;

  // ✅ NUEVO: Detectar si la ciudad fue automarcada desde búsqueda
  const isAutoSelectedCity = search.trim() !== '' && city.length > 0;

  return {
    search,
    filters: {
      range: ranges,
      city,
      category,
      tags,
      minPrice,
      maxPrice,
      isAutoSelectedCategory, // ✅ Agregado
      isAutoSelectedCity, // ✅ Agregado
    },
    sortBy,
    page,
    limit,
    titleOnly,
    exact,
    date,
    rating,
  };
}

/**
 * Parsear parámetros aplicados desde URL (para AppliedFilters)
 */
export function parseAppliedParams(searchParams: URLSearchParams): ParamsMap {
  const params: ParamsMap = {};

  const keys = [
    'search',
    'titleOnly',
    'exact',
    'tags',
    'category',
    'city',
    'minPrice',
    'maxPrice',
    'range',
    'date',
    'sortBy',
    'rating',
  ];

  keys.forEach((k) => {
    // Special-case `range`: it may appear multiple times in the query string
    if (k === 'range') {
      const all = searchParams.getAll('range') || [];
      if (all.length) {
        params[k] = all.filter(Boolean);
      }
      return;
    }

    const val = searchParams.get(k);
    if (val == null) return;

    if (k === 'tags' || k === 'category') {
      // these are encoded as a single, comma-separated value by AdvSearch
      params[k] = val.split(',').filter(Boolean);
    } else if (k === 'titleOnly' || k === 'exact') {
      params[k] = val === 'true';
    } else if (k === 'minPrice' || k === 'maxPrice') {
      const n = Number(val);
      params[k] = Number.isNaN(n) ? null : n;
    } else if (k === 'date') {
      // keep raw date string (YYYY-MM-DD) => display handled by AppliedFilters
      params[k] = val;
    } else if (k === 'rating') {
      const r = Number(val);
      params[k] = Number.isNaN(r) ? null : r;
    } else {
      params[k] = val;
    }
  });

  return params;
}

/**
 * Convertir filtros a URLSearchParams
 */
export function filtersToUrlParams(params: {
  search?: string;
  filters?: FilterState;
  sortBy?: string;
  page?: number;
  limit?: number;
  titleOnly?: boolean;
  exact?: boolean;
  date?: string | null;
  rating?: number | null;
  totalRegistros?: number;
  totalPages?: number;
}): URLSearchParams {
  const urlParams = new URLSearchParams();

  if (params.search?.trim()) urlParams.set('search', params.search.trim());
  if (params.titleOnly) urlParams.set('titleOnly', 'true');
  if (params.exact) urlParams.set('exact', 'true');

  if (params.filters?.range?.length) {
    params.filters.range.forEach((r) => urlParams.append('range', r));
  }
  if (params.filters?.city?.length) {
    urlParams.set('city', params.filters.city.join(','));
  }
  if (params.filters?.category?.length) {
    urlParams.set('category', params.filters.category.join(','));
  }
  if (params.filters?.tags?.length) {
    urlParams.set('tags', params.filters.tags.join(','));
  }
  if (params.filters?.minPrice != null) {
    urlParams.set('minPrice', String(params.filters.minPrice));
  }
  if (params.filters?.maxPrice != null) {
    urlParams.set('maxPrice', String(params.filters.maxPrice));
  }

  if (params.sortBy) urlParams.set('sort', params.sortBy);
  if (params.date) urlParams.set('date', params.date);
  if (params.rating != null) urlParams.set('rating', String(params.rating));
  if (params.page != null) urlParams.set('page', String(params.page));
  if (params.limit != null) urlParams.set('limit', String(params.limit));
  if (params.totalRegistros != null) urlParams.set('total', String(params.totalRegistros));
  if (params.totalPages != null) urlParams.set('totalPages', String(params.totalPages));
  return urlParams;
}

/**
 * Formatear fecha para display
 */
export function formatDateForDisplay(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formatear fecha a YYYY-MM-DD
 */
export function formatDateToISO(date: Date | null): string | null {
  if (!date) return null;
  try {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  } catch {
    return null;
  }
}
