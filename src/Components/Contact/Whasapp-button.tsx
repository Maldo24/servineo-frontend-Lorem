// src/Components/Contact/WhatsAppButton.tsx
'use client';

import { Phone } from 'lucide-react';

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  className?: string;
}

export function WhatsAppButton({ phone, message = '', className = '' }: WhatsAppButtonProps) {
  const handleClick = () => {
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors ${className}`}
    >
      <Phone className='w-4 h-4' />
      <span>Contactar por WhatsApp</span>
    </button>
  );
}
