'use client';
import React, { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  onFinish?: () => void; // nuevo: callback al cerrar tras éxito
  loading?: boolean;
}

/**
 * Modal bonito con confirmación y mensaje de éxito.
 */
export default function ConfirmDisableModal({
  open,
  onCancel,
  onConfirm,
  onFinish,
  loading,
}: Props) {
  const [done, setDone] = useState(false);

  // Reinicia el estado cada vez que se abre
  useEffect(() => {
    if (open) setDone(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white rounded-lg w-[560px] p-6 shadow-lg border transition-all duration-200'>
        {!done ? (
          <>
            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0'>
                <div className='w-12 h-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100'>
                  <svg
                    className='w-6 h-6 text-red-600'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                  >
                    <path
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2'
                    />
                  </svg>
                </div>
              </div>

              <div className='flex-1'>
                <h3 className='text-lg font-semibold'>Desactivar autenticador</h3>
                <p className='text-sm text-gray-600 mt-1'>
                  ¿Estás seguro de que quieres desactivar la autenticación en dos pasos? Esto
                  eliminará tu clave secreta y los códigos de recuperación asociados.
                </p>

                <div className='mt-5 flex justify-end gap-3'>
                  <button
                    onClick={onCancel}
                    className='px-4 py-2 rounded-md border text-sm bg-white text-gray-700'
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      await onConfirm();
                      setDone(true);
                    }}
                    className='px-4 py-2 rounded-md text-sm bg-red-600 text-white'
                    disabled={loading}
                  >
                    {loading ? 'Desactivando...' : 'Desactivar 2FA'}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          // ✅ Mensaje de éxito
          <div className='flex flex-col items-center justify-center text-center py-6'>
            <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4'>
              <svg
                className='w-6 h-6 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>
              Autenticador desactivado correctamente
            </h3>
            <p className='text-sm text-gray-600 mb-6'>
              Ya puedes volver a configurar la autenticación cuando quieras desde esta misma página.
            </p>
            <button
              onClick={() => {
                onCancel(); // cierra modal
                if (onFinish) onFinish(); // notifica al padre para limpiar estado
              }}
              className='px-4 py-2 rounded-md text-sm bg-indigo-600 text-white'
            >
              Aceptar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
