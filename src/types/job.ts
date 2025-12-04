export interface Job {
  _id: string;
  title: string;
  description: string;
  status: string;
  requesterId: string;
  fixerId: string;
  price: number;
  createdAt: string;
  rating?: number;
  comment?: string;
}

export interface JobDetails {
  title: string;
  date: string;
  rating: number;
  description: string;
  serviceType: string;
  comment: string;
  createdAt?: string;
  type?: string;
}
