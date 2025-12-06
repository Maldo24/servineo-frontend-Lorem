'use client';
import { useState } from 'react';

interface ResetMapButtonProps {
  onReset: () => void;
  isOnline?: boolean; // opcional
}

export default function ResetMapButton({ onReset, isOnline = true }: ResetMapButtonProps) {
  const [showMessage, setShowMessage] = useState(false);

  const palette = {
    whatsappBg: '#2B6AE0',
    whatsappHover: '#3B7BDD',
    buttonText: '#FFFFFF',
  };

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
        style={{
          background: palette.whatsappBg,
          color: palette.buttonText,
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '13px',
          textAlign: 'center',
          padding: '8px 0',
          flex: 1,
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.3s',
          fontFamily: "'Roboto', sans-serif",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = palette.whatsappHover;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = palette.whatsappBg;
        }}
        className='absolute top-3 right-3 z-[1000] w-[160px]'
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
