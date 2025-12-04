'use client';
import { useParams } from 'next/navigation';
import FixerProfile from './fixer-profile';
import { ClientRatings } from './components';
import './theme.css';

export default function ProfilePage() {
  const { id } = useParams();

  if (!id) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='bg-white p-6 rounded-lg shadow'>ID de usuario no proporcionado.</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <header className='bg-white border-b border-gray-300 w-full fixed top-0 left-0 z-50'>
        <div className='px-6 py-4'>
          <h1 className='text-xl font-semibold text-gray-900'>Servineo</h1>
        </div>
      </header>

      <main className='flex-grow pt-20 px-6 pb-12'>
        <div className='max-w-4xl mx-auto space-y-8'>
          <FixerProfile userId={id as string} />

          <section
            aria-labelledby='ratings-heading'
            className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'
          >
            <div className='flex items-center justify-between mb-4'>
              <h2 id='ratings-heading' className='text-2xl font-semibold tracking-tight'>
                Rating Details
              </h2>
            </div>

            <div>
              <ClientRatings fixerId={id as string} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
