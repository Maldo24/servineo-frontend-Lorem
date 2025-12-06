'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export type Service = {
  name: string;
  icon: string;
  description: string;
  demand: number;
  slug: string;
  image?: string;
};

export const services: Service[] = [
  {
    name: 'Plomería',
    icon: '🔧',
    description: 'Instalaciones, reparaciones y mantenimiento',
    demand: 95,
    slug: 'plomeria',
    image: '/Plomeria.webp',
  },
  {
    name: 'Electricidad',
    icon: '⚡',
    description: 'Instalaciones eléctricas y reparaciones',
    demand: 90,
    slug: 'electricidad',
    image: '/Electricistas.webp',
  },
  {
    name: 'Carpintería',
    icon: '🔨',
    description: 'Muebles, puertas y trabajos en madera',
    demand: 85,
    slug: 'carpinteria',
    image: '/Carpinteria.webp',
  },
  {
    name: 'Pintura',
    icon: '🎨',
    description: 'Pintura interior y exterior',
    demand: 80,
    slug: 'pintura',
    image: '/Pintura.webp',
  },
  {
    name: 'Limpieza',
    icon: '🧽',
    description: 'Limpieza residencial y comercial',
    demand: 88,
    slug: 'limpieza',
    image: '/Limpieza.webp',
  },
  {
    name: 'Jardinería',
    icon: '🌱',
    description: 'Mantenimiento y diseño de jardines',
    demand: 75,
    slug: 'jardineria',
    image: '/Jardineria.png',
  },
  {
    name: 'Albañilería',
    icon: '🧱',
    description: 'Construcción y reparaciones de albañilería',
    demand: 82,
    slug: 'albanileria',
    image: '/Albañileria.png',
  },
  {
    name: 'Cerrajería',
    icon: '🔑',
    description: 'Apertura de puertas y cambio de cerraduras',
    demand: 78,
    slug: 'cerrajeria',
    image: '/Cerrajeria.png',
  },
  {
    name: 'Gasfitería',
    icon: '💧',
    description: 'Instalación y reparación de tuberías de gas',
    demand: 70,
    slug: 'gasfiteria',
    image: '/Gasfiteria.png',
  },
  {
    name: 'Vidriería',
    icon: '🪟',
    description: 'Instalación y reparación de vidrios',
    demand: 72,
    slug: 'vidrieria',
    image: '/Vidrieria.png',
  },
  {
    name: 'Soldadura',
    icon: '🛠️',
    description: 'Trabajos de soldadura y metal',
    demand: 76,
    slug: 'soldadura',
    image: '/Soldadura.png',
  },
  {
    name: 'Mecánica',
    icon: '🚗',
    description: 'Mecánica ligera y mantenimiento',
    demand: 76,
    slug: 'mecanica',
    image: '/Mecanica.png',
  },
  {
    name: 'Refrigeración',
    icon: '❄️',
    description: 'Instalación y reparación de aire acondicionado',
    demand: 74,
    slug: 'refrigeracion',
    image: '/Refrigeracion.png',
  },
  {
    name: 'Techos y Cubiertas',
    icon: '🏠',
    description: 'Instalación y mantenimiento de techos',
    demand: 68,
    slug: 'techos',
    image: '/Techos y Cubiertas.png',
  },
  {
    name: 'Tapicería',
    icon: '🪑',
    description: 'Tapizado y restauración de muebles',
    demand: 66,
    slug: 'tapiceria',
    image: '/Tapiceria.png',
  },
  {
    name: 'Instalación CCTV',
    icon: '📷',
    description: 'Instalación y configuración de cámaras de seguridad',
    demand: 73,
    slug: 'cctv',
    image: '/Instalacion CCTV.png',
  },
  {
    name: 'Piscinas',
    icon: '🏊',
    description: 'Mantenimiento y limpieza de piscinas',
    demand: 65,
    slug: 'piscinas',
    image: '/Picsina.png',
  },
  {
    name: 'Mudanzas',
    icon: '🚚',
    description: 'Transporte y mudanza de bienes',
    demand: 77,
    slug: 'mudanzas',
    image: '/Mudanzas.png',
  },
  {
    name: 'Fumigación',
    icon: '🦟',
    description: 'Control de plagas y fumigación',
    demand: 69,
    slug: 'fumigacion',
    image: '/Fumigacion.png',
  },
  {
    name: 'Calefacción',
    icon: '🔥',
    description: 'Instalación y reparación de calefacción',
    demand: 71,
    slug: 'calefaccion',
    image: '/Calefaccion.png',
  },
  {
    name: 'Paneles Solares',
    icon: '☀️',
    description: 'Instalación de sistemas solares',
    demand: 67,
    slug: 'paneles-solares',
    image: '/Paneles Solares.png',
  },
  {
    name: 'Impermeabilización',
    icon: '💦',
    description: 'Sellado y protección contra humedad',
    demand: 64,
    slug: 'impermeabilizacion',
    image: '/Impermeablilizacion.png',
  },
  {
    name: 'Domótica',
    icon: '🏡',
    description: 'Automatización del hogar y smart devices',
    demand: 62,
    slug: 'domotica',
    image: '/Domotica.png',
  },
  {
    name: 'Lavado de alfombras',
    icon: '🧼',
    description: 'Lavado profundo y desinfección de alfombras',
    demand: 60,
    slug: 'lavado-alfombras',
    image: '/Lavado de alfombras.png',
  },
];

