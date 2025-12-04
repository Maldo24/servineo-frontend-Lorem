'use client';

import { useRouter } from 'next/navigation';
import { MapPin, Star, ChevronRight, MessageCircle } from 'lucide-react';
import type { JobOffer } from '@/app/lib/mock-data';
import { ImageCarousel } from '@/Components/Shared/ImageCarousel';
import Image from 'next/image';

interface JobOfferCardProps {
  offer: JobOffer;
  showFixerInfo?: boolean;
  onClick?: () => void;
}

export function JobOfferCard({ offer, showFixerInfo = true, onClick }: JobOfferCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/fixer/${offer.fixerId}`);
  };

  const images =
    offer.photos?.length > 0 ? offer.photos : ['/placeholder.svg?height=180&width=320&text=Oferta'];

  return (
    <div
      onClick={handleCardClick}
      className='group relative w-full overflow-hidden rounded-xl  border-primary border-2 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
    >
      <div className='h-48 w-full relative'>
        <ImageCarousel images={images} alt={offer.title || 'Oferta de trabajo'} />

        {/* City Badge */}
        <div className='absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700 shadow-sm border border-gray-200'>
          <MapPin className='w-3 h-3 text-primary' />
          <span className='font-medium text-gray-700'>{offer.city}</span>
        </div>

        {/* Price */}
        <div className='absolute right-3 top-3 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-primary shadow-sm border border-primary/20'>
          {offer.price?.toLocaleString()} Bs
        </div>

        {/* WhatsApp Button */}
        {offer.whatsapp && (
          <a
            href={`https://wa.me/${offer.whatsapp.replace(/\s/g, '')}`}
            target='_blank'
            rel='noopener noreferrer'
            onClick={(e) => e.stopPropagation()}
            className='absolute right-3 bottom-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors'
            aria-label='Contactar por WhatsApp'
          >
            <MessageCircle className='w-5 h-5 text-primary' />
          </a>
        )}
      </div>

      {/* Offer Information */}
      <div className='p-4 flex flex-col h-full'>
        <div className='flex-1'>
          <div className='mb-3'>
            <h3 className='text-lg font-semibold text-gray-900 mb-1'>{offer.title}</h3>
            <p className='text-sm text-gray-500 line-clamp-2'>{offer.description}</p>
          </div>

          {/* Service Type */}
          {offer.services?.[0] && (
            <div className='mb-3'>
              <span className='inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                {offer.services[0]}
              </span>
            </div>
          )}
        </div>

        {/* Fixer Info - Ahora en la parte inferior */}
        {showFixerInfo && (
          <div className='mt-4 pt-3 border-t border-gray-100' onClick={handleViewProfile}>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0'>
                {offer.fixerPhoto ? (
                  <Image
                    src={offer.fixerPhoto}
                    alt={offer.fixerName || 'Fixer'}
                    className='w-full h-full object-cover'
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className='w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium'>
                    {offer.fixerName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium text-gray-900 truncate'>
                    {offer.fixerName || 'Usuario'}
                  </p>
                  <ChevronRight className='w-4 h-4 text-gray-400' />
                </div>
                <div className='flex items-center text-xs text-gray-500 mt-0.5'>
                  <Star className='w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1' />
                  <span>{offer.rating?.toFixed(1) || 'Nuevo'}</span>
                  <span className='mx-1.5'>•</span>
                  <span>{offer.completedJobs || 0} trabajos</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
