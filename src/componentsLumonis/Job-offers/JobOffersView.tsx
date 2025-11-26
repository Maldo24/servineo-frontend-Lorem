// src/Components/Job-offers/JobOffersView.tsx
'use client';

import React from 'react';
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
}

export const JobOffersView: React.FC<JobOffersViewProps> = ({
  offers,
  viewMode,
  onOfferClick,
  className = '',
  showTitle = true,
}) => {
  const t = useTranslations('cardJob');

  // Para mobile, siempre mostrar grid
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const effectiveViewMode = isMobile ? 'grid' : viewMode;

  if (offers.length === 0) {
    return (
      <div className={className}>
        {showTitle && (
          <h1 className="text-lg font-semibold mb-4 border-b border-gray-400 pb-2">
            {t('searchResults')}
          </h1>
        )}
        <p className="text-gray-500 text-center">{t('noResults')}</p>
      </div>
    );
  }

  // Vista de mapa
  if (effectiveViewMode === 'map') {
    return (
      <div className={className}>
        <div className="h-[calc(100vh-250px)] rounded-lg overflow-hidden border border-gray-200 bg-white mb-8">
          <MapView
            offers={mockJobOffers}
            onOfferClick={(offer) => {
              const originalOffer = offers.find((o) => o._id === offer.id);
              if (originalOffer && onOfferClick) {
                onOfferClick(originalOffer);
              }
            }}
          />
        </div>
      </div>
    );
  }

  // Vista Grid
  if (effectiveViewMode === 'grid') {
    return (
      <div className={className}>
        {showTitle && (
          <h1 className="text-lg font-semibold mb-4 border-b border-gray-400 pb-2">
            {t('searchResults')}
          </h1>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <JobOfferCard key={offer._id} offer={offer} viewMode="grid" onClick={onOfferClick} />
          ))}
        </div>
      </div>
    );
  }

  // Vista List
  return (
    <div className={className}>
      {showTitle && (
        <h1 className="text-lg font-semibold mb-4 border-b border-gray-400 pb-2">
          {t('searchResults')}
        </h1>
      )}
      <div className="flex flex-col gap-4">
        {offers.map((offer) => (
          <JobOfferCard key={offer._id} offer={offer} viewMode="list" onClick={onOfferClick} />
        ))}
      </div>
    </div>
  );
};
