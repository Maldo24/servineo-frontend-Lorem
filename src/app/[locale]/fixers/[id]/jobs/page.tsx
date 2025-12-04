import React from 'react';
import { Roboto } from 'next/font/google';
import { getJobsByFixerId } from '@/services/jobs';
import type { Job } from '@/types/job';
import JobsList from '@/app/components/fixers/JobsList';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  let jobs: Job[] = [];
  try {
    jobs = await getJobsByFixerId(id);
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[jobs/page] fixer ${id} -> ${jobs.length} jobs`);
    }
  } catch (err) {
    console.error('Failed to load jobs:', err);
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-auto w-full max-w-5xl p-4 sm:p-6'>
        <h1
          className={`${roboto.className} text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 text-center`}
        >
          Appointments
        </h1>
        <JobsList jobs={jobs} />
      </div>
    </div>
  );
}
