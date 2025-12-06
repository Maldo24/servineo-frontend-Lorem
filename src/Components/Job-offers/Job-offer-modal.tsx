'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageCircle, MapPin, Sparkles, Calendar, Tag, Share2, Gift } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { JobOfferData, AdaptedJobOffer } from '@/types/jobOffers';
import JobRequestModal from '../../app/[locale]/job-request/ModalFormMap/JobRequestModal';
import { useSelector } from 'react-redux';
import { IUser } from '@/types/user';
import { useRouter } from 'next/navigation';
import { getPromotionsByOfferId } from '@/services/promotions';
import type { Promotion } from '@/types/promotion';

interface Props {
    offer: JobOfferData | AdaptedJobOffer | null;
    isOpen: boolean;
    onClose: () => void;
}

interface UserState {
    user: IUser | null;
    isAuthenticated: boolean;
    loading: boolean;
}
interface RootState {
    user: UserState;
}

export function JobOfferModal({ offer, isOpen, onClose }: Props) {
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
    const router = useRouter();

    //const t = useTranslations('cardJob');
    const tCat = useTranslations('Categories');
    const t = useTranslations('jobOfferModal');
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loadingPromos, setLoadingPromos] = useState(false);

    // Cargar promociones cuando se abre el modal
    useEffect(() => {
        if (!isOpen || !offer) return;

        const loadPromotions = async () => {
            try {
                setLoadingPromos(true);
                const offerId = (offer as JobOfferData)._id || (offer as AdaptedJobOffer)._id;
                const promos = await getPromotionsByOfferId(offerId);
                setPromotions(Array.isArray(promos) ? promos : []);
            } catch (error) {
                console.warn('Error loading promotions:', error);
                setPromotions([]);
            } finally {
                setLoadingPromos(false);
            }
        };

        loadPromotions();
    }, [isOpen, offer]);

    if (!isOpen || !offer) return null;

    // Type guard: AdaptedJobOffer (comes from backend shape that already has services)
    const isAdapted = (o: JobOfferData | AdaptedJobOffer): o is AdaptedJobOffer => {
        return 'services' in o && Array.isArray(o.services);
    };

    // Normalize common fields
    const title = offer.title ?? '';
    const description = offer.description ?? '';
    const price = isAdapted(offer) ? offer.price : ((offer as JobOfferData).price ?? 0);
    const city = offer.city ?? '';
    const createdAt = isAdapted(offer)
        ? offer.createdAt
        : ((offer as JobOfferData).createdAt ?? new Date());
    const category = isAdapted(offer)
        ? (offer.services?.[0] ?? 'General')
        : ((offer as JobOfferData).category ?? 'General');

    // phone/whatsapp normalization
    const phone = isAdapted(offer)
        ? (offer.phone ?? '')
        : ((offer as JobOfferData).contactPhone ?? '');
    const whatsappRaw = phone ?? '';
    const whatsappClean = (whatsappRaw || '').toString().replace(/\D/g, '');

    // Images collection
    const images: string[] = (() => {
        if (isAdapted(offer)) {
            return offer.photos ?? [];
        } else {
            const o = offer as JobOfferData;
            if (o.allImages && o.allImages.length > 0) return o.allImages;
            if (o.photos && o.photos.length > 0) return o.photos;
            if (o.imagenUrl) return [o.imagenUrl];
            return [];
        }
    })();

    // Services list (fallback to tags)
    const servicesList: string[] = isAdapted(offer)
        ? (offer.services ?? offer.tags ?? [])
        : ((offer as JobOfferData).tags ?? []);

    // Calendar click: set sessionStorage for scheduling flow
    const handleClickCalendar = () => {
        if (typeof window === 'undefined') return;
        const fixerId = isAdapted(offer) ? offer.fixerId : (offer as JobOfferData).fixerId;
        const requesterId = sessionStorage.getItem('requester_id') ?? '';
        sessionStorage.setItem('fixer_id', fixerId);
        sessionStorage.setItem('requester_id', requesterId);
        sessionStorage.setItem('roluser', 'requester');
    };

    const handleWhatsAppClick = () => {
        if (!whatsappClean) return;
        const url = `https://wa.me/${whatsappClean}`;
        window.open(url, '_blank');
    };

    const handleShare = () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        navigator.clipboard?.writeText(url);
    };

    const handleRequestJobClick = () => {
        if (!isAuthenticated) {
            router.push('/signUp');
            return;
        }
        if (user?.role === 'fixer') {
            return;
        }
        setIsMapModalOpen(true);
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div
                className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity'
                onClick={onClose}
            />

            <div className='relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200'>
                {/* Header Image Area */}
                <div className='relative h-48 sm:h-64 bg-gray-100 shrink-0'>
                    {images.length > 0 ? (
                        <Image src={images[0]} alt={title} fill className='object-cover' />
                    ) : (
                        <div className='w-full h-full flex items-center justify-center text-gray-400'>
                            <span className='text-lg font-medium'>{t('noImage')}</span>
                        </div>
                    )}

                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                    <button
                        onClick={onClose}
                        className='absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all'
                        aria-label={t('closeModal')}
                    >
                        <X className='w-5 h-5' />
                    </button>

                    <div className='absolute bottom-4 left-6 right-6 text-white'>
                        <div className='flex items-center gap-2 mb-2'>
                            <span className='px-2.5 py-1 bg-primary/90 rounded-full text-xs font-semibold backdrop-blur-sm'>
                                {tCat(category)}
                            </span>
                            <div className='flex items-center gap-1 text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm'>
                                <MapPin className='w-3 h-3' />
                                <span>{city}</span>
                            </div>
                        </div>

                        <h2 className='text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md'>{title}</h2>
                    </div>
                </div>

                {/* Content */}
                <div className='flex-1 overflow-y-auto p-6 space-y-6'>
                    {/* Price & Date */}
                    <div className='flex items-center justify-between pb-4 border-b border-gray-100'>
                        <div className='flex items-center gap-2 text-gray-500 text-sm'>
                            <Calendar className='w-4 h-4' />
                            <span>{new Date(createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className='text-xl font-bold text-primary'>{price?.toLocaleString()} Bs</div>
                    </div>

                    {/* Description */}
                    <div className='space-y-3'>
                        <div className='flex items-center gap-2 text-gray-900 font-semibold'>
                            <Sparkles className='w-4 h-4 text-amber-500' />
                            <h3>{t('description')}</h3>
                        </div>
                        <p className='text-gray-600 leading-relaxed text-sm sm:text-base'>{description}</p>
                    </div>

                    {/* Services / Tags */}
                    {servicesList && servicesList.length > 0 && (
                        <div className='space-y-3'>
                            <div className='flex items-center gap-2 text-gray-900 font-semibold'>
                                <Tag className='w-4 h-4 text-blue-500' />
                                <h3>{t('servicesOffered')}</h3>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {servicesList.map((s, i) => (
                                    <span
                                        key={i}
                                        className='px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium'
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gallery grid (if more images) */}
                    {images.length > 1 && (
                        <div className='space-y-3'>
                            <h3 className='font-semibold text-gray-900'>{t('gallery')}</h3>
                            <div className='grid grid-cols-2 gap-2'>
                                {images.slice(1).map((img, idx) => (
                                    <div
                                        key={idx}
                                        className='relative aspect-video rounded-lg overflow-hidden bg-gray-100'
                                    >
                                        <Image
                                            src={img}
                                            alt={`${t('gallery')} ${idx}`}
                                            fill
                                            className='object-cover hover:scale-105 transition-transform duration-500'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Promotions Section */}
                    {promotions.length > 0 && (
                        <div className='space-y-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200'>
                            <div className='flex items-center gap-2 text-gray-900 font-semibold'>
                                <Gift className='w-4 h-4 text-yellow-500' />
                                <h3>Promociones Disponibles</h3>
                                <span className='ml-auto text-xs bg-yellow-500 text-white px-2 py-1 rounded-full font-bold'>
                                    {promotions.length}
                                </span>
                            </div>
                            <div className='space-y-2'>
                                {promotions.map((promo) => (
                                    <div key={promo._id} className='bg-white p-3 rounded-lg border border-yellow-200'>
                                        <h4 className='font-semibold text-gray-900 text-sm'>{promo.title}</h4>
                                        <p className='text-gray-600 text-xs mt-1'>{promo.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact & Meta */}
                    <div className='pt-4 border-t border-border/50'>
                        <h3 className='font-bold text-lg mb-4'>{t('contactInfo')}</h3>
                        <div className='grid md:grid-cols-2 gap-3'>
                            <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-xl'>
                                <div className='w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg'>
                                    <MessageCircle className='w-5 h-5 text-white' />
                                </div>
                                <div>
                                    <p className='text-xs text-muted-foreground'>WhatsApp</p>
                                    <p className='font-semibold'>{whatsappClean || phone || '—'}</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-xl'>
                                <div className='w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg'>
                                    <MapPin className='w-5 h-5 text-white' />
                                </div>
                                <div>
                                    <p className='text-xs text-muted-foreground'>{t('city')}</p>
                                    <p className='font-semibold'>{city || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer actions */}
                <div className='p-4 border-t bg-gray-50 flex flex-col sm:flex-row gap-3'>
                    <button
                        onClick={handleWhatsAppClick}
                        disabled={!whatsappClean}
                        className={`flex-1 ${whatsappClean
                            ? 'bg-primary hover:bg-primary/90 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            } py-3 rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2 transition-all`}
                    >
                        <MessageCircle className='w-5 h-5' />
                        {t('contactWhatsApp')}
                    </button>

                    <Link
                        href='/calendar'
                        onClick={handleClickCalendar}
                        className='flex-1 bg-white border border-gray-200 text-gray-800 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-sm transition-all'
                    >
                        <Calendar className='w-5 h-5' />
                        {t('scheduleAppointment')}
                    </Link>

                    <button
                        onClick={handleShare}
                        className='p-3 rounded-lg bg-white border border-gray-200 hover:shadow-sm'
                        title={t('share')}
                    >
                        <Share2 className='w-5 h-5' />
                    </button>

                    {user?.role !== 'fixer' && (
                        <>
                            <button
                                onClick={handleRequestJobClick}
                                className='flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2'
                            >
                                Solicitar trabajo
                            </button>

                            {isAuthenticated && (
                                <JobRequestModal
                                    isOpen={isMapModalOpen}
                                    onClose={() => setIsMapModalOpen(false)}
                                    onSubmit={(data) => console.log('Solicitud enviada:', data)}
                                    fixerId={offer.fixerId}
                                    offerId={offer._id}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
