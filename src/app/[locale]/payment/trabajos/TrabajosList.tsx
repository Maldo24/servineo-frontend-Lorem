import { useEffect, useState } from 'react';
import LoadingFallback from './LoadingFallback';
import PaymentMethods from '@/app/[locale]/payment/components/PaymentDemoAdaptado';

// Define el tipo de Job
interface Job {
  _id: string;
  title: string;
  description: string;
  fixerId: string;
  status: string;
  type: string;
  price: number;
  comment?: string;
}

// Define el tipo de props
interface TrabajosListProps {
  userId: string;
}

export default function TrabajosList({ userId }: TrabajosListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('📡 Obteniendo trabajos para el usuario:', userId);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs?userId=${userId}`);
        if (!res.ok) throw new Error('Error al obtener trabajos');
        const data = await res.json();
        console.log('✅ Trabajos recibidos:', data);
        setJobs(data);
      } catch (err) {
        console.error('❌ Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userId]);

  if (loading) return <LoadingFallback />;

  if (jobs.length === 0)
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-600'>
        No hay trabajos registrados para este usuario.
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-100 pt-20 px-4 flex flex-col items-center'>
      {/* Header */}
      <header className='fixed top-0 left-0 w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 shadow-md z-10 text-center'>
        <h1 className='text-2xl font-bold'>Mis Trabajos</h1>
      </header>

      <div className='w-full max-w-3xl mt-6'>
        <ul className='space-y-4'>
          {jobs.map((job) => {
            const status = job.status.toLowerCase();
            const isPending = status === 'pending';
            const isPaid = status === 'pagado';

            return (
              <li
                key={job._id}
                className={`p-5 rounded-2xl border transition shadow-sm hover:shadow-lg ${
                  isPending ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                }`}
              >
                <h2 className='text-lg font-semibold text-gray-800'>{job.title}</h2>
                <p className='text-gray-600'>{job.description}</p>
                <p className='text-gray-600'>
                  <span className='font-semibold text-gray-700'>FixerID:</span> {job.fixerId}
                </p>
                <p className='mt-1'>
                  <span className='font-semibold text-gray-700'>Estado:</span>{' '}
                  <span
                    className={`font-medium ${
                      isPaid ? 'text-green-600' : isPending ? 'text-red-600' : 'text-yellow-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </p>

                <p className='text-sm text-gray-500 mt-1'>
                  Tipo: {job.type} | Precio: Bs{job.price}
                </p>

                {job.comment && (
                  <p className='text-sm text-gray-400 mt-1'>
                    Comentario: &quot;{job.comment}&quot;
                  </p>
                )}

                {/* Botón de pagar si está pendiente */}
                {isPending && (
                  <button
                    onClick={() => setSelectedJob(job)}
                    className='mt-4 px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 active:scale-95 transition'
                  >
                    Pagar
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mostrar el modal de métodos de pago si hay un trabajo seleccionado */}
      {selectedJob && (
        <PaymentMethods
          amount={selectedJob.price}
          jobId={selectedJob._id}
          requesterId={userId}
          fixerId={selectedJob.fixerId}
          onClose={() => setSelectedJob(null)}
          onPaymentSuccess={async () => {
            const res = await fetch(`/api/jobs?userId=${userId}`);
            const data = await res.json();
            setJobs(data);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}
