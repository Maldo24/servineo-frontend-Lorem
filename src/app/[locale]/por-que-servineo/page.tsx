'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, User, Calendar, ShieldCheck } from 'lucide-react';
import { Check, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

function useInViewMultiple(count: number, options?: IntersectionObserverInit) {
  const refs = useRef<(HTMLDivElement | null)[]>(Array(count).fill(null));
  const [inViewStates, setInViewStates] = useState<boolean[]>(Array(count).fill(false));

  useEffect(() => {
    refs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setInViewStates((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, ...options },
      );

      observer.observe(el);
    });
  }, [count, options]);

  return { refs, inViewStates };
}

export default function WhyServineoPage() {
  const fallbackSrc = '/fallback-image.svg';

  const banners = [
    {
      id: 1,
      title: 'Descubre quiénes están cerca de ti',
      description:
        'Explora tu ciudad desde el mapa interactivo de Servineo y descubre a los fixers disponibles cerca de ti. Podrás ver fácilmente su ubicación y acceder a su información con un solo clic. Así, Servineo te conecta de forma rápida y sencilla con los profesionales que realmente están a tu alcance.',
      image: '/es/img/banner1.jpg',
      alt: 'Mapa de la ciudad con marcadores que muestran fixers cerca del usuario',
      icon: (
        <MapPin className='inline-block w-6 h-6 mr-2 text-[var(--primary)]' aria-hidden='true' />
      ),
      button: { text: 'Explorar mapa', link: '/' },
    },
    {
      id: 2,
      title: 'Conócelos en detalle',
      description:
        'En Servineo, cada fixer cuenta con un perfil completo que muestra su experiencia, especialidades y disponibilidad. Explora sus trayectorias, conoce sus habilidades y elige con confianza al profesional que mejor se adapte a tus necesidades. Todo lo que necesitas saber para encontrar al fixer ideal, en un solo lugar.',
      image: '/es/img/banner2.jpg',
      alt: 'Perfil de un profesional mostrando su información y experiencia',
      icon: <User className='inline-block w-6 h-6 mr-2 text-[var(--primary)]' aria-hidden='true' />,
    },
    {
      id: 3,
      title: 'Agenda tu cita con facilidad',
      description:
        'Con Servineo, agendar un servicio es rápido y sin complicaciones. Elige al profesional que necesites, coordina los detalles por WhatsApp y confirma tu cita en el horario que prefieras. Todo desde una plataforma práctica que conecta fácilmente a quienes ofrecen y quienes buscan un servicio.',
      image: '/es/img/banner3.jpg',
      alt: 'Persona agendando una cita de servicio desde su dispositivo',
      icon: (
        <Calendar className='inline-block w-6 h-6 mr-2 text-[var(--primary)]' aria-hidden='true' />
      ),
      button: { text: 'Agendar ahora', link: '/' },
    },
    {
      id: 4,
      title: 'Confía en la calidad y seguridad del servicio',
      description:
        'En Servineo, la confianza es lo primero. Por eso, cada fixer pasa por un proceso de registro que valida su compromiso, responsabilidad y cumplimiento de nuestras políticas. Así, garantizamos que cada servicio dentro de la plataforma sea seguro, transparente y de calidad, brindándote la tranquilidad de contratar a profesionales en los que realmente puedes confiar.',
      image: '/es/img/banner4.jpg',
      alt: 'Profesional estrechando la mano de un cliente en señal de confianza',
      icon: (
        <ShieldCheck
          className='inline-block w-6 h-6 mr-2 text-[var(--primary)]'
          aria-hidden='true'
        />
      ),
    },
  ];

  // Mapa para saber qué imágenes fallaron y usar fallback
  const [failedMap, setFailedMap] = useState<Record<number, boolean>>({});

  const STORAGE_KEY = 'whyServineoScroll';

  // Guardar scroll mientras el usuario navega
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      sessionStorage.setItem(STORAGE_KEY, String(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Restaurar scroll después de renderizar y cargar imágenes
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const restoreScroll = () => {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const y = parseInt(saved, 10);
        if (!Number.isNaN(y)) {
          window.scrollTo({ top: y, left: 0, behavior: 'auto' });
        }
      }
    };

    // Restaurar al montar
    restoreScroll();

    // Restaurar al volver con atrás/adelante
    const handlePopState = () => {
      const retry = () => {
        restoreScroll();
        if (window.scrollY < 1) setTimeout(retry, 50);
      };
      retry();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const { refs, inViewStates } = useInViewMultiple(banners.length);

  return (
    <main className='min-h-screen bg-[var(--background)] text-[var(--foreground)]'>
      {/* Hero / Introducción */}
      <section className='max-w-5xl mx-auto px-6 py-24 text-center'>
        <h1 className='text-5xl md:text-6xl font-extrabold text-[var(--primary)] mb-8 leading-tight'>
          ¿Por qué Servineo?
        </h1>
        <p className='text-lg md:text-xl leading-relaxed text-gray-700 max-w-3xl mx-auto'>
          En Servineo, creemos que encontrar ayuda profesional no debería ser complicado. Por eso,
          creamos una plataforma que te conecta con expertos de confianza, especializados en
          carpintería, plomería, electricidad y mucho más. Servineo transforma la manera de
          contratar servicios: rápida, clara y hecha para simplificar tu día a día.
        </p>
      </section>

      {/* Banners */}
      {banners.map((banner, index) => (
        <section
          key={banner.id}
          ref={(el: HTMLDivElement | null) => {
            refs.current[index] = el;
          }}
          className={`py-12 lg:py-20 relative flex flex-col-reverse md:flex-row items-start max-w-6xl mx-auto px-4 sm:px-6 md:px-8 gap-12 sm:gap-8 transition-all duration-700 ease-out
            ${inViewStates[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 sm:translate-y-8'}`}
        >
          {/* Texto */}
          <div className='md:w-1/2 text-center md:text-left z-20'>
            <h2 className='text-2xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 flex items-center justify-center md:justify-start'>
              {banner.icon}
              {banner.title}
            </h2>
            <p className='text-base sm:text-lg md:text-lg leading-relaxed mb-4'>
              {banner.description}
            </p>
            {banner.button && (
              <Link
                href={banner.button.link}
                className='inline-block bg-[var(--primary)] hover:bg-[var(--secondary)] text-white rounded-full px-6 py-3 shadow-md transition-all duration-300 transform hover:scale-105 mt-4'
              >
                {banner.button.text}
              </Link>
            )}
          </div>

          {/* Imagen */}
          <div className='md:w-1/2 relative z-10 flex justify-center md:justify-end'>
            <div
              className='hidden xl:block absolute rounded-3xl shadow-lg
                top-0 right-0 w-5/6 sm:w-4/5 h-5/6 sm:h-4/5 translate-x-6 sm:translate-x-14 -translate-y-4 sm:-translate-y-6
                bg-[var(--primary)] z-0'
              aria-hidden='true'
            />
            <div className='relative rounded-3xl shadow-lg overflow-hidden w-full md:w-[90%] z-10 group bg-gray-100'>
              <Image
                src={failedMap[index] ? fallbackSrc : banner.image}
                alt={banner.alt}
                width={800}
                height={520}
                className='w-full h-auto object-cover block transition duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:brightness-95'
                onError={() => {
                  setFailedMap((prev) => ({ ...prev, [index]: true }));
                }}
              />
            </div>
          </div>
        </section>
      ))}
      {/* Tabla comparativa */}
      <section className='max-w-6xl mx-auto px-6 py-24 bg-[var(--background)] text-[var(--foreground)]'>
        {/* Subtítulo */}
        <h2 className='text-3xl md:text-4xl font-extrabold text-black mb-4 text-center'>
          ¿Qué hace a Servineo diferente?
        </h2>
        {/* Descripción */}
        <p className='text-base sm:text-lg md:text-lg leading-relaxed text-center text-gray-700 mb-12 max-w-3xl mx-auto'>
          Compara las principales plataformas de servicios y descubre por qué Servineo ofrece mayor
          seguridad, confianza y facilidad para agendar tus servicios.
        </p>

        <div className='overflow-x-auto relative'>
          <table className='min-w-full border border-gray-200 rounded-2xl shadow-md overflow-hidden'>
            <thead className='bg-[var(--primary)] text-white'>
              <tr>
                <th className='p-4 text-center text-xl'>Criterio</th>
                <th className='p-4 text-center text-xl'>Servineo</th>
                <th className='p-4 text-center text-xl'>
                  <a
                    href='https://www.facebook.com/marketplace'
                    target='_blank'
                    rel='noopener noreferrer'
                    className="relative inline-block text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
                  >
                    Facebook Marketplace
                  </a>
                </th>
                <th className='p-4 text-center text-xl'>
                  <a
                    href='https://bookaapp.com/services'
                    target='_blank'
                    rel='noopener noreferrer'
                    className="relative inline-block text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
                  >
                    Foreign apps
                  </a>
                </th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {/* Verificación de usuarios */}
              <tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
                <td className='p-4 text-center'>Verificación de usuarios</td>
                <td className='p-4 bg-blue-50 rounded-lg shadow-sm text-center'>
                  Perfiles reales y verificados
                </td>
                <td className='p-4 text-center relative group cursor-pointer'>
                  <X className='mx-auto text-red-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Sin verificación obligatoria
                  </span>
                </td>
                <td className='p-4 text-center relative group cursor-pointer'>
                  <X className='mx-auto text-red-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Validación básica
                  </span>
                </td>
              </tr>

              {/* Reserva de citas */}
              <tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
                <td className='p-4 text-center'>Reserva de citas</td>
                <td className='p-4 bg-blue-50 rounded-lg shadow-sm text-center relative group cursor-pointer'>
                  <Check className='mx-auto text-green-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Reserva en segundos desde la plataforma
                  </span>
                </td>
                <td className='p-4 text-center relative group cursor-pointer'>
                  <X className='mx-auto text-red-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Sin sistema de reservas
                  </span>
                </td>
                <td className='p-4 text-center relative group cursor-pointer'>
                  <Check className='mx-auto text-green-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Disponible, pero poco ágil
                  </span>
                </td>
              </tr>

              {/* Seguridad y confianza */}
              <tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
                <td className='p-4 text-center'>Seguridad y confianza</td>
                <td className='p-4 bg-blue-50 rounded-lg shadow-sm text-center relative group cursor-pointer'>
                  <Check className='mx-auto text-green-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Opiniones reales y control de calidad
                  </span>
                </td>
                <td className='p-4 text-center relative group cursor-pointer'>
                  <X className='mx-auto text-red-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Alto riesgo de fraudes
                  </span>
                </td>
                <td className='p-4 text-center relative group cursor-pointer'>
                  <X className='mx-auto text-red-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Moderada, depende del país
                  </span>
                </td>
              </tr>

              {/* Información del profesional */}
              <tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
                <td className='p-4 text-center'>Información del profesional</td>
                <td className='p-4 bg-blue-50 rounded-lg shadow-sm text-center'>
                  Perfiles con fotos, habilidades y disponibilidad
                </td>
                <td className='p-4 text-center'>Información limitada</td>
                <td className='p-4 text-center'>Datos básicos</td>
              </tr>

              {/* Atención al cliente */}
              <tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
                <td className='p-4 text-center'>Atención al cliente</td>
                <td className='p-4 bg-blue-50 rounded-lg shadow-sm text-center relative group cursor-pointer'>
                  <Check className='mx-auto text-green-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Soporte directo por WhatsApp o correo
                  </span>
                </td>
                <td className='p-4 text-center relative group cursor-pointer'>
                  <X className='mx-auto text-red-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Sin atención personalizada
                  </span>
                </td>
                <td className='p-4 text-center relative group cursor-pointer'>
                  <X className='mx-auto text-red-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Limitada
                  </span>
                </td>
              </tr>

              {/* Diseño enfocado en servicios */}
              <tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
                <td className='p-4 text-center'>Diseño enfocado en servicios</td>
                <td className='p-4 bg-blue-50 rounded-lg shadow-sm text-center relative group cursor-pointer'>
                  <Check className='mx-auto text-green-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Hecho para conectar profesionales y clientes
                  </span>
                </td>
                <td className='p-4 text-center relative group cursor-pointer'>
                  <X className='mx-auto text-red-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Enfocado en ventas generales
                  </span>
                </td>
                <td className='p-4 text-center relative group cursor-pointer'>
                  <X className='mx-auto text-red-600' />
                  <span className='absolute left-1/2 -translate-x-1/2 -top-10 hidden group-hover:block bg-white text-black text-base rounded-lg shadow-lg px-3 py-1 max-w-xs break-words transition-all'>
                    Orientado a experiencias
                  </span>
                </td>
              </tr>

              {/* Costo de uso */}
              <tr className='hover:bg-gray-50 transition-colors'>
                <td className='p-4 text-center'>Costo de uso</td>
                <td className='p-4 bg-blue-50 rounded-lg shadow-sm text-center'>
                  Gratis y transparente
                </td>
                <td className='p-4 text-center'>Gratis, pero sin soporte</td>
                <td className='p-4 text-center'>Costos variables</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      {/* Sección de llamada a la acción */}
      {/* Sección de llamada a la acción centrada */}
      <section className='w-full bg-[var(--primary)] text-white py-16 px-6 flex flex-col items-center text-center'>
        <h2 className='text-3xl md:text-4xl font-extrabold mb-4'>
          ¡Conecta con los mejores profesionales en segundos!
        </h2>
        <p className='text-lg md:text-xl leading-relaxed max-w-3xl mb-8'>
          Con Servineo, encontrar ayuda confiable nunca fue tan rápido y seguro. Dale el impulso que
          tu día necesita y empieza a disfrutar de servicios profesionales a tu alcance.
        </p>
        <button
          onClick={() => (window.location.href = '/')}
          className='bg-white text-[var(--primary)] font-semibold rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
        >
          ¡Prueba Servineo ahora!
        </button>
      </section>
    </main>
  );
}
