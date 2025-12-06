// src/Components/Job-offers/JobOfferCard.tsx
'use client';

import React, { memo, useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useImageCarousel } from '@/app/redux/features/jobOffers/useImageCarousel';
import type { JobOfferData } from '@/types/jobOffers';
import { SearchHighlight } from '../SearchHighlight';
import { getPromotionsByOfferId } from '@/services/promotions';

interface JobOfferCardProps {
  offer: JobOfferData;
  viewMode?: 'grid' | 'list' | string;
  onClick?: (offer: JobOfferData) => void;
  onEdit?: (offer: JobOfferData) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: () => void;
  onCreatePromo?: () => void;
  className?: string;
  searchQuery?: string;
  readOnly?: boolean;
}

export const JobOfferCard = memo<JobOfferCardProps>(
  ({
    offer,
    viewMode = 'grid',
    onClick,
    onEdit,
    onDelete,
    onToggleActive,
    onCreatePromo,
    className = '',
    searchQuery = '',
    readOnly = false,
  }) => {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('cardJob');
    const tCat = useTranslations('Categories');
    const [hasPromotions, setHasPromotions] = useState(false);
    const [loadingPromos, setLoadingPromos] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Verificar si la oferta tiene promociones
    useEffect(() => {
      const checkPromotions = async () => {
        try {
          const promotions = await getPromotionsByOfferId(offer._id);
          setHasPromotions(Array.isArray(promotions) && promotions.length > 0);
        } catch (error) {
          console.warn(`Error checking promotions for offer ${offer._id}:`, error);
          setHasPromotions(false);
        } finally {
          setLoadingPromos(false);
        }
      };

      checkPromotions();
    }, [offer._id]);

    // Preparar imágenes
    const images = React.useMemo(() => {
      const imageArray = [];

      if (offer.allImages && offer.allImages.length > 0) {
        imageArray.push(...offer.allImages);
      } else if (offer.photos && offer.photos.length > 0) {
        imageArray.push(...offer.photos);
      } else if (offer.imagenUrl) {
        imageArray.push(offer.imagenUrl);
      }

      // Filtrar y validar imágenes
      return imageArray.filter((img) => {
        if (!img || typeof img !== 'string') return false;

        const trimmed = img.trim();
        if (trimmed.length === 0) return false;

        // Validar que sea una URL válida
        try {
          new URL(trimmed);
          return true;
        } catch {
          // Si no es URL válida pero es una ruta relativa, permitir
          return trimmed.startsWith('/') || trimmed.startsWith('./');
        }
      });
    }, [offer.allImages, offer.photos, offer.imagenUrl]);

    const {
      currentIndex,
      isHovered,
      isTouching,
      elementRef,
      handleMouseEnter,
      handleMouseLeave,
      handlePrevImage,
      handleNextImage,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    } = useImageCarousel(offer._id, images.length);

    const handleWhatsAppClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        const cleanPhone = offer.contactPhone.replace(/\D/g, '');
        const message = encodeURIComponent(
          `Hola ${offer.fixerName}, vi tu oferta "${offer.title}" y me interesa.`,
        );
        window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
      },
      [offer.contactPhone, offer.fixerName, offer.title],
    );

    const handleFixerClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (offer.fixerId) {
          // Si quieres mantener el console.log(offer), debes incluir 'offer' en las dependencias.
          // Si eliminas el console.log, podrías dejar solo [offer.fixerId, router]
          console.log(offer);
          console.log('Navigating to fixer with ID:', offer.fixerId);
          router.push(`/fixer/${offer.fixerId}`);
        }
      },
      // CORRECCIÓN: Se agregó 'offer' aquí porque se usa dentro del console.log
      [offer, router],
    );

    const handleCardClick = useCallback(() => {
      if (onClick) onClick(offer);
    }, [onClick, offer]);

    const handleEditClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) onEdit(offer);
      },
      [onEdit, offer],
    );

    const handleDeleteClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) onDelete(offer._id);
      },
      [onDelete, offer._id],
    );

    const handleToggleMenu = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen((prev) => !prev);
    }, []);

    const handleToggleActiveClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleActive) {
          onToggleActive();
          setIsMenuOpen(false);
        }
      },
      [onToggleActive],
    );

    const handleViewPromotions = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/${locale}/promotions/${offer._id}`);
        setIsMenuOpen(false);
      },
      [offer._id, locale, router],
    );

    const handleCreatePromoClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onCreatePromo) {
          onCreatePromo();
          setIsMenuOpen(false);
        }
      },
      [onCreatePromo],
    );

    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = () => {
        if (isMenuOpen) setIsMenuOpen(false);
      };

      if (isMenuOpen) {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
      }
    }, [isMenuOpen]);

    const isDashboardMode = !!onEdit || !!onDelete;
    const totalImages = images.length;

    // Render Image Carousel
    const renderImageCarousel = () => (
      <div
        className={`relative overflow-hidden transition-transform ${isTouching ? 'scale-[0.98]' : 'scale-100'} ${viewMode === 'grid' ? 'h-48 w-full' : 'w-64 h-full flex-shrink-0'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        {images.length > 0 ? (
          images.map((img, idx) => {
            // Double-check en tiempo de render
            if (!img || typeof img !== 'string') return null;

            return (
              <Image
                key={idx}
                src={img}
                alt={offer.title}
                fill
                sizes={
                  viewMode === 'grid'
                    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                    : '16rem'
                }
                className={`object-cover transition-all duration-500 ${idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                style={{ position: 'absolute' }}
                priority={idx === 0}
                onError={(e) => {
                  console.warn(`Failed to load image: ${img}`, e);
                }}
              />
            );
          })
        ) : (
          <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400'>
            <span className='text-sm'>No image</span>
          </div>
        )}

        {/* Navigation Arrows */}
        {totalImages > 1 && isHovered && (
          <>
            <button
              onClick={handlePrevImage}
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg transition-all z-20 hover:scale-110 active:scale-95'
            >
              <ChevronLeft className='w-4 h-4 text-gray-800' />
            </button>
            <button
              onClick={handleNextImage}
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg transition-all z-20 hover:scale-110 active:scale-95'
            >
              <ChevronRight className='w-4 h-4 text-gray-800' />
            </button>
          </>
        )}

        {/* Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        {/* Indicators */}
        {totalImages > 1 && (
          <div className='absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10'>
            {Array.from({ length: totalImages }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white shadow-lg' : 'w-1.5 bg-white/60'}`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className='absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-sm border border-primary'>
          <MapPin className='w-3.5 h-3.5 text-primary' />
          <span className='text-gray-700'>{offer.city}</span>
        </div>

        {!loadingPromos && hasPromotions && (
          <div className='absolute left-3 top-12 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 px-3 py-1.5 text-xs font-bold shadow-md border border-yellow-500 text-yellow-900 animate-pulse'>
            <svg
              className='w-3.5 h-3.5'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
            <span>Promoción</span>
          </div>
        )}

        {viewMode === 'grid' && (
          <div className='absolute right-3 top-3 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold shadow-sm border border-primary/20'>
            <span className='text-primary'>{offer.price?.toLocaleString()} Bs</span>
          </div>
        )}
      </div>
    );

    // Render Content
    const renderContent = () => (
      <div className={`flex flex-col ${viewMode === 'grid' ? 'p-4' : 'flex-1 p-4 relative'}`}>
        {viewMode === 'list' && (
          <div className='absolute right-4 top-4 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold shadow-sm border border-primary/20'>
            <span className='text-primary'>{offer.price?.toLocaleString()} Bs</span>
          </div>
        )}

        <div className={viewMode === 'list' ? 'mb-2 pr-32' : ''}>
          <h3
            className={`text-base font-semibold text-gray-900 group-hover:text-primary transition-colors ${viewMode === 'grid' ? 'truncate' : 'text-left'}`}
          >
            <SearchHighlight text={offer.title} searchQuery={searchQuery} />
          </h3>
          <p className='mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed'>
            <SearchHighlight text={offer.description} searchQuery={searchQuery} />
          </p>
        </div>

        <div className='mt-2 flex items-center justify-between'>
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary'>
              {offer.category ? tCat(offer.category) : ''}
            </span>
            {offer.tags && offer.tags.length > 0 && (
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600'>
                {offer.tags[0]}
              </span>
            )}
          </div>
          <span className='text-xs text-gray-400 font-medium ml-auto'>
            {new Date(offer.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    );

    // Render Footer
    const renderFooter = () => {
      if (isDashboardMode && !readOnly) {
        return (
          <div className='border-t border-gray-100 p-3 flex items-center justify-between bg-gray-50/50'>
            {/* Status Badge */}
            <div className='flex items-center gap-2'>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  offer.status
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {offer.status ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* Actions Menu */}
            <div className='flex items-center gap-2'>
              {onEdit && (
                <button
                  onClick={handleEditClick}
                  className='p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors'
                  title='Editar'
                >
                  <Edit2 className='w-4 h-4' />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className='p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors'
                  title='Eliminar'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              )}
              {onToggleActive && (
                <div className='relative'>
                  <button
                    onClick={handleToggleMenu}
                    className='p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors'
                    title='Más opciones'
                  >
                    <MoreVertical className='w-4 h-4' />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className='absolute right-0 bottom-full mb-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50'>
                      <button
                        onClick={handleToggleActiveClick}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border-b border-gray-100'
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${offer.status ? 'bg-gray-400' : 'bg-green-500'}`}
                        />
                        {offer.status ? 'Desactivar oferta' : 'Activar oferta'}
                      </button>
                      <button
                        onClick={handleViewPromotions}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border-b border-gray-100'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                        Ver promociones
                      </button>
                      {onCreatePromo && (
                        <>
                          <div className='h-px bg-gray-100' />
                          <button
                            onClick={handleCreatePromoClick}
                            className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2'
                          >
                            <svg
                              className='w-4 h-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 4v16m8-8H4'
                              />
                            </svg>
                            Crear promoción
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }

      if (readOnly) return null;

      return (
        <div className='border-t border-gray-100 p-3 flex items-center justify-between gap-3'>
          <div
            className='flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity'
            onClick={handleFixerClick}
          >
            <div className='w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100'>
              {offer.fixerPhoto ? (
                <Image
                  src={offer.fixerPhoto}
                  alt={offer.fixerName}
                  width={36}
                  height={36}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold'>
                  {offer.fixerName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            <div className='min-w-0 flex-1'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                {offer.fixerName || t('defaultUserName')}
              </p>
              {offer.rating && (
                <div className='flex items-center gap-1 mt-0.5'>
                  <Star className='w-3.5 h-3.5 fill-amber-400 text-amber-400' />
                  <span className='text-xs font-semibold text-gray-600'>
                    {offer.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleWhatsAppClick}
            className='flex-shrink-0 bg-primary hover:bg-primary/90 rounded-full transition-all shadow-sm flex items-center gap-2 px-3 py-2'
            aria-label={t('contactWhatsApp')}
          >
            <MessageCircle className='w-4 h-4 text-white' />
            <span className='text-white text-xs font-medium'>{offer.contactPhone}</span>
          </button>
        </div>
      );
    };

    // Return
    return (
      <div
        ref={elementRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-primary hover:-translate-y-1 ${
          viewMode === 'list' ? 'flex flex-row' : ''
        } ${className}`}
      >
        {viewMode === 'grid' ? (
          <>
            <div onClick={handleCardClick} className='cursor-pointer contents'>
              {renderImageCarousel()}
              {renderContent()}
            </div>
            {renderFooter()}
          </>
        ) : (
          <>
            <div onClick={handleCardClick} className='cursor-pointer'>
              {renderImageCarousel()}
            </div>
            {/* Contenedor vertical para contenido + footer */}
            <div className='flex flex-col flex-1'>
              <div onClick={handleCardClick} className='cursor-pointer flex-1'>
                {renderContent()}
              </div>
              {renderFooter()}
            </div>
          </>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.offer._id === nextProps.offer._id &&
      prevProps.offer.status === nextProps.offer.status &&
      prevProps.viewMode === nextProps.viewMode &&
      prevProps.searchQuery === nextProps.searchQuery &&
      prevProps.readOnly === nextProps.readOnly &&
      prevProps.className === nextProps.className
      // No comparar onClick, onEdit, onDelete porque son memoizados en el padre
    );
  },
);

JobOfferCard.displayName = 'JobOfferCard';
