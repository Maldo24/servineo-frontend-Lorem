'use client';
import React, { JSX } from 'react';

// Tipos para el componente de sección de política
type PolicySectionProps = {
  title: string;
  content: string[];
  iconPath: string;
  gradient: string;
};

export default function CookiesPage(): JSX.Element {
  // Componente para una sección de política de cookies
  const PolicySection: React.FC<PolicySectionProps> = ({ title, content, iconPath, gradient }) => (
    <div className='bg-[var(--background)] rounded-xl shadow-md border border-[var(--primary)] overflow-hidden'>
      {/* Header de sección con gradiente */}
      <div className={`bg-gradient-to-r ${gradient} text-white p-4 flex items-center gap-3`}>
        <div className='w-10 h-10 bg-white/25 rounded-lg flex items-center justify-center flex-shrink-0'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={iconPath} />
          </svg>
        </div>
        <h3 className='text-lg font-bold'>{title}</h3>
      </div>

      {/* Contenido de la sección */}
      <div className='p-5 text-sm text-[var(--foreground)] space-y-3'>
        {content.map((paragraph, index) => (
          <p key={index} className='leading-relaxed'>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );

  const policySections = [
    {
      title: '1. ¿Qué son las Cookies?',
      gradient: 'from-[var(--primary)] to-[var(--primary)]',
      iconPath: 'M5 12h14M12 5l7 7-7 7',
      content: [
        'Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet, smartphone) cuando visitas Servineo. Permiten a la aplicación recordar tus acciones y preferencias durante un período de tiempo, facilitando la navegación y personalizando la experiencia.',
      ],
    },
    {
      title: '2. Tipos de Cookies que Utilizamos',
      gradient: 'from-[var(--primary)] to-[var(--primary)]',
      iconPath:
        'M9.75 17L9 20l-1 1h8l-1-1-3.75-3.75M3 17h18M5 17s2.5-1.5 7-1.5 7 1.5 7 1.5M4 12v3M20 12v3M5 10V8a7 7 0 0114 0v2',
      content: [
        'Utilizamos diferentes tipos de cookies para asegurar el correcto funcionamiento de nuestra plataforma de agendamiento y cotización de servicios:',
      ],
      details: [
        {
          subtitle: '2.1. Cookies Esenciales (Técnicas)',
          text: 'Son estrictamente necesarias para el funcionamiento de Servineo. Permiten el acceso a zonas seguras, mantener tu sesión activa y habilitar la funcionalidad de video inspección.',
        },
        {
          subtitle: '2.2. Cookies de Funcionalidad o Preferencia',
          text: 'Permiten recordar información para acceder al servicio con características personalizadas, como idioma o región de acceso.',
        },
        {
          subtitle: '2.3. Cookies de Rendimiento o Análisis',
          text: 'Nos ayudan a entender cómo interactúas con los calendarios y cotizaciones, permitiéndonos mejorar la experiencia de usuario.',
        },
        {
          subtitle: '2.4. Cookies de Publicidad Comportamental',
          text: 'Almacenan información sobre tus hábitos de navegación para ofrecerte publicidad de servicios relevantes.',
        },
      ],
    },
    {
      title: '3. Cookies de Terceros',
      gradient: 'from-[var(--primary)] to-[var(--primary)]',
      iconPath:
        'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      content: [
        'Servineo utiliza servicios de terceros que pueden instalar sus propias cookies, como Google Analytics y redes sociales, para medición y analítica.',
      ],
    },
    {
      title: '4. Gestión de Cookies',
      gradient: 'from-[var(--primary)] to-[var(--primary)]',
      iconPath:
        'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35-.427.757-.427 1.838 0 2.573 1.543.94 3.31-.826 2.37-2.37a1.724 1.724 0 00-1.065-2.572M10 20l4-4m-4 0l4 4',
      content: [
        'Puedes aceptar, rechazar o revocar tu consentimiento sobre el uso de cookies en cualquier momento desde la configuración de tu navegador.',
        'Si deshabilitas las cookies esenciales, ciertas funciones como el agendamiento o el acceso a tu cuenta podrían dejar de funcionar correctamente.',
      ],
    },
  ];

  return (
    <div className='bg-[var(--background)] text-[var(--foreground)] min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] text-white py-12 px-6 md:px-12 overflow-hidden'>
        <div className='absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-60 h-60 bg-[var(--primary)]/25 rounded-full blur-2xl'></div>

        <div className='max-w-5xl mx-auto text-center relative z-10'>
          <div className='w-16 h-16 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
          <h1 className='text-3xl md:text-4xl font-bold mb-3'>Política de Cookies de Servineo</h1>
          <p className='text-base opacity-90 max-w-2xl mx-auto'>
            Información detallada sobre cómo usamos cookies para mejorar tu experiencia.
          </p>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className='max-w-6xl mx-auto py-10 px-6 md:px-10 space-y-8'>
        {/* Introducción */}
        <div className='bg-[var(--background)] p-6 rounded-xl shadow-md border-l-4 border-[var(--primary)]'>
          <h2 className='text-2xl font-bold text-[var(--primary)] mb-3'>Información General</h2>
          <p className='mb-3 leading-relaxed'>
            Esta política explica cómo Servineo utiliza las cookies y tecnologías similares. Al usar
            nuestra plataforma, acepta su uso según esta política.
          </p>
          <p className='leading-relaxed'>
            Nuestro objetivo es brindarle la mejor experiencia posible, optimizando las funciones
            mediante el uso responsable de cookies.
          </p>
        </div>

        {/* Secciones iteradas */}
        {policySections.map((section, index) => (
          <div key={index}>
            <PolicySection
              title={section.title}
              content={section.content}
              iconPath={section.iconPath}
              gradient={section.gradient}
            />
            {section.details && (
              <div className='ml-4 mt-4 space-y-3 p-4 bg-[var(--background)] rounded-xl border border-[var(--primary)]'>
                {section.details.map((detail, dIndex) => (
                  <div key={dIndex} className='text-sm text-[var(--foreground)]'>
                    <p className='font-semibold text-[var(--primary)]'>{detail.subtitle}:</p>
                    <p className='leading-relaxed pl-3 border-l-2 border-[var(--primary)] ml-1'>
                      {detail.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className='bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] text-white text-center py-10 px-6 mt-10'>
        <div className='max-w-4xl mx-auto'>
          <h3 className='text-2xl font-bold mb-3'>Tu Privacidad es Importante</h3>
          <p className='text-base leading-relaxed mb-5 opacity-95'>
            Puedes cambiar tu configuración de cookies en cualquier momento. Al continuar navegando,
            aceptas nuestra política.
          </p>
          <button className='bg-white text-[var(--primary)] px-8 py-3 rounded-full font-bold text-base hover:bg-[var(--primary)]/10 transition-all duration-300 shadow-lg hover:shadow-xl'>
            Aceptar y Cerrar
          </button>
        </div>
      </section>
    </div>
  );
}
