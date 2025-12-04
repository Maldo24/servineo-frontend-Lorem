'use client';
import JobRequestModal from './ModalFormMap/JobRequestModal';
import { useState } from 'react';

export default function JobRequestPage() {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const fakeFixerId = '507f1f77bcf86cd799439011';
  const fakeOfferId = '691488a21fc4811a4400e6ac';
  return (
    <main className='min-h-screen bg-white flex items-center justify-center'>
      <div className='text-center space-y-8'>
        <h1 className='text-3xl sm:text-4xl font-semibold text-gray-900'>
          Detalle de oferta de trabajo
        </h1>
        <div className='flex items-center justify-center gap-4'>
          <button
            onClick={() => setIsMapModalOpen(true)}
            className='px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition'
          >
            Solicitar trabajo
          </button>
        </div>
      </div>
      <JobRequestModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSubmit={(data) => console.log('Solicitud enviada:', data)}
        fixerId={fakeFixerId}
        offerId={fakeOfferId}
      />
    </main>
  );
}
