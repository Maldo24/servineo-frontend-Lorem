'use client';
import { useState } from 'react';

interface LocationButtonProps {
  onLocationFound: (lat: number, lng: number) => void;
}

export default function LocationButton({ onLocationFound }: LocationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showMsg, setShowMsg] = useState(false);

  const handleClick = () => {
    setErrorMsg(null);
    setShowMsg(false);

    if (!navigator.geolocation) {
      showMessage('❌ Tu navegador no soporta geolocalización.');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationFound(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            showMessage('🚫 Permiso denegado para acceder a la ubicación.');
            break;
          case error.POSITION_UNAVAILABLE:
            showMessage('⚠️ No se pudo obtener tu ubicación. Intenta nuevamente.');
            break;
          case error.TIMEOUT:
            showMessage('⏳ La solicitud de ubicación ha tardado demasiado.');
            break;
          default:
            showMessage('❌ Ocurrió un error al obtener la ubicación.');
        }
      },
    );
  };

  const showMessage = (msg: string) => {
    setErrorMsg(msg);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 4000); // desaparece después de 4 segundos
  };

  return (
    <div className='flex items-start gap-3 relative'>
      {/* Botón de ubicación */}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2
          bg-white rounded-full shadow-lg border border-gray-200
          text-[#2B6AE0] font-medium
          transition duration-300 transform
          hover:shadow-2xl hover:bg-[#3FD6D6]/20 hover:scale-105 active:scale-95
          ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        title='Centrar en mi ubicación'
      >
        {loading ? (
          <span>📡 Obteniendo ubicación...</span>
        ) : (
          <>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-[#2B6AE0]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z'
              />
            </svg>
            Tu ubicación
          </>
        )}
      </button>

      {/* Mensaje al lado del botón con animación suave */}
      {errorMsg && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-md bg-[#4B3FE8] text-white text-sm break-words max-w-md
          transition-all duration-500 ease-in-out
          ${showMsg ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-6 -translate-y-2'}`}
        >
          {/* Icono map-pin tachado */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-[#FF6B6B] transform rotate-180'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15 10.5c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19.428 15.341C17.53 19.78 12 22 12 22s-5.53-2.22-7.428-6.659C3.12 11.61 12 2 12 2s8.88 9.61 7.428 13.341z'
            />
            <line x1='3' y1='3' x2='21' y2='21' stroke='red' strokeWidth={2} />
          </svg>

          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
