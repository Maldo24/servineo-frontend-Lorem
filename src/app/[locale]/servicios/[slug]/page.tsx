import { services } from '../data';
import Link from 'next/link';
import Image from 'next/image';

export default async function ServicioDetalle({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className='min-h-screen pt-16 px-4'>
        <div className='max-w-3xl mx-auto text-center'>
          <h1 className='text-3xl font-bold mb-4'>Servicio no encontrado</h1>
          <p className='text-gray-600 mb-6'>El servicio solicitado no existe o ha sido removido.</p>
          <Link href='/servicios' className='text-blue-600 hover:underline'>
            Volver a Servicios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white pt-16'>
      <section className='w-full py-12 px-4 bg-gradient-to-b from-primary to-blue-800 text-white'>
        <div className='max-w-5xl mx-auto md:grid md:grid-cols-2 md:items-center md:gap-8'>
          <div>
            <div className='flex items-center gap-4'>
              <div className='text-5xl'>{service.icon}</div>
              <h1 className='text-4xl md:text-5xl font-bold'>{service.name}</h1>
            </div>
            <p className='mt-4 text-lg opacity-90 max-w-3xl'>{service.description}</p>
          </div>
          <div className='mt-8 md:mt-0 flex justify-center'>
            <div className='relative w-[280px] h-[180px] sm:w-[360px] sm:h-[220px] md:w-[420px] md:h-[260px] rounded-xl overflow-hidden shadow-lg'>
              <Image
                src={service.image || 'assets/fallback-image.svg'}
                alt={`Imagen ilustrativa de ${service.name}`}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 360px, 420px'
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <section className='w-full py-12 px-4'>
        <div className='max-w-5xl mx-auto space-y-10'>
          <div className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
            <h2 className='text-2xl font-semibold mb-4'>Resumen</h2>
            <p className='text-gray-700 mb-4'>
              Este servicio tiene una demanda aproximada del {service.demand}% en la plataforma.
            </p>
            <div className='w-full bg-gray-200 rounded-full h-2 mb-6'>
              <div
                className='bg-blue-600 h-2 rounded-full'
                style={{ width: `${service.demand}%` }}
              />
            </div>
            <div className='flex gap-3'>
              <Link
                href='/servicios'
                className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg'
              >
                Volver a servicios
              </Link>
              <Link
                href={`/buscar?servicio=${service.slug}`}
                className='border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-6 rounded-lg'
              >
                Buscar fixers para {service.name}
              </Link>
            </div>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
            <h2 className='text-2xl font-semibold mb-4'>Qué incluye</h2>
            <ul className='list-disc list-inside text-gray-700 space-y-2'>
              <li>Diagnóstico y asesoramiento inicial</li>
              <li>Mano de obra calificada</li>
              <li>Uso de herramientas adecuadas</li>
              <li>Limpieza básica del área de trabajo</li>
              <li>Garantía mínima de 30 días en la mano de obra</li>
            </ul>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
            <h2 className='text-2xl font-semibold mb-4'>Proceso típico</h2>
            <ol className='list-decimal list-inside text-gray-700 space-y-2'>
              <li>Solicitud y descripción del trabajo</li>
              <li>Evaluación y presupuesto estimado</li>
              <li>Ejecución del servicio</li>
              <li>Verificación y pruebas</li>
              <li>Cierre y recomendaciones de mantenimiento</li>
            </ol>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
            <h2 className='text-2xl font-semibold mb-4'>Precios orientativos</h2>
            <p className='text-gray-700 mb-3'>
              Los precios pueden variar según alcance y materiales:
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='border rounded-lg p-4'>
                <p className='font-semibold'>Trabajo básico</p>
                <p className='text-sm text-gray-600'>Desde Bs. 80 a Bs. 150</p>
              </div>
              <div className='border rounded-lg p-4'>
                <p className='font-semibold'>Trabajo estándar</p>
                <p className='text-sm text-gray-600'>Desde Bs. 150 a Bs. 350</p>
              </div>
              <div className='border rounded-lg p-4'>
                <p className='font-semibold'>Trabajo complejo</p>
                <p className='text-sm text-gray-600'>Desde Bs. 350 a Bs. 800+</p>
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
            <h2 className='text-2xl font-semibold mb-4'>Preguntas frecuentes</h2>
            <div className='space-y-4'>
              <details className='border rounded-lg p-4'>
                <summary className='cursor-pointer font-medium'>
                  ¿Cuál es el tiempo de respuesta?
                </summary>
                <p className='mt-2 text-gray-700'>
                  Usualmente dentro de 24 horas, dependiendo de la demanda.
                </p>
              </details>
              <details className='border rounded-lg p-4'>
                <summary className='cursor-pointer font-medium'>
                  ¿Los materiales están incluidos?
                </summary>
                <p className='mt-2 text-gray-700'>
                  Depende del servicio; se puede cotizar con o sin materiales.
                </p>
              </details>
              <details className='border rounded-lg p-4'>
                <summary className='cursor-pointer font-medium'>¿Ofrecen garantía?</summary>
                <p className='mt-2 text-gray-700'>Garantía mínima de 30 días en la mano de obra.</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
