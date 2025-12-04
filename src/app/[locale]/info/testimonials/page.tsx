'use client';
import React from 'react';

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: 'María González',
      role: 'Cliente frecuente',
      service: 'Fontanería',
      rating: 5,
      text: 'Increíble experiencia. El fontanero llegó puntual, trabajó de manera profesional y el precio fue justo. La función del calendario en tiempo real me ahorró muchas llamadas.',
      avatar: 'MG',
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Propietario de negocio',
      service: 'Electricidad',
      rating: 5,
      text: 'Necesitaba un electricista urgente para mi local. Con la video inspección obtuve 3 cotizaciones en menos de 2 horas. Elegí el mejor precio y quedó perfecto.',
      avatar: 'CR',
    },
    {
      name: 'Ana Martínez',
      role: 'Ama de casa',
      service: 'Carpintería',
      rating: 5,
      text: 'El carpintero que contraté a través de Servineo hizo un trabajo excepcional en mis muebles. Me encantó poder ver su disponibilidad antes de agendar.',
      avatar: 'AM',
    },
    {
      name: 'Roberto Silva',
      role: 'Ingeniero',
      service: 'Pintura',
      rating: 4,
      text: 'Plataforma muy intuitiva y profesionales confiables. Contraté un pintor para mi casa y el resultado superó mis expectativas. Definitivamente volveré a usar Servineo.',
      avatar: 'RS',
    },
    {
      name: 'Laura Fernández',
      role: 'Diseñadora',
      service: 'Plomería',
      rating: 5,
      text: 'La verificación de profesionales me dio mucha confianza. El plomero fue muy profesional y resolvió mi problema de fuga en pocas horas. ¡Excelente servicio!',
      avatar: 'LF',
    },
    {
      name: 'Jorge Mendoza',
      role: 'Empresario',
      service: 'Electricidad y Pintura',
      rating: 5,
      text: 'He usado Servineo varias veces para mi oficina. La calidad de los profesionales es consistente y el proceso de agendamiento es súper rápido. Muy recomendado.',
      avatar: 'JM',
    },
  ];

  return (
    <main className='bg-[var(--background)] text-[var(--foreground)] min-h-screen'>
      {/* HERO SECTION */}
      <section className='relative bg-[var(--primary)] text-white py-16 px-6 md:px-12 overflow-hidden shadow-lg'>
        <div className='absolute top-0 right-0 w-80 h-80 bg-[var(--primary)]/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-60 h-60 bg-[var(--primary)]/30 rounded-full blur-2xl'></div>

        <div className='max-w-5xl mx-auto text-center relative z-10'>
          <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5'>
            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              />
            </svg>
          </div>
          <h1 className='text-4xl md:text-5xl font-extrabold mb-4'>
            Lo que dicen nuestros usuarios
          </h1>
          <p className='text-base opacity-90 max-w-2xl mx-auto'>
            Miles de personas confían en Servineo para conectar con profesionales verificados.
          </p>
        </div>
      </section>

      {/* Grid de testimonios */}
      <section className='max-w-6xl mx-auto py-14 px-6 md:px-10'>
        <div className='grid md:grid-cols-2 gap-6'>
          {testimonials.map((t, i) => (
            <div
              key={i}
              className='bg-[var(--background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--light-gray)]'
            >
              <div className='flex items-start gap-4 mb-4'>
                <div className='w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                  {t.avatar}
                </div>
                <div className='flex-1'>
                  <h3 className='font-bold text-[var(--foreground)] text-base'>{t.name}</h3>
                  <p className='text-xs text-[var(--primary)]'>{t.role}</p>
                  <div className='flex items-center gap-1 mt-1'>
                    {[...Array(t.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className='w-4 h-4 text-yellow-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className='text-right'>
                  <span className='inline-block px-2 py-1 bg-[var(--light-gray)] text-[var(--primary)] text-xs rounded-full font-semibold'>
                    {t.service}
                  </span>
                </div>
              </div>
              <p className='text-sm text-[var(--foreground)] leading-relaxed italic'>
                {'"'}
                {t.text}
                {'"'}
              </p>
              <div className='mt-4 pt-3 border-t border-[var(--light-gray)] flex items-center gap-2 text-xs text-[var(--primary)]'>
                <svg className='w-4 h-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Cliente verificado</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className='bg-[var(--primary)] text-white text-center py-12 px-6'>
        <div className='max-w-4xl mx-auto'>
          <h3 className='text-2xl md:text-3xl font-bold mb-3'>
            ¿Listo para vivir tu propia experiencia?
          </h3>
          <p className='text-base leading-relaxed mb-5 opacity-95'>
            Únete a miles de usuarios satisfechos que ya confían en Servineo para encontrar los
            mejores profesionales verificados.
          </p>
          <button className='bg-white text-[var(--primary)] px-8 py-3 rounded-full font-bold text-base hover:bg-[var(--light-gray)] transition-colors duration-300 shadow-lg hover:shadow-xl'>
            Encuentra tu Profesional
          </button>
        </div>
      </section>
    </main>
  );
}
