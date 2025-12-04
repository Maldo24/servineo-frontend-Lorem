// esto ya no se utilizara
import { baseApi } from './baseApi';

export interface JobOfferLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface JobOffer {
  _id?: string;
  id?: string;
  fixerId: string;
  fixerName: string;
  title?: string;
  description: string;
  services: string[];
  whatsapp: string;
  price: number;
  city: string;
  createdAt?: Date;
  photos?: string[];
  location?: JobOfferLocation;
  tags?: string[];
  rating?: number;
  completedJobs?: number;
  fixerPhoto?: string;
}

export interface CreateJobOfferInput {
  fixerId: string;
  fixerName: string;
  title?: string;
  description: string;
  services: string[];
  whatsapp: string;
  price: number;
  city: string;
  photos?: string[];
  location?: JobOfferLocation;
}

export interface JobOfferResponse {
  id: string;
  message: string;
}

export const jobOfferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener todas las ofertas
    getAllJobOffers: builder.query<JobOffer[], void>({
      query: () => '/newOffers',
      providesTags: ['JobOffer'],
    }),

    // Obtener ofertas por fixerId
    getJobOffersByFixer: builder.query<JobOffer[], string>({
      query: (fixerId) => `/newOffers/fixer/${fixerId}`,
      providesTags: ['JobOffer'],
    }),

    // Crear una nueva oferta
    createJobOffer: builder.mutation<JobOfferResponse, CreateJobOfferInput>({
      query: (body) => ({
        url: '/newOffers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['JobOffer'],
    }),

    // Actualizar una oferta
    updateJobOffer: builder.mutation<
      JobOffer,
      { offerId: string; data: Partial<CreateJobOfferInput> }
    >({
      query: ({ offerId, data }) => ({
        url: `/newOffers/${offerId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['JobOffer'],
    }),

    // Eliminar una oferta
    deleteJobOffer: builder.mutation<{ message: string }, string>({
      query: (offerId) => ({
        url: `/newOffers/${offerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['JobOffer'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllJobOffersQuery,
  useGetJobOffersByFixerQuery,
  useCreateJobOfferMutation,
  useUpdateJobOfferMutation,
  useDeleteJobOfferMutation,
} = jobOfferApi;
