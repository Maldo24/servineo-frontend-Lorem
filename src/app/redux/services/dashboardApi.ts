// redux/DashboardApi.ts
import { baseApi } from './baseApi';

export interface SearchDataItem {
  [key: string]: unknown;
}

export interface StatisticsResponse {
  success: boolean;
  count: number;
  period: string;
  start_date: string;
  end_date: string;
  data: SearchDataItem[];
  filter_statistics: {
    fixer_name: {
      'A-C': number;
      'D-F': number;
      'G-I': number;
      'J-L': number;
      'M-N': number;
      'O-Q': number;
      'R-T': number;
      'U-W': number;
      'X-Z': number;
    };
    city: {
      Cochabamba: number;
      'La Paz': number;
      'Santa Cruz': number;
      Pando: number;
      Potosi: number;
      Sucre: number;
      Beni: number;
      Oruro: number;
      Tarija: number;
    };
    job_type: {
      Carpintero: number;
      Electricista: number;
      Plomeria: number;
      Albañil: number;
      Mecanico: number;
      Jardinero: number;
      Fontanero: number;
      Pintor: number;
      Cerrajero: number;
      Decorador: number;
    };
  };
  user_type_statistics: {
    visitor: number;
    requester: number;
    fixer: number;
  };
}

export const statisticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStatistics: builder.query<StatisticsResponse, 'semanal' | 'mensual' | 'anual'>({
      query: (period) => {
        const routes = {
          semanal: '/searches/semanal',
          mensual: '/searches/month',
          anual: '/searches/year',
        };
        return {
          url: routes[period],
          method: 'GET',
        };
      },
      providesTags: ['Statistics'],
    }),
  }),
});

export const { useGetStatisticsQuery } = statisticsApi;
