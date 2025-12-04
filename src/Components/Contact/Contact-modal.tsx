'use client';

import { X, MessageCircle, Phone, Mail, Share2 } from 'lucide-react';
import { WhatsAppButton } from './Whasapp-button';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  whatsapp: string;
  email?: string;
  phone?: string;
  city?: string;
  message?: string;
}

export function ContactModal({
  isOpen,
  onClose,
  name,
  whatsapp,
  email,
  phone,
  city,
  message = `Hola ${name}, encontré tu perfil en FIXER y me interesaría trabajar contigo.`,
}: ContactModalProps) {
  if (!isOpen) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contactar con ${name}`,
          text: `Contacta a ${name} - Profesional de servicios en ${city || 'FIXER'}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in'>
      <div className='bg-card rounded-2xl max-w-md w-full shadow-2xl border-2 border-border animate-scale-in'>
        {/* Header */}
        <div className='bg-gradient-to-r from-primary to-blue-600 p-6 flex items-center justify-between rounded-t-xl'>
          <div>
            <h2 className='text-2xl font-bold text-primary-foreground'>{name}</h2>
            {city && <p className='text-sm text-primary-foreground/80 mt-1'>{city}</p>}
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-white/20 rounded-lg transition-all hover:rotate-90 duration-300'
          >
            <X className='w-5 h-5 text-primary-foreground' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 space-y-4'>
          {/* Main WhatsApp CTA */}
          <WhatsAppButton phone={whatsapp} message={message} className='w-full justify-center' />

          {/* Contact Options Grid */}
          <div className='grid grid-cols-2 gap-3'>
            {phone && (
              <a
                href={`tel:${phone}`}
                className='flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg text-blue-700 font-medium transition-all text-sm'
              >
                <Phone className='w-4 h-4' />
                Llamar
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className='flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg text-purple-700 font-medium transition-all text-sm'
              >
                <Mail className='w-4 h-4' />
                Email
              </a>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className='w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-border rounded-lg text-foreground hover:bg-muted transition-all font-medium text-sm'
          >
            <Share2 className='w-4 h-4' />
            Compartir
          </button>

          {/* Contact Info Display */}
          <div className='pt-4 border-t border-border/50 space-y-2'>
            <div className='flex items-center gap-2 text-sm'>
              <MessageCircle className='w-4 h-4 text-green-600' />
              <span className='text-muted-foreground'>{whatsapp}</span>
            </div>
            {phone && (
              <div className='flex items-center gap-2 text-sm'>
                <Phone className='w-4 h-4 text-blue-600' />
                <span className='text-muted-foreground'>{phone}</span>
              </div>
            )}
            {email && (
              <div className='flex items-center gap-2 text-sm'>
                <Mail className='w-4 h-4 text-purple-600' />
                <span className='text-muted-foreground truncate'>{email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
