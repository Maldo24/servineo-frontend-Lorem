import Link from 'next/link';

export default function Home() {
  return (
    <main className='min-h-screen bg-white flex items-center justify-center'>
      <div className='text-center space-y-8'>
        <h1 className='text-3xl sm:text-4xl font-semibold text-gray-900'>Servineo</h1>
        <div className='flex items-center justify-center gap-4'>
          <Link
            href='/fixers'
            className='px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            Fixers
          </Link>
          <Link
            href='/requesters'
            className='px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            Requesters
          </Link>
          <Link
            href='/tests'
            className='px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            Tests
          </Link>
        </div>
      </div>
    </main>
  );
}
