'use client';
import React from 'react';

interface Props {
  onClick: () => void;
}

export default function AuthenticatorButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className='flex items-center gap-3 px-5 py-3 border rounded-lg shadow-sm hover:shadow-md transition
                 bg-white text-gray-700 border-gray-200'
      aria-label='Configurar Authenticator'
    >
      <span className='w-8 h-8 flex items-center justify-center bg-blue-50 rounded-full'>
        {/* icon placeholder */}
        <svg className='w-5 h-5 text-blue-600' viewBox='0 0 24 24' fill='none'>
          <path
            d='M12 2v6'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <rect x='3' y='8' width='18' height='13' rx='2' stroke='currentColor' strokeWidth='1.5' />
        </svg>
      </span>
      <span className='text-sm font-medium'>Authenticator</span>
    </button>
  );
}
