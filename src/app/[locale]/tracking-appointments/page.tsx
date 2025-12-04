'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import {
  useGetMapLocationsQuery,
  useGetTrackingMetricsQuery,
  useGetFixerStatsQuery,
} from '@/app/redux/services/trackingAppointmentsApi';

import FixerStatsTable from '@/Components/Statistics-panel/fixer-stats-table';
import MetricsCards from '@/Components/Statistics-panel/metrics-cards';

// 1. Definimos la interfaz de lo que viene de la API
interface ApiAppointment {
  _id: string;
  lat: string | number;
  lon: string | number;
  fixerName?: string;
  requesterName?: string;
  current_requester_name?: string;
  date?: string;
  starting_time?: string;
  status?: string;
  schedule_state?: string;
}

// 2. Definimos la interfaz de lo que usa el Mapa (debe coincidir con admin-map)
interface MappedAppointment {
  id: string;
  fixerName: string;
  requesterName: string;
  date: string;
  status: string;
  lat: number;
  lng: number;
  service: string;
}

// Importación dinámica correcta (esto asegura que Leaflet no rompa el SSR)
const AdminMap = dynamic(() => import('@/Components/Statistics-panel/admin-map'), {
  ssr: false,
  loading: () => (
    <div className='h-full w-full bg-gray-100 flex items-center justify-center text-gray-500 animate-pulse'>
      Cargando Mapa...
    </div>
  ),
});

const StatisticsPage: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: metrics = { total: 0, active: 0, cancelled: 0 } } = useGetTrackingMetricsQuery({
    startDate,
    endDate,
  });

  const { data: rawMapData = [], isLoading: loadingMap } = useGetMapLocationsQuery();

  const { data: fixerStats = [] } = useGetFixerStatsQuery();

  const filteredAppointments = React.useMemo(() => {
    if (!rawMapData) return [];

    return (
      (rawMapData as ApiAppointment[]) // Aseguramos el tipo de entrada
        .map(
          (app): MappedAppointment => ({
            id: app._id,
            fixerName: app.fixerName || 'Desconocido',
            requesterName: app.requesterName || app.current_requester_name || 'Cliente',
            date: app.date || app.starting_time || '',
            status: app.status || app.schedule_state || 'unknown',
            lat: Number(app.lat),
            lng: Number(app.lon),
            service: '',
          }),
        )
        // Ahora 'app' ya es de tipo MappedAppointment, así que TS sabe que lat y lng son números
        .filter((app) => !isNaN(app.lat) && !isNaN(app.lng))
        // Filtro de fechas
        .filter((app) => {
          if (!startDate || !endDate) return true;
          const appointmentDate = new Date(app.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59);
          return appointmentDate >= start && appointmentDate <= end;
        })
    );
  }, [rawMapData, startDate, endDate]);

  return (
    <div className='w-full min-h-screen bg-gray-50 pb-10'>
      <div className='max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8'>
        {/* 1. ENCABEZADO Y FILTROS */}
        <div className='bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-800'>Tracking de Citas</h1>
            <p className='text-gray-500 text-sm'>Monitoreo de actividad y cobertura geográfica</p>
          </div>

          <div className='flex flex-wrap gap-3 items-end'>
            <div>
              <label className='text-xs text-gray-500 block mb-1 font-medium'>Desde</label>
              <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='text-xs text-gray-500 block mb-1 font-medium'>Hasta</label>
              <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>

        {/* 2. FILA SUPERIOR: MAPA (75%) + MÉTRICAS (25%) */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 lg:h-[550px]'>
          {/* MAPA */}
          <div className='lg:col-span-3 bg-white rounded-xl shadow border border-gray-200 overflow-hidden relative z-0 h-[400px] lg:h-full'>
            {loadingMap ? (
              <div className='h-full w-full flex items-center justify-center text-gray-500'>
                Cargando datos...
              </div>
            ) : filteredAppointments.length > 0 ? (
              <AdminMap appointments={filteredAppointments} />
            ) : (
              <div className='h-full w-full flex flex-col items-center justify-center text-gray-400'>
                <p>No hay citas geolocalizadas</p>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: MÉTRICAS */}
          <div className='lg:col-span-1 h-full flex flex-col gap-6'>
            <div className='shrink-0'>
              <MetricsCards metrics={metrics} />
            </div>
          </div>
        </div>

        <div className='w-full'>
          <FixerStatsTable stats={fixerStats} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
