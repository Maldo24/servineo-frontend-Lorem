// src/app/redux/services/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Force /api to use Next.js proxy
const API_URL = process.env.NEXT_PUBLIC_API_URL + '/api';

// Log para debugging (solo en desarrollo)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 API URL configurada:', API_URL);
}

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    //const token = localStorage.getItem('servineo_token');
    // if (token) {
    //   headers.set('authorization', `Bearer ${token}`);
    // }
    // //  headers.set('Content-Type', 'application/json');
    return headers;
  },
  credentials: 'include',
});

export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'status' in error && 'data' in error;
};

// Base API with no endpoints
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User',
    'Job',
    'Statistics',
    'JobOffer',
    'Requester',
    'SearchHistory',
    'Experience',
    'Portfolio',
    'Certification',
  ],
  endpoints: () => ({}),
});
