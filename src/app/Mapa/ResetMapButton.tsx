'use client';
import { useState } from 'react';

interface ResetMapButtonProps {
  onReset: () => void;
  isOnline?: boolean; // opcional
}

export default function ResetMapButton({ onReset, isOnline = true }: ResetMapButtonProps) {
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    if (!isOnline) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    onReset();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className='absolute top-3 right-3 z-[1000] 
                   bg-gradient-to-r from-[#4B3FE8] to-[#3FD6D6]
                   hover:from-[#3B7BDD] hover:to-[#2B6AE0]
                   text-white font-semibold py-2 px-5 rounded-xl
                   shadow-lg hover:shadow-[#3FD6D6]/40 
                   transition-all duration-300 ease-in-out
                   border border-white/20 backdrop-blur-sm'
      >
        🔄 Reiniciar Mapa
      </button>

      {showMessage && (
        <div
          className='absolute top-16 left-1/2 -translate-x-1/2 z-[1000] text-white font-bold px-6 py-3 rounded-xl shadow-lg text-center transition-all duration-700 ease-in-out'
          style={{
            pointerEvents: 'none',
            backgroundColor: '#E74C3C',
            transform: showMessage ? 'translateY(0)' : 'translateY(-20px)',
            opacity: showMessage ? 1 : 0,
          }}
        >
          ⚠️ Sin conexión..
        </div>
      )}
    </>
  );
}
