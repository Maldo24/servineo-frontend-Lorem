// src/app/job-offer/components_jo/index.ts
export { SearchBar } from '@/Components/Job-offers/Search/SearchBar';
export { NoResultsMessage } from '@/Components/Job-offers/Search/NoResultsMessage';
export { FilterButton } from '@/Components/Job-offers/Filter/FilterButton';
export { FilterDrawer } from '@/Components/Job-offers/Filter/FilterDrawer';
export { default as Paginacion } from '@/Components/Job-offers/Pagination/Paginacion';
export { default as PaginationInfo } from '@/Components/Job-offers/Pagination/PaginationInfo';
export { default as PaginationSelector } from '@/Components/Job-offers/Pagination/PaginationSelector';
export { default as SortCard } from '@/Components/Job-offers/Sort/SortCard';

export { JobOfferCard } from './JobOfferCard';
export { JobOffersView } from './JobOffersView';
export type { ViewMode } from './JobOffersView';
export { ViewModeToggle } from './ViewModeToggle';

// Re-exportar tipos compartidos para conveniencia
export type { JobOfferData, AdaptedJobOffer } from '@/types/jobOffers';
export { adaptOfferToModalFormat, prepareOfferImages } from '@/types/jobOffers';