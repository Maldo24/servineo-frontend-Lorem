export interface IJobOffer {
  _id: string;
  fixerId: string;
  fixerName: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  price: number;
  city: string;
  contactPhone: string;
  photos: string[];
  rating?: number;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ICertification {
  _id?: string;
  fixerId: string;
  name: string;
  institution: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IExperience {
  _id?: string;
  fixerId: string;
  jobTitle: string;
  jobType: string;
  organization: string;
  isCurrent: boolean;
  startDate: string;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPortfolioItem {
  _id?: string;
  fixerId: string;
  type: 'image' | 'video';
  url?: string;
  youtubeUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
