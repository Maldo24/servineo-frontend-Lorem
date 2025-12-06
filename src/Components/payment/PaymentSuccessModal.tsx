// src/Components/payment/PaymentSuccessModal.tsx
// Modal de confirmación exitosa de pago

import React from 'react';
import { PaymentSuccessModalProps } from '../../utils/types';

export default function PaymentSuccessModal({ onClose }: PaymentSuccessModalProps) {
  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
      <div className='bg-black rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 bg-[#16A34A] rounded-full mb-4'>
          <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
          </svg>
        </div>

        <h2 className='text-2xl font-bold text-white mb-2'>✓ Código correcto! Pago confirmado</h2>

        <button
          onClick={onClose}
          className='mt-6 px-8 py-3 bg-[#2B31E0] hover:bg-[#2B6AE0] text-white text-lg font-semibold rounded transition-colors w-full'
        >
          OK
        </button>
      </div>
    </div>
  );
}
