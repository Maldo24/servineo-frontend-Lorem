'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '@/types/job';
import RequestedJob from './RequestedJob';
import RegisterJobModal from './RegisterJobModal';
import CreatePromoModal from './CreatePromoModal';
import { useState } from 'react';
import { createPromotion } from '@/services/promotions';

export default function JobsList({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isCreatePromoModalOpen, setIsCreatePromoModalOpen] = useState<boolean>(false);
  const [idJob, setIdJob] = useState<string>('');
  const [fixerId, setFixerId] = useState<string>('');

  const onSavePromo = async (promotion: {
    title: string;
    description: string;
    offerId: string;
    fixerId: string;
    price: string;
  }) => {
    const result = await createPromotion({
      title: promotion.title,
      description: promotion.description,
      offerId: promotion.offerId,
      price: promotion.price,
      fixerId: promotion.fixerId,
    });

    if (result) {
      // Refresh the job list to show updated data
      router.refresh();
    }
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className='rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500'>
        No appointments yet.
      </div>
    );
  }
  return (
    <div className='space-y-3'>
      <RegisterJobModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        id={idJob}
      />
      <CreatePromoModal
        isOpen={isCreatePromoModalOpen}
        onClose={() => setIsCreatePromoModalOpen(false)}
        onSave={onSavePromo}
        id={idJob}
        fixerId={fixerId}
      />

      {jobs.map((job) => (
        <RequestedJob
          key={job._id}
          name={job.requesterId || 'Requester'}
          jobTitle={job.title}
          schedule={formatSchedule(job.createdAt)}
          state={job.status}
          onAppointmentDetails={() => router.push(`/requested-jobs/${job._id}`)}
          onRegisterJob={() => {
            setIsRegisterModalOpen(true);
            setIdJob(job._id);
          }}
          onViewPromos={() => {
            router.push(`/promotions/${job._id}`);
          }}
          onCreatePromo={() => {
            setIsCreatePromoModalOpen(true);
            setIdJob(job._id);
            setFixerId(job.fixerId);
          }}
        />
      ))}
    </div>
  );
}

function formatSchedule(createdAt: string) {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return '';
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${d.toLocaleDateString()} ${time}`;
}
