'use client';
import { useState } from 'react';
import ActivateOfferModal from '@/app/components/fixers/ActivateOfferModal';

export default function RequestersLanding() {
  const offerId = '68eedc4ddf120f15a959ace8';
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = useState(false);

  const handleConfirm = (newStatus: boolean, offerId: string) => {
    setIsActive(newStatus);
    setOpen(false);
    console.log(`Oferta ${offerId} actualizada a ${newStatus ? 'active' : 'inactive'}`);
  };

  return (
    <main className='min-h-screen bg-white flex items-center justify-center'>
      <div className='text-center space-y-8'>
        <button
          onClick={() => setOpen(true)}
          className='px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition'
        >
          {isActive ? 'Desactivar oferta' : 'Activar oferta'}
        </button>
      </div>

      <ActivateOfferModal
        open={open}
        isActive={isActive}
        offerId={offerId}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </main>
  );
}
