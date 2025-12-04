import { baseApi } from './baseApi';

export interface SearchData {
  user_type: string;
  search_query: string;
  search_type: string;
  filters: {
    [x: string]: {
      fixer_name: string;
      city: string;
      job_type: string;
      search_count: number;
    };
  };
}

export interface FilterData {
  filters: {
    fixer_name: string;
    city: string;
    job_type: string;
    search_count: number;
  };
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logSearch: builder.mutation<void, SearchData>({
      query: (searchData) => ({
        url: '/searches',
        method: 'POST',
        body: searchData,
      }),
      invalidatesTags: ['Requester'],
    }),
    updateFilters: builder.mutation<void, FilterData>({
      query: (filterData) => ({
        url: '/searches',
        method: 'PATCH',
        body: filterData,
      }),
      invalidatesTags: ['Requester'],
    }),
  }),
});

export const { useLogSearchMutation, useUpdateFiltersMutation } = searchApi;
