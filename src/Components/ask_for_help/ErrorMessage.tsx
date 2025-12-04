'use client';
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    // Contenedor fijo: se superpone a toda la página
    <div
      className='fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-[100]'
      onClick={onClose}
    >
      <div
        className='bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center'>
          <svg
            className='w-8 h-8 text-[#2B31E0] mr-3'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <h3 className='text-xl font-semibold text-gray-800'>Error de Conexión</h3>
        </div>

        <p className='text-gray-600 mt-4'>{message}</p>

        <button
          onClick={onClose}
          className='mt-6 w-full bg-[#2B31E0] hover:bg-[#2B6AE0] text-white font-bold py-2 px-4 rounded transition-colors'
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
