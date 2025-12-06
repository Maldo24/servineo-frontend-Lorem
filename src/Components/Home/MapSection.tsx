'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import dinámico para Next.js (evitar SSR con mapas)
const Map = dynamic(() => import('@/app/Mapa/Map'), { ssr: false });

export default function MapSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className='w-full py-16 px-4 bg-gray-50 scroll-mt-24'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
            Encuentra Servicios Cerca de Ti
          </h2>
          <p className='text-gray-600 text-lg md:text-xl'>
            Conecta rápidamente con profesionales y servicios en tu zona
          </p>
        </div>

        {/* Contenedor del mapa */}
        <div
          id='titulo-seccion-mapa'
          className='h-[60vh] w-full bg-gray-100 rounded-xl overflow-visible relative shadow-sm border border-gray-200'
        >
          {isMounted && <Map />}
        </div>
      </div>
    </section>
  );
}
