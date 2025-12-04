import { baseApi } from './baseApi';
import { IJobOffer } from '@/types/fixer-profile';

interface ApiResponse {
  data: IJobOffer[];
  count: number;
  success?: boolean;
}

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener todas las ofertas
    getAllJobs: builder.query<IJobOffer[], void>({
      query: () => '/job-offers',
      providesTags: ['Job'],
    }),

    // Obtener ofertas por fixerId
    getJobsByFixer: builder.query<IJobOffer[], string>({
      query: (fixerId) => `/job-offers/fixer/${fixerId}`,
      transformResponse: (response: ApiResponse) => response.data,
      providesTags: ['Job'],
    }),

    // Crear oferta
    createJob: builder.mutation<IJobOffer, FormData>({
      query: (formData) => ({
        url: '/job-offers',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Job'],
    }),

    // Actualizar oferta
    updateJob: builder.mutation<IJobOffer, { jobId: string; formData: Partial<FormData> }>({
      query: ({ jobId, formData }) => ({
        url: `/job-offers/${jobId}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Job'],
    }),

    // Eliminar oferta
    deleteJob: builder.mutation<{ message: string }, { jobId: string; fixerId: string }>({
      query: ({ jobId, fixerId }) => ({
        url: `/job-offers/${jobId}`,
        method: 'DELETE',
        body: { fixerId },
      }),
      invalidatesTags: ['Job'],
    }),

    //Activar / Desactivar oferta
    toggleJobStatus: builder.mutation<IJobOffer, { jobId: string }>({
      query: ({ jobId }) => ({
        url: `/job-offers/${jobId}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Job'],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllJobsQuery,
  useGetJobsByFixerQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useToggleJobStatusMutation,
} = jobApi;
