'use client';
import React from 'react';

export default function JoinPage() {
  const benefits = [
    {
      title: 'Expande tu Clientele',
      description:
        'Accede a miles de solicitudes de servicios calificados en tu área, sin necesidad de gastar en publicidad.',
      icon: 'M13 7h-6v6h6V7zM7 17h10M17 10h-2M15 17h2',
      colorVar: '--primary',
    },
    {
      title: 'Cotizaciones Rápidas con Video',
      description:
        'Utiliza nuestra herramienta de video inspección para cotizar trabajos complejos a distancia, ahorrando tiempo y traslados.',
      icon: 'M15 10l4.55 4.55a1 1 0 010 1.41l-2.83 2.83a1 1 0 01-1.41 0L10 17M14 10l-2.5-2.5M10 14l2.5 2.5M3 17l4-4M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z',
      colorVar: '--primary',
    },
    {
      title: 'Gestiona con Facilidad',
      description:
        'Organiza tu calendario, citas agendadas y pagos en un solo lugar con nuestra interfaz intuitiva.',
      icon: 'M8 7v4m4-4v4m4-4v4m-6 8h6M5 13h14M8 17h8M5 5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z',
      colorVar: '--primary',
    },
    {
      title: 'Comunidad y Soporte',
      description:
        'Únete a una comunidad exclusiva de profesionales y recibe soporte técnico y operativo 24/7.',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0zM7 10a2 2 0 11-4 0 2 2 0z',
      colorVar: '--primary',
    },
  ];

  const steps = [
    { text: 'Crea tu Perfil y Verifica tu Identidad.', colorVar: '--primary' },
    { text: 'Define tus Servicios, Precios y Disponibilidad.', colorVar: '--primary' },
    { text: 'Comienza a Recibir Solicitudes y a Cotizar.', colorVar: '--primary' },
  ];

  const MainCTAButton = ({ text = 'Postúlate y Únete a la Red', size = 'text-xl' }) => (
    <button
      className={`bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white ${size} font-bold px-12 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.03]`}
    >
      {text}
    </button>
  );

  return (
    <div className='min-h-screen bg-[var(--background)] pb-16'>
      {/* 1. Hero Section */}
      <section className='relative bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] text-white py-24 px-6 md:px-12 overflow-hidden shadow-2xl'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-3xl opacity-50 transform translate-x-1/4 -translate-y-1/4'></div>
        <div className='absolute bottom-0 left-0 w-72 h-72 bg-[var(--primary)]/20 rounded-full blur-2xl opacity-40 transform -translate-x-1/4 translate-y-1/4'></div>

        <div className='max-w-6xl mx-auto text-center relative z-10'>
          <h1 className='text-4xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight'>
            Únete a <span className='text-[#000000] drop-shadow-lg'>Servineo</span> y trabaja con
            nosotros:
          </h1>
          <p className='text-lg md:text-xl mb-10 opacity-95 max-w-3xl mx-auto font-light'>
            Maximiza tu potencial. Accede a trabajos cotizados, utiliza herramientas innovadoras y
            gestiona tu negocio sin comisiones iniciales.
          </p>
          <MainCTAButton />
        </div>
      </section>

      {/* 2. Benefits */}
      <section className='py-20 px-6 md:px-12'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-4xl font-extrabold text-center text-[var(--primary)] mb-14'>
            Beneficios Clave para tu Crecimiento
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className='bg-white p-6 rounded-2xl shadow-xl transition-all duration-300 border-b-4 hover:shadow-2xl hover:translate-y-[-4px]'
                style={{ borderColor: `var(${benefit.colorVar})` }}
              >
                <div
                  className='w-14 h-14 mb-4 rounded-xl flex items-center justify-center shadow-lg'
                  style={{ backgroundColor: `var(${benefit.colorVar})` }}
                >
                  <svg
                    className='w-7 h-7 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d={benefit.icon}
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-bold text-[var(--primary)] mb-2'>{benefit.title}</h3>
                <p className='text-gray-600 text-sm'>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Steps */}
      <section className='bg-white py-16 px-6 md:px-12'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl font-extrabold text-center text-[var(--primary)] mb-16'>
            Proceso de Integración en 3 Pasos
          </h2>

          <div className='relative flex flex-col md:flex-row justify-between items-start md:space-x-4'>
            <div className='hidden md:block absolute top-10 left-0 right-0 h-1 bg-gray-200 mx-10'>
              <div
                className='absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]'
                style={{ width: '100%' }}
              ></div>
            </div>

            {steps.map((step, index) => (
              <div
                key={index}
                className='flex flex-col items-center text-center max-w-xs p-4 bg-white z-10 w-full md:w-1/3 space-y-4'
              >
                <div
                  className='w-16 h-16 rounded-full mb-2 flex items-center justify-center text-3xl font-extrabold text-white shadow-2xl border-4 border-white'
                  style={{ backgroundColor: `var(${step.colorVar})` }}
                >
                  {index + 1}
                </div>
                <p className='font-semibold text-xl text-[var(--primary)]'>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA Final */}
      <section className='py-20 px-6 md:px-12 text-center bg-[var(--background)]'>
        <div className='max-w-5xl mx-auto p-10 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] shadow-2xl transform transition-transform duration-500 hover:scale-[1.01]'>
          <h2 className='text-4xl font-extrabold text-white mb-4 drop-shadow-md'>
            Da el Salto. Únete a los Mejores.
          </h2>
          <p className='text-xl text-white/90 mb-10 font-light'>
            Transforma la manera en que encuentras y cotizas trabajo. Tu próxima gran oportunidad
            está a un clic.
          </p>
          <MainCTAButton text='Postularme Ahora' size='text-xl' />
        </div>
      </section>
    </div>
  );
}
