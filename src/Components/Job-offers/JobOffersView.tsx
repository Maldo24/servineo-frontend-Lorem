// src/Components/Job-offers/JobOffersView.tsx
'use client';

import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { JobOfferCard } from './JobOfferCard';
import { MapView } from './maps/MapView';
import { mockJobOffers } from '@/app/lib/mock-data';
import { JobOfferData } from '@/types/jobOffers';

export type ViewMode = 'grid' | 'list' | 'map';

interface JobOffersViewProps {
  offers: JobOfferData[];
  viewMode: ViewMode;
  onOfferClick?: (offer: JobOfferData) => void;
  className?: string;
  showTitle?: boolean;
  search?: string;
}

export const JobOffersView = memo<JobOffersViewProps>(
  ({ offers, viewMode, onOfferClick, className = '', showTitle = true, search = '' }) => {
    const t = useTranslations('cardJob');

    // Para mobile, siempre mostrar grid
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const effectiveViewMode = isMobile ? 'grid' : viewMode;

    const handleOfferClick = useCallback(
      (offer: JobOfferData) => {
        onOfferClick?.(offer);
      },
      [onOfferClick],
    );

    const handleMapOfferClick = useCallback(
      (offer: { id: string }) => {
        const originalOffer = offers.find((o) => o._id === offer.id);
        if (originalOffer && onOfferClick) {
          onOfferClick(originalOffer);
        }
      },
      [offers, onOfferClick],
    );

    const gridClasses = useMemo(() => {
      switch (effectiveViewMode) {
        case 'grid':
          return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4';
        case 'list':
          return 'flex flex-col gap-4';
        case 'map':
          return '';
        default:
          return 'grid grid-cols-1 gap-4';
      }
    }, [effectiveViewMode]);

    const renderedCards = useMemo(() => {
      return offers.map((offer) => (
        <JobOfferCard
          key={offer._id}
          offer={offer}
          viewMode={effectiveViewMode === 'map' ? 'grid' : effectiveViewMode}
          onClick={handleOfferClick}
          searchQuery={search}
        />
      ));
    }, [offers, effectiveViewMode, handleOfferClick, search]);

    // Empty state
    if (offers.length === 0) {
      return (
        <div className={className}>
          {showTitle && (
            <h1 className='text-lg font-semibold mb-4 border-b border-gray-400 pb-2'>
              {t('searchResults')}
            </h1>
          )}
          <p className='text-gray-500 text-center'>{t('noResults')}</p>
        </div>
      );
    }

    // Vista de mapa
    if (effectiveViewMode === 'map') {
      return (
        <div className={className}>
          <div className='h-[calc(100vh-250px)] rounded-lg overflow-hidden border border-gray-200 bg-white mb-8'>
            <MapView offers={mockJobOffers} onOfferClick={handleMapOfferClick} />
          </div>
        </div>
      );
    }

    // Vista Grid o List
    return (
      <div className={className}>
        {showTitle && (
          <h1 className='text-lg font-semibold mb-4 border-b border-gray-400 pb-2'>
            {t('searchResults')}
          </h1>
        )}
        <div className={gridClasses}>{renderedCards}</div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Comparar props primitivas
    if (prevProps.viewMode !== nextProps.viewMode) return false;
    if (prevProps.search !== nextProps.search) return false;
    if (prevProps.className !== nextProps.className) return false;
    if (prevProps.showTitle !== nextProps.showTitle) return false;

    // Comparar longitud de arrays
    if (prevProps.offers.length !== nextProps.offers.length) return false;

    // Comparar IDs de ofertas (shallow comparison es suficiente)
    return prevProps.offers.every((offer, index) => offer._id === nextProps.offers[index]._id);
  },
);

JobOffersView.displayName = 'JobOffersView';
