'use client';
import React, { useState } from 'react';

interface Props {
  open: boolean;
  isActive: boolean;
  offerId: string;
  onConfirm: (newStatus: boolean, offerId: string) => void;
  onClose: () => void;
}

export default function ActivateOfferModal({ open, isActive, offerId, onConfirm, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const nextStatus = !isActive;

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/offers/${offerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: nextStatus ? 'active' : 'inactive' }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || 'Error desconocido');
        setLoading(false);
        return;
      }

      onConfirm(nextStatus, offerId);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
      <div className='bg-white rounded-xl p-6 shadow-lg w-80'>
        <h2 className='text-black font-semibold mb-4'>
          {nextStatus ? 'Activar oferta' : 'Desactivar oferta'}
        </h2>

        <p className='text-gray-800 mb-4'>
          ¿Estás seguro de que quieres {nextStatus ? 'activar' : 'desactivar'} esta oferta?
        </p>

        {error && <div className='mb-4 text-sm text-red-700 bg-red-100 p-2 rounded'>{error}</div>}

        <div className='flex justify-end gap-3'>
          <button
            className='px-4 py-2 rounded-lg bg-black hover:bg-gray-300'
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            className={`px-4 py-2 rounded-lg text-white ${
              nextStatus ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
            }`}
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? 'Procesando...' : nextStatus ? 'Activar' : 'Desactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}
