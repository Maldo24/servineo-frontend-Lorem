export interface IUserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'fixer' | 'requester';
    urlPhoto?: string;
  };
  profile: {
    ci: string;
    photoUrl?: string;
    location?: {
      lat: number;
      lng: number;
      address?: string;
    } | null;
    services: Array<{
      id: string;
      name: string;
      custom?: boolean;
    }>;
    selectedServiceIds: string[];
    paymentMethods: Array<{
      type: string;
      accountInfo?: string;
    }>;
    experiences: Array<{
      id: string;
      title: string;
      description: string;
      years: number;
      images?: Array<{
        id: string;
        url: string;
        name: string;
        size: number;
        type: string;
      }>;
    }>;
    vehicle?: {
      hasVehicle?: boolean;
      type?: string;
      details?: string;
    };
    terms: {
      accepted: boolean;
      acceptedAt?: Date;
    };
    additionalInfo?: {
      bio?: string;
      languages?: string[];
      availability?: {
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
      };
      hourlyRate?: number;
    };
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}
