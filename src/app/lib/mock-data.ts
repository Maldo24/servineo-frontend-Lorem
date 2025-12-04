export interface JobOffer {
  id: string;
  fixerId: string;
  fixerName: string;
  fixerPhoto?: string;
  title: string;
  description: string;
  tags: string[];
  whatsapp: string;
  photos: string[];
  services: string[];
  price: number;
  createdAt: Date;
  city: string;
  rating?: number;
  completedJobs?: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Fixer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  photo?: string;
  city: string;
  rating?: number;
  completedJobs: number;
  services: string[];
  bio?: string;
  joinDate: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
  jobOffers: JobOffer[];
  paymentMethods: string[];
  whatsapp?: string;
  cancelledJobs?: number;
  monthlyData?: { month: string; completados: number; cancelados: number }[];
}

export type JobOfferBackend = {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  city: string;
  services: string[];
  photos: string[];
  price: number;
  fixerId: string;
  fixerName: string;
  whatsapp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: string;
  tags?: string[];
  fixerPhoto?: string;
  rating?: number;
  completedJobs?: number;
};

// Mock de ubicación del usuario
export const userLocation = {
  lat: -17.394,
  lng: -66.1474,
  address: 'UMSS, Cochabamba, Bolivia',
};

// Mock de servicios disponibles
export const availableServices = [
  'Plomería',
  'Electricidad',
  'Carpintería',
  'Pintura',
  'Albañilería',
  'Jardinería',
  'Limpieza',
  'Reparación de electrodomésticos',
  'Instalación de pisos',
  'Techado',
];

// Mock de FIXER actual (simulando usuario logueado)
export const currentFixer: Fixer = {
  id: 'fixer-001',
  name: 'Juan Carlos Pérez',
  email: 'juan.perez@example.com',
  phone: '59170341618',
  whatsapp: '59170341618',
  photo: '/img/avatars/fixer-001.jpg',
  city: 'Cochabamba',
  rating: 4.8,
  completedJobs: 124,
  services: ['Plomería', 'Electricidad', 'Carpintería'],
  bio: 'Soy un técnico con más de 5 años de experiencia en trabajos de electricidad y plomería. Me apasiona mi trabajo y siempre busco la satisfacción del cliente.',
  joinDate: '2022-01-15',
  jobOffers: [],
  paymentMethods: ['Efectivo', 'Transferencia', 'QR'],
};

