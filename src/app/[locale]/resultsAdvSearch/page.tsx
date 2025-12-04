// src/app/[locale]/resultsAdvSearch/page.tsx
'use client';
import React, { Suspense, useState } from 'react';
import { useTranslations } from 'next-intl';
import AppliedFilters from '@/Components/ResultsAdvSearch/AppliedFilters';
import { Paginacion, PaginationInfo, PaginationSelector } from '@/Components/Job-offers';
import { JobOffersView, type ViewMode } from '@/Components/Job-offers/JobOffersView';
import { ViewModeToggle } from '@/Components/Job-offers/ViewModeToggle';
import { JobOfferModal } from '@/Components/Job-offers/Job-offer-modal';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setRegistrosPorPagina, setPaginaActual } from '@/app/redux/slice/jobOfert';
import {
  useSyncUrlParams,
  useInitialUrlParams,
  useAppliedFilters,
  useJobOffers,
} from '@/app/redux/features/jobOffers/jobOffersHooks';
import type { JobOfferData, AdaptedJobOffer } from '@/types/jobOffers';
import { adaptOfferToModalFormat } from '@/types/jobOffers';

function ResultsAdvSearchPageContent() {
  const t = useTranslations('resultsAdvSearch');
  const dispatch = useAppDispatch();
  const { appliedParams } = useAppliedFilters();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedOffer, setSelectedOffer] = useState<AdaptedJobOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inicializar la página a partir de los query params (viene de AdvSearch)
  useInitialUrlParams();
  const { offers } = useJobOffers();

  // Leer estado compartido de jobOffers
  const { loading, paginaActual, registrosPorPagina, totalRegistros } = useAppSelector(
    (s) => s.jobOfert,
  );

  const handlePageChange = (newPage: number) => {
    dispatch(setPaginaActual(newPage));
  };

  const handleRegistrosChange = (valor: number) => {
    dispatch(setRegistrosPorPagina(valor));
  };

  const handleCardClick = (offer: JobOfferData) => {
    const adaptedOffer = adaptOfferToModalFormat(offer);
    setSelectedOffer(adaptedOffer);
    setIsModalOpen(true);
  };

  // Mantener sincronizada la URL con el estado (página, limit, filtros, etc.)
  useSyncUrlParams();

  return (
    <>
      <main className='pt-20 lg:pt-24 px-4 sm:px-6 md:px-12 lg:px-24 pb-12'>
        <h1 className='text-center text-xl sm:text-2xl md:text-3xl font-bold mb-8 mt-4'>
          {t('pageTitle')}
        </h1>

        <AppliedFilters params={appliedParams ?? {}} />
        <div className='flex w-full max-w-5xl mx-auto mt-4 px-4 mb-2 items-center justify-between'>
          {/* Left side */}
          <div className='flex items-center gap-4'>
            <PaginationSelector
              registrosPorPagina={registrosPorPagina}
              onChange={handleRegistrosChange}
            />
          </div>

          {/* Right side */}
          <div className='flex items-center gap-3'>
            {/* Mobile toggle */}
            <ViewModeToggle
              viewMode={viewMode}
              onChange={setViewMode}
              variant='mobile'
              className='flex lg:hidden'
            />

            {/* Desktop toggle */}
            <ViewModeToggle
              viewMode={viewMode}
              onChange={setViewMode}
              variant='desktop'
              className='hidden lg:flex'
            />
          </div>
        </div>

        <div className='flex justify-center my-4'>
          <PaginationInfo
            paginaActual={paginaActual}
            registrosPorPagina={registrosPorPagina}
            totalRegistros={totalRegistros}
          />
        </div>

        {/* Cards de resultados (reutilizadas) */}
        <div className='w-full max-w-5xl mx-auto'>
          {!loading && offers && offers.length > 0 ? (
            <JobOffersView offers={offers} viewMode={viewMode} onOfferClick={handleCardClick} />
          ) : !loading ? (
            <div className='text-gray-500 text-center'>{t('noResults')}</div>
          ) : (
            <div className='text-blue-500 text-center mb-4 p-3 bg-blue-100 rounded'>
              {t('loading')}
            </div>
          )}
        </div>

        {/* Paginación inferior (reutilizada) */}
        {!loading && offers && offers.length > 0 && (
          <div className='mt-8 mb-24 flex justify-center'>
            <Paginacion
              paginaActual={paginaActual}
              registrosPorPagina={registrosPorPagina}
              totalRegistros={totalRegistros}
              onChange={handlePageChange}
            />
          </div>
        )}
      </main>

      <JobOfferModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default function ResultsAdvSearchPage() {
  const t = useTranslations('AdvSearch');

  return (
    <Suspense
      fallback={
        <div className='pt-20 lg:pt-24 px-4 flex justify-center items-center min-h-screen'>
          <div className='text-blue-500 text-center p-3 bg-blue-100 rounded'>
            {t('loadingFallback')}
          </div>
        </div>
      }
    >
      <ResultsAdvSearchPageContent />
    </Suspense>
  );
}
