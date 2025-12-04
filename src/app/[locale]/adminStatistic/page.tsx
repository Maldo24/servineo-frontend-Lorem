'use client';
import { useState, useEffect } from 'react';
import { ChartPieDonut } from '@/Components/Statistics-panel/Chart-pie-donut';
import { ChartBarLabel } from '@/Components/Statistics-panel/Chart-bar-Label';
import { useGetStatisticsQuery } from '@/app/redux/services/dashboardApi';

export default function Page() {
  const [selectedPeriod, setSelectedPeriod] = useState<'semanal' | 'mensual' | 'anual'>('mensual');

  // Usar el hook de Redux para obtener los datos
  const { data, error, isLoading, refetch } = useGetStatisticsQuery(selectedPeriod);

  // Refetch cuando cambie el período
  useEffect(() => {
    refetch();
  }, [selectedPeriod, refetch]);

  // Transformar los datos del backend al formato que esperan los componentes
  const transformFilterData = (filterData: Record<string, number> | undefined) => {
    if (!filterData) return [];
    return Object.entries(filterData).map(([name, value]) => ({
      name,
      value: value as number,
    }));
  };

  // Datos para los gráficos
  const monthlyData = data ? transformFilterData(data.filter_statistics?.fixer_name) : [];
  const tradesData = data ? transformFilterData(data.filter_statistics?.city) : [];
  const productsData = data ? transformFilterData(data.filter_statistics?.job_type) : [];
  const pieData = data ? transformFilterData(data.user_type_statistics) : [];

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center p-4'>
        <div className='text-lg'>Cargando estadísticas...</div>
      </main>
    );
  }

  // Mostrar error si hay algún problema
  if (error) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center p-4'>
        <div className='text-lg text-red-500'>Error al cargar las estadísticas</div>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-4'>
      {/* Contenedor del dropdown */}
      <div className='w-full max-w-4xl mb-6 flex justify-end'>
        <div className='relative'>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'semanal' | 'mensual' | 'anual')}
            className='appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='semanal'>Semanal</option>
            <option value='mensual'>Mensual</option>
            <option value='anual'>Anual</option>
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
            <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
            </svg>
          </div>
        </div>
      </div>

      {/* Información del período */}
      {data && (
        <div className='w-full max-w-4xl mb-4 text-center'>
          <h2 className='text-xl font-semibold'>
            Período:{' '}
            {selectedPeriod === 'semanal'
              ? 'Semanal'
              : selectedPeriod === 'mensual'
                ? 'Mensual'
                : 'Anual'}
          </h2>
          <p className='text-gray-600'>Total de búsquedas: {data.count}</p>
        </div>
      )}

      {/* Contenedor principal de gráficos */}
      <div className='w-full max-w-4xl space-y-6'>
        {/* Gráfico de donut para tipos de usuario */}
        {pieData.length > 0 && (
          <ChartPieDonut
            data={pieData}
            title='Distribución de usuarios'
            description='Tipos de usuarios que realizaron búsquedas'
          />
        )}

        {/* Gráfico de rangos de fixers */}
        {monthlyData.length > 0 && (
          <ChartBarLabel
            data={monthlyData}
            title='Rangos de nombres de fixers'
            description='Búsquedas por rango de letras del nombre'
            color='#2563eb'
            trendText='Estadísticas de este filtro'
            footerText='Mostrando búsquedas totales'
            barSize={90}
          />
        )}

        {/* Gráfico de ciudades */}
        {tradesData.length > 0 && (
          <ChartBarLabel
            data={tradesData}
            title='Ciudades'
            description='Búsquedas por ciudad'
            color='#10b981'
            trendText='Estadísticas de este filtro'
            footerText='Mostrando búsquedas totales'
            barSize={70}
          />
        )}

        {/* Gráfico de tipos de trabajo */}
        {productsData.length > 0 && (
          <ChartBarLabel
            data={productsData}
            title='Tipos de trabajo'
            description='Búsquedas por tipo de trabajo'
            color='#f59e0b'
            trendText='Estadísticas de este filtro'
            footerText='Mostrando búsquedas totales'
            barSize={70}
          />
        )}

        {/* Mensaje si no hay datos */}
        {!data && !isLoading && !error && (
          <div className='text-center text-gray-500'>
            No hay datos disponibles para el período seleccionado
          </div>
        )}
      </div>
    </main>
  );
}
