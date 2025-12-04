'use client';
import React from 'react';

// Tipos para los subcomponentes
type SectionBlockProps = {
  index: string | number;
  title: string;
  borderColor?: string;
  children?: React.ReactNode;
};

export default function TermsPage() {
  return (
    <main className='bg-[var(--background)] text-[var(--foreground)] min-h-screen'>
      {/* HERO SECTION */}
      <section className='relative bg-[var(--primary)] text-white py-16 px-6 md:px-12 overflow-hidden shadow-lg'>
        <div className='absolute top-0 right-0 w-80 h-80 bg-[var(--primary)]/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-60 h-60 bg-[var(--primary)]/30 rounded-full blur-2xl'></div>

        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5'>
            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
          <h1 className='text-4xl md:text-5xl font-extrabold mb-4'>Términos y Condiciones</h1>
          <p className='text-base opacity-90 max-w-2xl mx-auto'>
            Por favor, lee cuidadosamente estos términos antes de utilizar Servineo.
          </p>
          <p className='text-sm opacity-80 mt-2'>Última actualización: Octubre 2025</p>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className='max-w-5xl mx-auto py-14 px-6 md:px-10'>
        <div className='mb-10 p-6 bg-[var(--light-gray)] border-l-4 border-[var(--primary)] rounded-r-xl shadow-sm'>
          <h2 className='text-2xl font-bold text-[var(--primary)] mb-3'>Bienvenido a Servineo</h2>
          <p className='text-sm leading-relaxed mb-2'>
            Al acceder y utilizar nuestra plataforma, aceptas estar sujeto a estos términos y
            condiciones.
          </p>
          <p className='text-sm leading-relaxed'>
            Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros
            servicios.
          </p>
        </div>

        {/* TÉRMINOS INDIVIDUALES */}
        <div className='space-y-10'>
          {[
            {
              index: '1',
              title: 'Uso de la Plataforma',
              content: (
                <>
                  <p>
                    Servineo conecta usuarios con profesionales de servicios verificados. Al
                    utilizar la plataforma, te comprometes a:
                  </p>
                  <ul className='space-y-2 mt-3 ml-2 list-disc list-inside text-sm'>
                    <li>Proporcionar información veraz y actualizada</li>
                    <li>Usar el servicio únicamente para fines legales</li>
                    <li>No suplantar identidades ni crear perfiles falsos</li>
                    <li>Respetar a todos los usuarios y profesionales de la comunidad</li>
                  </ul>
                </>
              ),
            },
            {
              index: '2',
              title: 'Registro y Cuenta de Usuario',
              content: (
                <ul className='space-y-2 text-sm'>
                  <li>Mantener la confidencialidad de tus credenciales</li>
                  <li>Todas las actividades realizadas bajo tu cuenta</li>
                  <li>Notificarnos inmediatamente de cualquier uso no autorizado</li>
                  <li>Actualizar tu información de contacto cuando sea necesario</li>
                </ul>
              ),
            },
            {
              index: '3',
              title: 'Propiedad Intelectual',
              content: (
                <p>
                  Todo el contenido de Servineo, incluyendo textos, logos, gráficos y software, es
                  propiedad de la empresa o de terceros con licencia.
                </p>
              ),
            },
            {
              index: '4',
              title: 'Limitación de Responsabilidad',
              content: (
                <p>
                  Servineo no se hace responsable por daños directos o indirectos derivados del uso
                  de la plataforma.
                </p>
              ),
            },
            {
              index: '5',
              title: 'Modificaciones',
              content: (
                <p>
                  Podemos actualizar estos términos en cualquier momento. Te notificaremos de
                  cambios significativos.
                </p>
              ),
            },
          ].map((term, idx) => (
            <SectionBlock
              key={idx}
              index={term.index}
              title={term.title}
              borderColor='var(--primary)'
            >
              {term.content}
            </SectionBlock>
          ))}
        </div>

        {/* CONTACTO */}
        <div className='mt-16 p-6 bg-[var(--light-gray)] rounded-xl border border-[var(--primary)] shadow-md'>
          <h3 className='text-lg font-bold text-[var(--primary)] mb-2'>Contacto Legal</h3>
          <p className='text-sm mb-2'>Si tienes preguntas sobre estos términos, contáctanos:</p>
          <a
            href='mailto:legal@servineo.com'
            className='text-[var(--primary)] font-semibold hover:text-[var(--primary)] transition-colors'
          >
            legal@servineo.com
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className='bg-[var(--primary)] text-white text-center py-8'>
        <p className='text-sm font-medium'>
          Al usar Servineo confirmas que aceptas estos términos. © Servineo 2025
        </p>
      </footer>
    </main>
  );
}

/* COMPONENTES AUXILIARES */
function SectionBlock({ index, title, borderColor, children }: SectionBlockProps) {
  return (
    <div className='pl-5 border-l-4 rounded-lg bg-white p-5 shadow-sm' style={{ borderColor }}>
      <h3 className='text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2'>
        <span className='w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-sm font-bold'>
          {index}
        </span>
        {title}
      </h3>
      <div className='text-sm text-[var(--foreground)] leading-relaxed'>{children}</div>
    </div>
  );
}
