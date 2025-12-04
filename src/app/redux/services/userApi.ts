// refactorizar  las rutas

import { baseApi } from './baseApi';
import type { IUserProfile } from '@/types/job-offer';
import type { IUser } from '@/types/user';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserProfile: builder.mutation<IUserProfile, IUserProfile>({
      query: (body) => ({
        url: '/user-profiles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    getUserProfiles: builder.query<IUserProfile[], void>({
      query: () => '/user-profiles',
      providesTags: ['User'],
    }),
    updateDescription: builder.mutation<IUser, { id: string; description: string }>({
      query: ({ id, description }) => ({
        url: `/user/${id}/description`,
        method: 'POST',
        body: { description },
      }),
      invalidatesTags: ['User'],
    }),

    getUsersByRole: builder.query<IUserProfile[], string>({
      query: (role) => `/user-profiles/role/${role}`,
      providesTags: ['User'],
    }),

    convertToFixer: builder.mutation<
      IUserProfile,
      { id: string; profile: IUserProfile['profile'] }
    >({
      query: ({ id, profile }) => ({
        url: `/user-profiles/${id}/convert-fixer`,
        method: 'PATCH',
        body: { profile },
      }),
      invalidatesTags: ['User'],
    }),

    getUserById: builder.query<IUser, string>({
      query: (id) => `/user/${id}`,
      providesTags: ['User'],
    }),
    updateLocation: builder.mutation<
      { success: boolean; user: IUser },
      {
        id: string;
        location: {
          lat: number;
          lng: number;
          direccion?: string;
        };
      }
    >({
      query: ({ id, location }) => ({
        url: `/user/${id}/location`,
        method: 'PATCH',
        body: { workLocation: location },
      }),
      invalidatesTags: ['User'],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateUserProfileMutation,
  useGetUserProfilesQuery,
  useUpdateDescriptionMutation,
  useGetUsersByRoleQuery,
  useConvertToFixerMutation,
  useLazyGetUserByIdQuery,
  useGetUserByIdQuery,
  useUpdateLocationMutation,
} = userApi;
