'use client';

export default function SupportPage() {
  const faqs = [
    {
      category: 'Primeros pasos',
      color: 'from-[var(--primary)] to-[var(--primary)]',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M13 10V3L4 14h7v7l9-11h-7z'
        />
      ),
      questions: [
        {
          q: '¿Cómo me registro en Servineo?',
          a: "Descarga la app o visita nuestra web, haz clic en 'Registrarse' e ingresa tu correo, nombre y crea una contraseña. Verifica tu email y listo, ya puedes buscar profesionales.",
        },
        {
          q: '¿Es gratuito usar Servineo?',
          a: 'Sí, registrarte y buscar profesionales es completamente gratuito. Solo pagas por los servicios que contrates directamente con los profesionales.',
        },
      ],
    },
    {
      category: 'Agendamiento',
      color: 'from-[var(--primary)] to-[var(--primary)]',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        />
      ),
      questions: [
        {
          q: '¿Cómo funciona el calendario en tiempo real?',
          a: 'Cada profesional actualiza su disponibilidad en tiempo real. Tú ves las fechas y horas libres y eliges la que mejor te convenga. Es instantáneo y sin necesidad de llamadas.',
        },
        {
          q: '¿Puedo cancelar o reprogramar una cita?',
          a: 'Sí, puedes hacerlo desde la app. Te recomendamos hacerlo con al menos 24 horas de anticipación para evitar cargos. Revisa la política de cancelación de cada profesional.',
        },
        {
          q: '¿Qué pasa si el profesional no llega?',
          a: 'Contacta inmediatamente a nuestro equipo de soporte. Tomaremos medidas y te ayudaremos a encontrar un reemplazo o te reembolsaremos según corresponda.',
        },
      ],
    },
    {
      category: 'Video Inspección',
      color: 'from-[var(--primary)] to-[var(--primary)]',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
        />
      ),
      questions: [
        {
          q: '¿Cómo funciona la video inspección?',
          a: 'Graba un video corto (30-60 segundos) mostrando el problema o área de trabajo. Súbelo a la app y en minutos recibirás cotizaciones de profesionales interesados.',
        },
        {
          q: '¿Qué debo incluir en el video?',
          a: 'Muestra claramente el área afectada, el problema específico y cualquier detalle relevante. Buena iluminación y estabilidad ayudan a obtener cotizaciones más precisas.',
        },
        {
          q: '¿Cuánto tiempo toma recibir cotizaciones?',
          a: 'Normalmente recibes las primeras cotizaciones en 15-30 minutos. En horarios pico puede tomar hasta 2 horas. Te notificaremos cuando lleguen.',
        },
      ],
    },
    {
      category: 'Pagos y Seguridad',
      color: 'from-[var(--primary)] to-[var(--primary)]',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
        />
      ),
      questions: [
        {
          q: '¿Cómo pago por los servicios?',
          a: 'Puedes pagar con tarjeta de crédito/débito, transferencia bancaria o en efectivo al profesional. El pago a través de la app está protegido y solo se libera cuando confirmas que el servicio fue completado.',
        },
        {
          q: '¿Mis datos están seguros?',
          a: 'Absolutamente. Usamos encriptación de nivel bancario para proteger tu información. Nunca compartimos tus datos sin tu consentimiento.',
        },
        {
          q: '¿Qué pasa si no estoy satisfecho con el servicio?',
          a: 'Contáctanos dentro de las 48 horas. Evaluaremos tu caso y, si corresponde, mediaremos con el profesional o procesaremos un reembolso según nuestra política de garantía.',
        },
      ],
    },
    {
      category: 'Profesionales',
      color: 'from-[var(--primary)] to-[var(--primary)]',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        />
      ),
      questions: [
        {
          q: '¿Cómo se verifican los profesionales?',
          a: 'Verificamos identidad, antecedentes, certificaciones profesionales y realizamos entrevistas. Solo aceptamos profesionales con experiencia comprobada y buenas referencias.',
        },
        {
          q: '¿Puedo calificar al profesional?',
          a: 'Sí, después de cada servicio puedes dejar una calificación de 1-5 estrellas y un comentario. Esto ayuda a otros usuarios y mantiene la calidad de nuestra red.',
        },
        {
          q: '¿Qué hago si tengo un problema con un profesional?',
          a: 'Repórtalo inmediatamente a través de la app o contacta a soporte. Investigaremos y tomaremos las medidas necesarias para resolver la situación.',
        },
      ],
    },
  ];

  const contactOptions = [
    {
      title: 'Chat en Vivo',
      description: 'Respuesta inmediata en horario de atención',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
        />
      ),
      action: 'Iniciar Chat',
      color: 'from-[var(--primary)] to-[var(--primary)]',
    },
    {
      title: 'Email',
      description: 'soporte@servineo.com',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        />
      ),
      action: 'Enviar Email',
      color: 'from-[var(--primary)] to-[var(--primary)]',
    },
    {
      title: 'WhatsApp',
      description: '+591 123 456 789',
      icon: (
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
        />
      ),
      action: 'Abrir WhatsApp',
      color: 'from-[var(--primary)] to-[var(--primary)]',
    },
  ];

  return (
    <main className='bg-[var(--background)] text-[var(--foreground)] min-h-screen'>
      {/* Hero */}
      <section className='relative bg-[var(--primary)] text-white py-12 px-6 md:px-12 overflow-hidden'>
        <div className='absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-60 h-60 bg-[var(--primary)]/20 rounded-full blur-2xl'></div>
        <div className='max-w-5xl mx-auto text-center relative z-10'>
          <h1 className='text-3xl md:text-4xl font-bold mb-3'></h1>
          <h1 className='text-3xl md:text-4xl font-bold mb-3'></h1>

          <h1 className='text-3xl md:text-4xl font-bold mb-3'>Centro de Apoyo</h1>
          <p className='text-base opacity-90 max-w-2xl mx-auto'>
            Estamos aquí para ayudarte. Encuentra respuestas rápidas o contáctanos directamente.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className='max-w-6xl mx-auto py-8 px-6 md:px-10 space-y-6'>
        {faqs.map((category, i) => (
          <div
            key={i}
            className='bg-[var(--background)] rounded-xl shadow-lg border border-[var(--light-gray)] overflow-hidden'
          >
            <div className='bg-[var(--primary)] text-white p-4 flex items-center gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  {category.icon}
                </svg>
              </div>
              <h3 className='text-lg font-bold'>{category.category}</h3>
            </div>
            <div className='divide-y divide-[var(--light-gray)]'>
              {category.questions.map((item, qIndex) => (
                <details key={qIndex} className='group'>
                  <summary className='flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--light-gray)] transition-colors'>
                    <span className='font-semibold text-[var(--foreground)] text-sm pr-4'>
                      {item.q}
                    </span>
                    <svg
                      className='w-5 h-5 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </summary>
                  <div className='px-4 pb-4 pt-2'>
                    <p className='text-sm text-gray-600 leading-relaxed'>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Contact Options */}
      <section className='bg-[var(--light-gray)] py-10 px-6 md:px-10'>
        <div className='max-w-6xl mx-auto grid md:grid-cols-3 gap-5'>
          {contactOptions.map((option, i) => (
            <div
              key={i}
              className='bg-[var(--background)] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300'
            >
              <div
                className={`w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center mb-4`}
              >
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  {option.icon}
                </svg>
              </div>
              <h3 className='font-bold text-[var(--foreground)] mb-2 text-base'>{option.title}</h3>
              <p className='text-sm text-gray-600 mb-4'>{option.description}</p>
              <button className='w-full bg-[var(--primary)] text-white py-2 px-4 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300'>
                {option.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Horarios de atención */}
      <section className='max-w-4xl mx-auto py-8 px-6 md:px-10'>
        <div className='bg-[var(--background)] p-6 rounded-xl shadow-lg border-l-4 border-[var(--primary)]'>
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
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div className='flex-1'>
              <h3 className='font-bold text-[var(--foreground)] mb-3 text-base'>
                Horarios de Atención
              </h3>
              <div className='grid md:grid-cols-2 gap-3 text-sm text-gray-700'>
                <div>
                  <p className='font-semibold text-[var(--primary)]'>Lunes a Viernes</p>
                  <p>8:00 AM - 8:00 PM</p>
                </div>
                <div>
                  <p className='font-semibold text-[var(--primary)]'>Sábados</p>
                  <p>9:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p className='font-semibold text-[var(--primary)]'>Domingos</p>
                  <p>10:00 AM - 4:00 PM</p>
                </div>
                <div>
                  <p className='font-semibold text-[var(--primary)]'>Chat en Vivo</p>
                  <p>24/7 disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className='bg-[var(--primary)] text-white text-center py-10 px-6'>
        <div className='max-w-4xl mx-auto'>
          <h3 className='text-2xl font-bold mb-3'>¿Aún tienes dudas?</h3>
          <p className='text-base leading-relaxed mb-5 opacity-95'>
            Nuestro equipo está listo para ayudarte. No dudes en contactarnos.
          </p>
          <button className='bg-[var(--background)] text-[var(--primary)] px-8 py-3 rounded-full font-bold text-base hover:bg-[var(--light-gray)] transition-colors duration-300 shadow-lg hover:shadow-xl'>
            Hablar con Soporte
          </button>
        </div>
      </section>
    </main>
  );
}
