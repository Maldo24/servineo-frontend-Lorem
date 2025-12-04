// src/app/AdvSearch/hooks/useSyncUrlParamsAdv.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { MutableRefObject } from 'react';

interface Params {
  search?: string;
  filters?: {
    range?: string[];
    city?: string[];
    category?: string[];
    tags?: string[];
    minPrice?: number | null;
    maxPrice?: number | null;
  };
  titleOnly?: boolean;
  exact?: boolean;
  date?: string | null;
  rating?: number | null;
  sortBy?: string | null;
  page?: number;
  limit?: number;
  // optional ref to temporarily skip syncing (set true before navigation)
  skipSyncRef?: MutableRefObject<boolean | null>;
}

export const useSyncUrlParamsAdv = (p: Params) => {
  const router = useRouter();
  // Destructure once so we can use stable primitives in deps
  const { search, filters, titleOnly, exact, date, sortBy, page, limit, skipSyncRef } = p;
  // rating is declared on Params; use it directly to avoid `any` casts
  const rating: number | null | undefined = p.rating;

  // Extract nested filter properties to satisfy exhaustive-deps
  const filterRange = filters?.range;
  const filterCity = filters?.city;
  const filterCategory = filters?.category;
  const filterTags = filters?.tags;
  const filterMinPrice = filters?.minPrice;
  const filterMaxPrice = filters?.maxPrice;

  useEffect(() => {
    // If parent signals skipping sync (e.g. about to navigate), consume the flag and skip one run
    if (skipSyncRef && skipSyncRef.current) {
      // reset flag and skip this sync to avoid overriding navigation
      skipSyncRef.current = false;
      return;
    }

    const hasAny = !!(
      (search && search.trim() !== '') ||
      titleOnly ||
      exact ||
      (date && date.trim() !== '') ||
      (sortBy && sortBy.trim() !== '') ||
      rating != null ||
      (filterRange && filterRange.length) ||
      filterCity ||
      (filterCategory && filterCategory.length) ||
      (filterTags && filterTags.length) ||
      filterMinPrice != null ||
      filterMaxPrice != null
    );

    const params = new URLSearchParams();
    if (search && search.trim()) params.set('search', search.trim());
    if (titleOnly) params.set('titleOnly', 'true');
    if (exact) params.set('exact', 'true');
    filterRange?.forEach((r) => params.append('range', r));
    if (filterCity && filterCity.length) params.set('city', filterCity.join(','));
    if (filterCategory && filterCategory.length) params.set('category', filterCategory.join(','));
    if (filterTags && filterTags.length) params.set('tags', filterTags.join(','));
    if (filterMinPrice != null) params.set('minPrice', String(filterMinPrice));
    if (filterMaxPrice != null) params.set('maxPrice', String(filterMaxPrice));
    if (date) params.set('date', date);
    if (rating != null) params.set('rating', String(rating));
    if (sortBy) params.set('sort', sortBy);
    if (page != null) params.set('page', String(page));
    if (limit != null) params.set('limit', String(limit));

    const qs = params.toString();
    // Use relative query update like job-offer: replace only the search part (keeps pathname)
    const targetSearch = qs ? `?${qs}` : '';

    // If nothing is active, ensure the search is cleared
    if (!hasAny) {
      if (typeof window !== 'undefined' && window.location.search === '') return;
      router.replace(targetSearch, { scroll: false });
      if (typeof window !== 'undefined' && window.location.search !== targetSearch) {
        try {
          window.history.replaceState(null, '', window.location.pathname + targetSearch);
        } catch {
          /* noop */
        }
      }
      return;
    }

    // Avoid replacing if search already matches target (prevents unnecessary navigation)
    if (typeof window !== 'undefined' && window.location.search === targetSearch) return;

    // update Next router and ensure browser address bar shows the search
    router.replace(targetSearch, { scroll: false });
    if (typeof window !== 'undefined' && window.location.search !== targetSearch) {
      try {
        window.history.replaceState(null, '', window.location.pathname + targetSearch);
      } catch {
        /* noop */
      }
    }
  }, [
    search,
    titleOnly,
    exact,
    date,
    sortBy,
    page,
    limit,
    rating,
    router,
    skipSyncRef,
    filterRange,
    filterCity,
    filterCategory,
    filterTags,
    filterMinPrice,
    filterMaxPrice,
  ]);
};
export default useSyncUrlParamsAdv;
