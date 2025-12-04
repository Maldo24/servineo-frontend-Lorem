'use client';
import { useParams } from 'next/navigation';
import { apiUrl } from '@/config/api';
import { useEffect, useState } from 'react';
import RegisterJobModal from '@/app/components/fixers/RegisterJobModal';

interface Job {
  id: string;
  client: string;
  description: string;
  schedule: string;
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setJob({ id: '', client: '', description: '', schedule: '' });
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        const res = await fetch(apiUrl(`api/requested-jobs/${id}`));
        if (!res.ok) throw new Error('Job not found');
        const data = await res.json();

        setJob({
          id: data._id ?? '',
          client: data.title ?? '',
          description: data.description ?? '',
          schedule: data.createdAt ? new Date(data.createdAt).toLocaleTimeString() : '',
        });
      } catch (error) {
        console.error('Error fetching job:', error);
        setJob({ id: '', client: '', description: '', schedule: '' });
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <main className='h-screen flex items-center justify-center text-gray-500 bg-white'>
        Loading job details...
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50 flex flex-col'>
      <header className='w-full bg-white shadow-sm p-4 flex justify-between items-center border-b'>
        <h1 className='text-2xl font-semibold text-gray-800'>Servineo</h1>
      </header>

      <section className='flex-1 p-6'>
        <h2 className='text-lg font-semibold text-gray-700 mb-4 border-b pb-2'>
          Appointment Details
        </h2>

        <div className='flex items-center mb-6'>
          <div className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white mr-3'>
            👤
          </div>
          <p className='font-medium text-gray-700 text-lg'>{job?.client}</p>
        </div>

        <div className='mb-6'>
          <p className='font-semibold text-gray-700 mb-1'>Description:</p>
          <p className='text-gray-600'>{job?.description}</p>
        </div>

        <div className='mb-12'>
          <p className='font-semibold text-gray-700 mb-1'>Scheduled appointment time:</p>
          <p className='text-gray-600'>{job?.schedule}</p>
        </div>
      </section>

      <footer className='w-full bg-white border-t p-4 flex justify-end'>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700'
        >
          Register job
        </button>
      </footer>

      <RegisterJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={job?.id ?? ''}
      />
    </main>
  );
}
