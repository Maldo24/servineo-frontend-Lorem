'use client';
import dynamic from 'next/dynamic';

const MapaLeaflet = dynamic(() => import('@/Components/requester/mapas/Mapa'), { ssr: false });

export default function PageUbicacion() {
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <MapaLeaflet />
    </div>
  );
}
