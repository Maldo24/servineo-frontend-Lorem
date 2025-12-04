'use client';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function ParaReparadores() {
  const [imgError, setImgError] = useState(false);

  return (
    <main className='bg-[var(--background)] text-[var(--foreground)] min-h-screen font-sans'>
      <section className='relative bg-[var(--primary)] text-white py-16 px-6 md:px-12 overflow-hidden'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-[var(--primary)]/20 rounded-full blur-2xl'></div>

        <div className='max-w-5xl mx-auto text-center relative z-10'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 leading-tight'>
            Ofrece tus servicios
          </h1>
          <p className='text-lg md:text-xl opacity-90 max-w-3xl mx-auto'>
            Conecta con clientes de manera confiable y profesional. Gestiona tus citas, agenda
            reparaciones y crece junto a nosotros.
          </p>
        </div>
      </section>

      <section className='max-w-6xl mx-auto py-12 px-6 md:px-10'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-[var(--primary)] mb-2'>Beneficios</h2>
          <div className='w-20 h-1 bg-[var(--primary)] mx-auto'></div>
        </div>

        <div className='grid md:grid-cols-2 gap-8 items-center'>
          <div>
            <p className='text-base text-gray-700 leading-relaxed mb-4'>
              Servineo te permite recibir solicitudes de reparación directamente de clientes en tu
              área. Ya seas{' '}
              <span className='font-semibold text-[var(--primary)]'>
                electricista, plomero, carpintero, pintor
              </span>{' '}
              u otro especialista, podrás mostrar tus servicios y recibir más trabajos de calidad.
            </p>
            <p className='text-base text-gray-700 leading-relaxed'>
              Todos los reparadores registrados tienen la oportunidad de construir su reputación,
              recibir valoraciones confiables y crecer profesionalmente dentro de nuestra
              plataforma.
            </p>
          </div>
          <div className='relative h-[320px]'>
            <Image
              src={imgError ? '/fallback-image.svg' : '/reparadores.jpg'}
              alt='Reparadores en acción'
              fill
              className='rounded-xl shadow-xl object-cover'
              onError={() => setImgError(true)}
            />
          </div>
        </div>
      </section>

      <section className='bg-gray-50 py-12 px-6 md:px-10 relative overflow-hidden'>
        <div className='absolute inset-0 opacity-5'>
          <div className='absolute top-10 left-10 w-40 h-40 border-4 border-[var(--primary)] rounded-full'></div>
          <div className='absolute bottom-20 right-20 w-32 h-32 border-4 border-[var(--primary)] rounded-lg rotate-45'></div>
          <div className='absolute top-1/2 left-1/3 w-24 h-24 bg-[var(--primary)] rounded-full'></div>
        </div>

        <div className='max-w-6xl mx-auto relative z-10'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl font-bold text-[var(--primary)] mb-2'>Cómo Funciona</h2>
            <div className='w-20 h-1 bg-[var(--primary)] mx-auto'></div>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <div className='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[var(--primary)]'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-xl font-bold text-[var(--primary)] mb-2'>Agenda Fácil</h3>
                  <p className='text-sm text-gray-700 leading-relaxed'>
                    Gestiona tus citas desde la plataforma, recibe solicitudes y organiza tus
                    reparaciones de manera sencilla.
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[var(--primary)]'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-xl font-bold text-[var(--primary)] mb-2'>
                    Cotizaciones Rápidas
                  </h3>
                  <p className='text-sm text-gray-700 leading-relaxed'>
                    Recibe solicitudes de clientes con videos o fotos de los trabajos y envía tu
                    presupuesto al instante.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='max-w-6xl mx-auto py-12 px-6 md:px-10 text-center'>
        <h2 className='text-3xl font-bold text-[var(--primary)] mb-4'>
          ¡Únete como reparador hoy!
        </h2>
        <p className='text-gray-700 mb-6'>
          Regístrate en Servineo y empieza a recibir trabajos de manera confiable y profesional.
        </p>
        <Link
          href='/registro-reparador'
          className='inline-block bg-[var(--primary)] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-300'
        >
          Registrarse
        </Link>
      </section>
    </main>
  );
}