export default function ServicesSection({
  showHero = true,
  showAllServices = true,
  showCTA = true,
  title,
  subtitle,
}: {
  showHero?: boolean;
  showAllServices?: boolean;
  showCTA?: boolean;
  title?: string;
  subtitle?: string;
}) {
  const servicesToShow = showAllServices ? services : services.slice(0, 6);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCardKey = (e: React.KeyboardEvent<HTMLDivElement>, idx: number, slug: string) => {
    const cards = document.querySelectorAll('[data-service-card="true"]');
    const last = cards.length - 1;
    let target = idx;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        target = Math.min(idx + 1, last);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        target = Math.max(idx - 1, 0);
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = last;
        break;
      case 'Enter':
      case ' ':
        router.push(`/servicios/${slug}`);
        e.preventDefault();
        return;
      default:
        return;
    }

    setActiveIndex(target);
    (cards[target] as HTMLElement)?.focus();
    e.preventDefault();
  };

  return (
    <div className={showHero ? 'min-h-screen bg-white pt-16' : 'bg-white'}>
      {showHero && (
        <section
          id='tour-services-hero'
          className='w-full py-16 px-4 bg-gradient-to-b from-blue-600 to-blue-800 text-white'
        >
          <div className='max-w-7xl mx-auto text-center'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6'>
              {title || 'Servicios disponibles'}
            </h1>
            <p className='text-lg md:text-xl mb-12 max-w-3xl mx-auto opacity-90'>
              {subtitle || 'Encuentra el profesional perfecto para cualquier trabajo en tu hogar'}
            </p>
          </div>
        </section>
      )}

      <section id='tour-services-section' className='w-full py-16 px-4'>
        <div className='max-w-7xl mx-auto'>
          {!showHero && title && (
            <div className='text-center mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>{title}</h2>
              {subtitle && <p className='text-lg text-gray-600 max-w-2xl mx-auto'>{subtitle}</p>}
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' role='grid'>
            {servicesToShow.map((service, index) => (
              <div
                key={index}
                tabIndex={activeIndex === index ? 0 : -1}
                role='button'
                aria-label={`Abrir detalles del servicio ${service.name}`}
                data-service-card='true'
                onKeyDown={(e) => handleCardKey(e, index, service.slug)}
                onClick={() => router.push(`/servicios/${service.slug}`)}
                onFocus={() => setActiveIndex(index)}
                className='select-none bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 cursor-pointer'
              >
                <div className='flex items-start justify-between mb-6'>
                  <div className='text-5xl'>{service.icon}</div>
                </div>
                <h3 className='text-2xl font-bold text-gray-800 mb-3'>{service.name}</h3>
                <p className='text-gray-600 mb-6 leading-relaxed'>{service.description}</p>

                <div className='mb-6'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm font-medium text-gray-700'>
                      {service.demand}% de demanda
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full transition-all duration-500'
                      style={{ width: `${service.demand}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!showAllServices && (
            <div className='flex justify-center mt-12'>
              <Link
                href='/servicios'
                className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg'
              >
                Ver más
              </Link>
            </div>
          )}
        </div>
      </section>

      {showCTA && (
        <section className='w-full py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700'>
          <div className='max-w-4xl mx-auto text-center text-white'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>¿No encuentras lo que buscas?</h2>
            <p className='text-lg md:text-xl mb-8 opacity-90'>
              Contáctanos y te ayudamos a encontrar el profesional perfecto para tu proyecto
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'>
                Solicitar servicio personalizado
              </button>
              <button className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'>
                Hablar con un asesor
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