// Mock de ofertas de trabajo
let _mockJobOffers: JobOffer[] = [
  {
    id: 'offer-001',
    fixerId: 'fixer-001',
    fixerName: 'Juan Carlos Pérez',
    fixerPhoto: '/img/avatars/fixer-001.jpg',
    title: 'Servicios de Plomería y Electricidad',
    description:
      'Especialista en reparaciones de plomería e instalaciones eléctricas. Soluciones rápidas y garantizadas.',
    tags: ['Plomería', 'Electricidad', 'Reparaciones'],
    whatsapp: '59170341618',
    photos: ['/img/carpinteria1.jpg', '/img/carpinteria2.jpg', '/img/carpinteria3.jpg'],
    services: ['Plomería', 'Electricidad'],
    price: 150,
    rating: 4.8,
    completedJobs: 124,
    createdAt: new Date('2025-01-15'),
    city: 'Cochabamba',
    location: {
      lat: -17.3935,
      lng: -66.1468,
      address: 'Av. Oquendo #234, Cochabamba',
    },
  },
  {
    id: 'offer-002',
    fixerId: 'fixer-001',
    fixerName: 'Juan Carlos Pérez',
    fixerPhoto: '/img/avatars/fixer-001.jpg',
    title: 'Servicios de Plomería y Electricidad',
    description:
      'Especialista en reparaciones de plomería e instalaciones eléctricas. Soluciones rápidas y garantizadas.',
    tags: ['Plomería', 'Electricidad', 'Reparaciones'],
    whatsapp: '59170341618',
    photos: ['/img/carpinteria1.jpg', '/img/carpinteria2.jpg', '/img/carpinteria3.jpg'],
    services: ['Plomería', 'Electricidad'],
    price: 150,
    rating: 4.8,
    completedJobs: 124,
    createdAt: new Date('2025-01-15'),
    city: 'Cochabamba',
    location: {
      lat: -17.3935,
      lng: -66.1468,
      address: 'Av. Oquendo #234, Cochabamba',
    },
  },
  {
    id: 'offer-003',
    fixerId: 'fixer-001',
    fixerName: 'Juan Carlos Pérez',
    fixerPhoto: '/img/avatars/fixer-001.jpg',
    title: 'Servicios de Plomería y Electricidad',
    description:
      'Especialista en reparaciones de plomería e instalaciones eléctricas. Soluciones rápidas y garantizadas.',
    tags: ['Plomería', 'Electricidad', 'Reparaciones'],
    whatsapp: '59170341618',
    photos: ['/img/carpinteria1.jpg', '/img/carpinteria2.jpg', '/img/carpinteria3.jpg'],
    services: ['Plomería', 'Electricidad'],
    price: 150,
    rating: 4.8,
    completedJobs: 124,
    createdAt: new Date('2025-01-15'),
    city: 'Cochabamba',
    location: {
      lat: -17.3935,
      lng: -66.1468,
      address: 'Av. Oquendo #234, Cochabamba',
    },
  },
  {
    id: 'offer-004',
    fixerId: 'fixer-001',
    fixerName: 'Juan Carlos Pérez',
    fixerPhoto: '/img/avatars/fixer-001.jpg',
    title: 'Servicios de Plomería y Electricidad',
    description:
      'Especialista en reparaciones de plomería e instalaciones eléctricas. Soluciones rápidas y garantizadas.',
    tags: ['Plomería', 'Electricidad', 'Reparaciones'],
    whatsapp: '59170341618',
    photos: ['/img/carpinteria1.jpg', '/img/carpinteria2.jpg', '/img/carpinteria3.jpg'],
    services: ['Plomería', 'Electricidad'],
    price: 150,
    rating: 4.8,
    completedJobs: 124,
    createdAt: new Date('2025-01-15'),
    city: 'Cochabamba',
    location: {
      lat: -17.3935,
      lng: -66.1468,
      address: 'Av. Oquendo #234, Cochabamba',
    },
  },
  {
    id: 'offer-005',
    fixerId: 'fixer-001',
    fixerName: 'Juan Carlos Pérez',
    fixerPhoto: '/img/avatars/fixer-001.jpg',
    title: 'Servicios de Plomería y Electricidad',
    description:
      'Especialista en reparaciones de plomería e instalaciones eléctricas. Soluciones rápidas y garantizadas.',
    tags: ['Plomería', 'Electricidad', 'Reparaciones'],
    whatsapp: '59170341618',
    photos: ['/img/carpinteria1.jpg', '/img/carpinteria2.jpg', '/img/carpinteria3.jpg'],
    services: ['Plomería', 'Electricidad'],
    price: 150,
    rating: 4.8,
    completedJobs: 124,
    createdAt: new Date('2025-01-15'),
    city: 'Cochabamba',
    location: {
      lat: -17.3935,
      lng: -66.1468,
      address: 'Av. Oquendo #234, Cochabamba',
    },
  },
  {
    id: 'offer-006',
    fixerId: 'fixer-001',
    fixerName: 'Juan Carlos Pérez',
    fixerPhoto: '/img/avatars/fixer-001.jpg',
    title: 'Servicios de Plomería y Electricidad',
    description:
      'Especialista en reparaciones de plomería e instalaciones eléctricas. Soluciones rápidas y garantizadas.',
    tags: ['Plomería', 'Electricidad', 'Reparaciones'],
    whatsapp: '59170341618',
    photos: ['/img/carpinteria1.jpg', '/img/carpinteria2.jpg', '/img/carpinteria3.jpg'],
    services: ['Plomería', 'Electricidad'],
    price: 150,
    rating: 4.8,
    completedJobs: 124,
    createdAt: new Date('2025-01-15'),
    city: 'Cochabamba',
    location: {
      lat: -17.3935,
      lng: -66.1468,
      address: 'Av. Oquendo #234, Cochabamba',
    },
  },
  {
    id: 'offer-007',
    fixerId: 'fixer-001',
    fixerName: 'Juan Carlos Pérez',
    fixerPhoto: '/img/avatars/fixer-001.jpg',
    title: 'Servicios de Plomería y Electricidad',
    description:
      'Especialista en reparaciones de plomería e instalaciones eléctricas. Soluciones rápidas y garantizadas.',
    tags: ['Plomería', 'Electricidad', 'Reparaciones'],
    whatsapp: '59170341618',
    photos: ['/img/carpinteria1.jpg', '/img/carpinteria2.jpg', '/img/carpinteria3.jpg'],
    services: ['Plomería', 'Electricidad'],
    price: 150,
    rating: 4.8,
    completedJobs: 124,
    createdAt: new Date('2025-01-15'),
    city: 'Cochabamba',
    location: {
      lat: -17.3935,
      lng: -66.1468,
      address: 'Av. Oquendo #234, Cochabamba',
    },
  },
  {
    id: 'offer-008',
    fixerId: 'fixer-001',
    fixerName: 'Juan Carlos Pérez',
    fixerPhoto: '/img/avatars/fixer-001.jpg',
    title: 'Servicios de Plomería y Electricidad',
    description:
      'Especialista en reparaciones de plomería e instalaciones eléctricas. Soluciones rápidas y garantizadas.',
    tags: ['Plomería', 'Electricidad', 'Reparaciones'],
    whatsapp: '59170341618',
    photos: ['/img/carpinteria1.jpg', '/img/carpinteria2.jpg', '/img/carpinteria3.jpg'],
    services: ['Plomería', 'Electricidad'],
    price: 150,
    rating: 4.8,
    completedJobs: 124,
    createdAt: new Date('2025-01-15'),
    city: 'Cochabamba',
    location: {
      lat: -17.3935,
      lng: -66.1468,
      address: 'Av. Oquendo #234, Cochabamba',
    },
  },
];

