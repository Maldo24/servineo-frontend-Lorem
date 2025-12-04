import Link from 'next/link';

export default function FixersLanding() {
  return (
    <main className='min-h-screen bg-white flex items-center justify-center'>
      <div className='text-center space-y-8'>
        <h1 className='text-3xl sm:text-4xl font-semibold text-gray-900'>Fixers</h1>
        <div className='flex items-center justify-center gap-4'>
          <Link
            href='/fixers/68e87a9cdae3b73d8040102f/jobs'
            className='px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            View Jobs
          </Link>
          <Link
            href='/profile/68e87a9cdae3b73d8040102f'
            className='px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition'
          >
            View Profile
          </Link>
          <Link
            href='/fixers/68e87a9cdae3b73d8040102f/appointments'
            className='px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            Appointments
          </Link>
        </div>
      </div>
    </main>
  );
}
