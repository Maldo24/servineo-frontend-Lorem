// src/Components/Home/RecentOffer-section.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { JobOfferCard } from '@/Components/Job-offers/JobOfferCard';
import { JobOfferModal } from '../Job-offers/Job-offer-modal';
import { useGetRecentOffersQuery } from '@/app/redux/services/jobOffersApi';
import { DB_VALUES } from '@/app/redux/contants';
import type { JobOfferData, AdaptedJobOffer } from '@/types/jobOffers';
import { adaptOfferToModalFormat } from '@/types/jobOffers';

export default function RecentOffersSection() {
  const t = useTranslations('RecentOffer');
  const tCat = useTranslations('Categories');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const CATEGORIES = DB_VALUES.categories;

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedOffer, setSelectedOffer] = useState<AdaptedJobOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const {
    data: offersData,
    isLoading,
    error: fetchError,
  } = useGetRecentOffersQuery({
    category: selectedCategory !== 'Todos' ? selectedCategory : undefined,
    limit: 8,
  });

  const trabajos = offersData?.data || [];
  const error = fetchError ? 'Error al cargar ofertas' : null;

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check scroll state
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    return () => container.removeEventListener('scroll', checkScroll);
  }, [selectedCategory]);

  const handleCardClick = (offer: JobOfferData) => {
    const adaptedOffer = adaptOfferToModalFormat(offer);
    setSelectedOffer(adaptedOffer);
    setIsModalOpen(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  return (
    <section className='w-full py-12 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>{t('recOfTitle')}</h2>
            <p className='text-gray-600'>{t('recOfDescription')}</p>
          </div>

          <Link
            href='/job-offer-list'
            className='inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg'
          >
            {t('viewAll')}
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </div>

        {/* Category Filter */}
        <div className='mb-6'>
          {isMobile ? (
            <div className='relative'>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                    canScrollLeft
                      ? 'bg-white border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary shadow-sm'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label='Scroll left'
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>

                <div
                  ref={scrollContainerRef}
                  className='flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1'
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {tCat(cat)}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                    canScrollRight
                      ? 'bg-white border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary shadow-sm'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label='Scroll right'
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              </div>
            </div>
          ) : (
            <div className='flex flex-wrap gap-2'>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {tCat(cat)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className='text-center py-12'>
            <p className='text-red-500 mb-4'>{error}</p>
          </div>
        )}

        {/* Offers Grid */}
        {!isLoading && !error && trabajos.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {trabajos.map((trabajo) => (
              <JobOfferCard
                key={trabajo._id}
                offer={trabajo}
                viewMode='grid'
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && trabajos.length === 0 && (
          <div className='text-center py-12'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4'>
              <SlidersHorizontal className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>{t('noOffersAvailable')}</h3>
            <p className='text-gray-500'>{t('noOffersCategory')}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <JobOfferModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
