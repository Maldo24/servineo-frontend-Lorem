import { baseApi } from './baseApi';
import type { ICertification } from '@/types/fixer-profile';

// Interfaces de respuesta del Backend
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

export const certificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE: POST /api/certifications
    createCertification: builder.mutation<ICertification, Partial<ICertification>>({
      query: (body) => ({
        url: '/certifications',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<ICertification>) => response.data,
      // Invalidamos la lista para que se refresque al crear una nueva
      invalidatesTags: [{ type: 'Certification', id: 'LIST' }],
    }),

    // GET BY FIXER: GET /api/certifications/fixer/:fixerId
    getCertificationsByFixer: builder.query<ICertification[], string>({
      query: (fixerId) => `/certifications/fixer/${fixerId}`,
      transformResponse: (response: ApiResponse<ICertification[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Certification' as const, id: _id })),
              { type: 'Certification', id: 'LIST' },
            ]
          : [{ type: 'Certification', id: 'LIST' }],
    }),

    // GET BY ID: GET /api/certifications/:id
    getCertificationById: builder.query<ICertification, string>({
      query: (id) => `/certifications/${id}`,
      transformResponse: (response: ApiResponse<ICertification>) => response.data,
      providesTags: (result, error, id) => [{ type: 'Certification', id }],
    }),

    // UPDATE: PUT /api/certifications/:id
    updateCertification: builder.mutation<
      ICertification,
      { id: string; data: Partial<ICertification> }
    >({
      query: ({ id, data }) => ({
        url: `/certifications/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<ICertification>) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: 'Certification', id },
        { type: 'Certification', id: 'LIST' },
      ],
    }),

    // ✅ DELETE CORREGIDO:
    // Ya no pide userId en el body, solo el id en la URL.
    deleteCertification: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/certifications/${id}`,
        method: 'DELETE',
        // No se envía body
      }),
      transformResponse: (response: DeleteResponse) => ({ message: response.message }),
      invalidatesTags: (result, error, id) => [
        { type: 'Certification', id },
        { type: 'Certification', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCertificationMutation,
  useGetCertificationsByFixerQuery,
  useGetCertificationByIdQuery,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,
  useLazyGetCertificationsByFixerQuery,
  useLazyGetCertificationByIdQuery,
} = certificationApi;
