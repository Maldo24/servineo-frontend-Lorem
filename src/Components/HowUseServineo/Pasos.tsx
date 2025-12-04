'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PasoCards } from './PasoCards';

const subtitle =
  'Encuentra el fixer que tenga las habilidades que necesitas,\npuedes empezar con estos pasos';

const pasos = [
  {
    number: 1,
    title: 'Navega y busca',
    imageUrl: '/es/img/imgHowUseServineo/navegarYBuscar.jpg',
    descripcion:
      'Explora nuestros servicios utilizando la barra de búsqueda, filtros por categorías y palabras claves para encontrar lo que buscas.',
  },
  {
    number: 2,
    title: 'Contacta',
    imageUrl: '/es/img/imgHowUseServineo/contacta.jpg',
    descripcion:
      'Comunícate con el fixer directamente mediante su número telefónico para poder saber más sobre el servicio o coordinar el trabajo.',
  },
  {
    number: 3,
    title: 'Coordina tu servicio',
    imageUrl: '/es/img/imgHowUseServineo/coordinar.jpg',
    descripcion:
      'Coordina con tu fixer para que el servicio sea lo que tu busca y elige una oferta antes de enviar los datos necesitados por el fixer.',
  },
  {
    number: 4,
    title: 'Aprueba y contacta',
    imageUrl: '/es/img/imgHowUseServineo/contrata.jpg',
    descripcion: 'Recibe el servicio y deja tus comentarios sobre la calidad del servicio.',
  },
];

export const Pasos = () => {
  const router = useRouter();

  const handleVerServicios = () => {
    router.push('/servicios');
  };

  return (
    <div className='flex flex-col items-center gap-[40px] ml-[30px] mr-[30px] my-8 p-8 bg-white rounded-2xl shadow-2xl'>
      <div className='flex flex-col items-center gap-[25px]'>
        <h1 className='text-center text-[35px]'> Sigue estos pasos para contratar </h1>
        <p className='text-center text-black opacity-[60%] text-[18px] whitespace-pre-line'>
          {' '}
          {subtitle}{' '}
        </p>
      </div>

      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'>
        {pasos.map((item, index) => (
          <PasoCards
            key={index}
            number={item.number}
            imageUrl={item.imageUrl}
            title={item.title}
            descripcion={item.descripcion}
          />
        ))}
      </div>

      <div>
        <button
          className='cursor-pointer gap-[3px] bg-[#2B6EA0] hover:bg-[#2B31E0] duration-150 text-white h-9 w-40 rounded-[8px]'
          onClick={handleVerServicios}
        >
          Ver servicios
        </button>
      </div>
    </div>
  );
};
