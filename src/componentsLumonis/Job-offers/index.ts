// src/app/job-offer/componentsLumonis_jo/index.ts
export { SearchBar } from '@/componentsLumonis/Job-offers/Search/SearchBar';
export { NoResultsMessage } from '@/componentsLumonis/Job-offers/Search/NoResultsMessage';
export { FilterButton } from '@/componentsLumonis/Job-offers/Filter/FilterButton';
export { FilterDrawer } from '@/componentsLumonis/Job-offers/Filter/FilterDrawer';
export { default as Paginacion } from '@/componentsLumonis/Job-offers/Pagination/Paginacion';
export { default as PaginationInfo } from '@/componentsLumonis/Job-offers/Pagination/PaginationInfo';
export { default as PaginationSelector } from '@/componentsLumonis/Job-offers/Pagination/PaginationSelector';
export { default as SortCard } from '@/componentsLumonis/Job-offers/Sort/SortCard';

export { JobOfferCard } from './JobOfferCard';
export { JobOffersView } from './JobOffersView';
export type { ViewMode } from './JobOffersView';
export { ViewModeToggle } from './ViewModeToggle';

// Re-exportar tipos compartidos para conveniencia
export type { JobOfferData, AdaptedJobOffer } from '@/types/jobOffers';
export { adaptOfferToModalFormat, prepareOfferImages } from '@/types/jobOffers';
