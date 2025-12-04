'use client';
import React, { useEffect, useState } from 'react';
import { apiUrl } from '@/config/api';
import RateJobModal from '@/app/components/RateJobModal';

interface Job {
  id: string;
  name: string;
  date: string;
  status: string;
}

const JobsGrid = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(apiUrl('api/jobs/completed'))
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
      })
      .catch((err) => {
        console.error('Error fetching jobs:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className='h-screen flex items-center justify-center text-gray-500 bg-white'>
        Loading completed jobs...
      </main>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen bg-white py-8 px-4'>
      <h1 className='text-3xl font-handwritten text-center mb-8 text-black'>Servineo</h1>

      <div className='border rounded-lg p-3 inline-block mb-6'>
        <span className='italic font-semibold text-lg text-black'>Completed jobs grid</span>
      </div>

      {jobs.length === 0 ? (
        <div className='text-center text-gray-500 italic py-10 border rounded-lg w-full max-w-3xl'>
          No completed jobs found.
        </div>
      ) : (
        <div className='w-full max-w-3xl border rounded-lg p-4 bg-white shadow-inner overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
          <div className='flex flex-col gap-4'>
            {jobs.map((job) => (
              <div
                key={job.id}
                className='flex justify-between items-center border rounded-xl p-4 bg-white shadow-sm border-green-500'
              >
                <div className='flex-1 min-w-0'>
                  <p className='italic font-medium text-black truncate'>{job.name}</p>
                  <p className='italic text-sm text-gray-500 mt-1'>Date: {job.date}</p>
                </div>

                <div className='flex-shrink-0 mx-4 text-center'>
                  <p className='text-green-500 font-semibold capitalize'>{job.status}</p>
                </div>

                <div className='flex-shrink-0'>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className='border rounded-lg px-4 py-2 text-white bg-[#1AA7ED] hover:bg-[#178AC3] transition-colors'
                  >
                    Rate job
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <RateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default JobsGrid;
