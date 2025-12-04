'use client';
import { useState } from 'react';
import RateJobModal from './RateJobModal';

export default function RateJobButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='bg-[#2BDDE0] hover:bg-[#5E2BE0] text-white font-medium py-2 px-4 rounded-md transition'
      >
        Rate Job
      </button>

      <RateJobModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
