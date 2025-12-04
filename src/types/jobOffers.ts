export interface JobOfferData {
  _id: string;
  fixerId: string;
  fixerName: string;
  fixerPhoto?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  city: string;
  contactPhone: string;
  createdAt: string | Date;
  rating?: number;
  photos?: string[];
  imagenUrl?: string;
  allImages?: string[];
  completedJobs?: number;
  location?: string[];
  status?: boolean;
  updatedAt?: string | Date;
}

/**
 * Tipo adaptado para el modal de ofertas
 */
export interface AdaptedJobOffer {
  _id: string;
  fixerId: string;
  name: string;
  title: string;
  description: string;
  tags: string[];
  phone: string;
  photos: string[];
  services: string[];
  price: number;
  createdAt: Date;
  city: string;
}

/**
 * Utilidad para adaptar datos del backend al formato del modal
 */
export const adaptOfferToModalFormat = (offer: JobOfferData): AdaptedJobOffer | null => {
  if (!offer) return null;

  let photos: string[] = [];
  if (offer.photos && offer.photos.length > 0) {
    photos = offer.photos;
  } else if (offer.imagenUrl) {
    photos = [offer.imagenUrl];
  }

  return {
    _id: offer._id,
    fixerId: offer.fixerId,
    name: offer.fixerName,
    title: offer.title,
    description: offer.description,
    tags: offer.tags || [],
    phone: offer.contactPhone,
    photos: photos,
    services: offer.category ? [offer.category] : [],
    price: offer.price,
    createdAt: new Date(offer.createdAt || Date.now()),
    city: offer.city,
  };
};

/**
 * Utilidad para preparar imágenes de una oferta
 */
export const prepareOfferImages = (offer: JobOfferData): string[] => {
  if (offer.allImages && offer.allImages.length > 0) {
    return offer.allImages;
  }
  if (offer.photos && offer.photos.length > 0) {
    return offer.photos;
  }
  if (offer.imagenUrl) {
    return [offer.imagenUrl];
  }
  return [];
};
