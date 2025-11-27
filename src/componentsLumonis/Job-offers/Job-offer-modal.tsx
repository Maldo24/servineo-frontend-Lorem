'use client';

import { X, MessageCircle, MapPin, Sparkles, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { JobOfferData, AdaptedJobOffer } from '@/types/jobOffers';

interface Props {
  offer: JobOfferData | AdaptedJobOffer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobOfferModal({ offer, isOpen, onClose }: Props) {
  //const t = useTranslations('cardJob');
  const tCat = useTranslations('Categories');

  if (!isOpen || !offer) return null;

  // Normalize data
  const isAdapted = (o: JobOfferData | AdaptedJobOffer): o is AdaptedJobOffer => 'services' in o;

  const title = offer.title;
  const description = offer.description;
  const price = offer.price;
  const city = offer.city;
  const tags = offer.tags || [];
  const createdAt = offer.createdAt;

  const category = isAdapted(offer)
    ? (offer.services?.[0] || 'General')
    : offer.category;

  const phone = isAdapted(offer)
    ? offer.phone
    : offer.contactPhone;

  // Prepare images
  const images = (() => {
    if (isAdapted(offer)) {
      return offer.photos || [];
    } else {
      if (offer.allImages && offer.allImages.length > 0) return offer.allImages;
      if (offer.photos && offer.photos.length > 0) return offer.photos;
      if (offer.imagenUrl) return [offer.imagenUrl];
      return [];
    }
  })();

  const handleWhatsAppClick = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

        {/* Header Image Area */}
        <div className="relative h-48 sm:h-64 bg-gray-100 shrink-0">
          {images.length > 0 ? (
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-lg font-medium">No image available</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-primary/90 rounded-full text-xs font-semibold backdrop-blur-sm">
                {tCat(category)}
              </span>
              <div className="flex items-center gap-1 text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                <MapPin className="w-3 h-3" />
                {city}
              </div>
            </div>
            <h2 className="text-2xl font-bold leading-tight shadow-black drop-shadow-md">
              {title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Price & Date */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-xl font-bold text-primary">
              {price?.toLocaleString()} Bs
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3>Descripción del Trabajo</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {description}
            </p>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <Tag className="w-4 h-4 text-blue-500" />
                <h3>Etiquetas</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Grid (if more than 1 image) */}
          {images.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Galería</h3>
              <div className="grid grid-cols-2 gap-2">
                {images.slice(1).map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={img}
                      alt={`Gallery ${idx}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50/50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Contactar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}