'use client';
import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  qrDataUrl?: string | null;
  onNext: () => void;
  loading?: boolean;
  onRegenerate?: () => void;
  regenerating?: boolean;
}

export default function AuthenticatorQrModal({
  open,
  onClose,
  qrDataUrl,
  onNext,
  loading,
  onRegenerate,
  regenerating,
}: Props) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-40 flex items-center justify-center bg-black/40'>
      <div className='bg-white rounded-lg w-[480px] p-6 shadow-lg border'>
        <h3 className='text-lg font-semibold mb-3'>Configurar aplicación de autenticación</h3>

        <div className='text-sm text-gray-600 mb-4'>
          <ul className='list-disc ml-5'>
            <li>
              En la aplicación Google Authenticator, toca el icono <strong>+</strong>.
            </li>
            <li>
              Elige <strong>Escanear un código QR</strong>.
            </li>
          </ul>
        </div>

        {/* Contenedor principal del QR + botón de refrescar */}
        <div className='flex flex-col items-center justify-center py-4 gap-3'>
          <div className='relative'>
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt='QR 2FA'
                className={`w-48 h-48 object-contain rounded-lg transition-all duration-500
                  ${
                    regenerating
                      ? 'opacity-40 scale-95 shadow-[0_0_25px_rgba(79,70,229,0.35)] blur-[1px]'
                      : 'opacity-100 scale-100 shadow-sm'
                  }`}
              />
            ) : (
              <div className='w-48 h-48 flex items-center justify-center bg-gray-100 border rounded-lg text-gray-500 text-sm'>
                Cargando...
              </div>
            )}

            {/* Overlay “cool” mientras regenera */}
            {regenerating && (
              <div className='absolute inset-0 flex items-center justify-center rounded-lg pointer-events-none'>
                <div className='w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin' />
              </div>
            )}
          </div>

          {/* Botón de refrescar debajo, centrado */}
          {onRegenerate && (
            <button
              type='button'
              aria-label='Regenerar código QR'
              onClick={onRegenerate}
              disabled={regenerating || loading}
              className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            >
              <svg
                className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`}
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <path
                  strokeWidth='1.7'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4 4v6h6M20 20v-6h-6'
                />
                <path
                  strokeWidth='1.7'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M5 13a7 7 0 0 0 12 3M19 11A7 7 0 0 0 7 8'
                />
              </svg>
              <span>Regenerar código</span>
            </button>
          )}
        </div>

        <div className='flex justify-end gap-3 mt-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-md border text-sm bg-white text-gray-700'
          >
            Cancelar
          </button>
          <button
            onClick={onNext}
            className='px-4 py-2 rounded-md text-sm bg-indigo-600 text-white disabled:opacity-60'
            disabled={!qrDataUrl || loading || regenerating}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