// Mock de fixers
export const mockFixers: Fixer[] = [
  {
    id: '68e87a9cdae3b73d8040102f',
    name: 'Juan Carlos Pérez',
    email: 'juan.perez@example.com',
    phone: '59170341618',
    whatsapp: '59170341618',
    photo: '/img/avatars/fixer-001.jpg',
    city: 'Cochabamba',
    rating: 4.8,
    completedJobs: 124,
    services: ['Plomería', 'Electricidad', 'Carpintería'],
    bio: 'Soy un técnico con más de 5 años de experiencia...',
    joinDate: '2022-01-15',
    paymentMethods: ['Efectivo', 'Transferencia', 'QR'],
    jobOffers: [
      {
        id: 'offer-001',
        fixerId: '68e87a9cdae3b73d8040102f',
        fixerName: 'Juan Carlos Pérez',
        fixerPhoto: '/img/avatars/fixer-001.jpg',
        title: 'Servicios de Plomería',
        description: 'Reparación de fugas y tuberías',
        price: 150,
        city: 'Cochabamba',
        photos: ['/img/plomeria1.jpg'],
        rating: 4.8,
        completedJobs: 124,
        tags: ['Plomería', 'Reparación', 'Urgente'],
        whatsapp: '59170341618',
        services: ['Plomería'],
        createdAt: new Date('2024-01-15'),
        location: {
          lat: -17.3935,
          lng: -66.1468,
          address: 'Cochabamba, Bolivia',
        },
      },
      {
        id: 'offer-002',
        fixerId: '68e87a9cdae3b73d8040102f',
        fixerName: 'Juan Carlos Pérez',
        fixerPhoto: '/img/avatars/fixer-001.jpg',
        title: 'Instalación Eléctrica',
        description: 'Instalación y reparación de circuitos eléctricos',
        price: 200,
        city: 'Cochabamba',
        photos: ['/img/electricidad1.jpg'],
        rating: 4.8,
        completedJobs: 124,
        tags: ['Electricidad', 'Instalación'],
        whatsapp: '59170341618',
        services: ['Electricidad'],
        createdAt: new Date('2024-01-10'),
        location: {
          lat: -17.3935,
          lng: -66.1468,
          address: 'Cochabamba, Bolivia',
        },
      },
    ],
  },
];

// Actualizar las ofertas de trabajo con datos de los fixers
_mockJobOffers = _mockJobOffers.map((offer) => {
  const fixer = mockFixers.find((f) => f.id === offer.fixerId);
  return {
    ...offer,
    fixerPhoto: fixer?.photo,
    rating: fixer?.rating,
    completedJobs: fixer?.completedJobs,
  };
});

// Funciones mock para manejar ofertas
export const mockJobOfferService = {
  getOffers: () => _mockJobOffers,

  addOffer: (offer: Omit<JobOffer, 'id' | 'createdAt'>) => {
    const newOffer: JobOffer = {
      ...offer,
      id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    _mockJobOffers = [newOffer, ..._mockJobOffers];
    return newOffer;
  },

  updateOffer: (offerId: string, updates: Partial<JobOffer>) => {
    _mockJobOffers = _mockJobOffers.map((o) => (o.id === offerId ? { ...o, ...updates } : o));
    return _mockJobOffers.find((o) => o.id === offerId);
  },

  deleteOffer: (offerId: string) => {
    _mockJobOffers = _mockJobOffers.filter((o) => o.id !== offerId);
  },

  getMyOffers: (fixerId: string) => {
    return _mockJobOffers.filter((o) => o.fixerId === fixerId);
  },
};

// Exportar también como mockJobOffers para compatibilidad
export const mockJobOffers = _mockJobOffers;
