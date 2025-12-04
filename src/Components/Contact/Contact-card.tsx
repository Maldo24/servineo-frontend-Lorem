'use client';

import { MessageCircle, Phone, Copy, Mail } from 'lucide-react';
import { useState } from 'react';

interface ContactCardProps {
  name: string;
  whatsapp: string;
  email?: string;
  phone?: string;
  city?: string;
}

export function ContactCard({ name, whatsapp, email, phone, city }: ContactCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className='bg-gradient-to-br from-card via-card to-green-50/20 border-2 border-border rounded-2xl p-6 space-y-4 shadow-lg hover:shadow-xl transition-all'>
      <div className='flex items-start justify-between mb-4'>
        <div>
          <h3 className='text-lg font-bold text-foreground'>{name}</h3>
          {city && <p className='text-sm text-muted-foreground mt-1'>{city}</p>}
        </div>
      </div>

      {/* WhatsApp Contact */}
      <div className='flex items-center justify-between p-3 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-all'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center'>
            <MessageCircle className='w-5 h-5 text-white' />
          </div>
          <div>
            <p className='text-xs text-muted-foreground font-medium'>WhatsApp</p>
            <p className='text-sm font-semibold text-foreground'>{whatsapp}</p>
          </div>
        </div>
        <button
          onClick={() => handleCopy(whatsapp, 'whatsapp')}
          className={`p-2 rounded-lg transition-all ${
            copiedField === 'whatsapp'
              ? 'bg-green-300 text-green-800'
              : 'hover:bg-green-200 text-green-700'
          }`}
          title='Copiar'
        >
          <Copy className='w-4 h-4' />
        </button>
      </div>

      {/* Phone Contact */}
      {phone && (
        <div className='flex items-center justify-between p-3 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-all'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center'>
              <Phone className='w-5 h-5 text-white' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>Teléfono</p>
              <p className='text-sm font-semibold text-foreground'>{phone}</p>
            </div>
          </div>
          <button
            onClick={() => handleCopy(phone, 'phone')}
            className={`p-2 rounded-lg transition-all ${
              copiedField === 'phone'
                ? 'bg-blue-300 text-blue-800'
                : 'hover:bg-blue-200 text-blue-700'
            }`}
            title='Copiar'
          >
            <Copy className='w-4 h-4' />
          </button>
        </div>
      )}

      {/* Email Contact */}
      {email && (
        <div className='flex items-center justify-between p-3 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-all'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center'>
              <Mail className='w-5 h-5 text-white' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground font-medium'>Email</p>
              <p className='text-sm font-semibold text-foreground truncate'>{email}</p>
            </div>
          </div>
          <button
            onClick={() => handleCopy(email, 'email')}
            className={`p-2 rounded-lg transition-all ${
              copiedField === 'email'
                ? 'bg-purple-300 text-purple-800'
                : 'hover:bg-purple-200 text-purple-700'
            }`}
            title='Copiar'
          >
            <Copy className='w-4 h-4' />
          </button>
        </div>
      )}
    </div>
  );
}
