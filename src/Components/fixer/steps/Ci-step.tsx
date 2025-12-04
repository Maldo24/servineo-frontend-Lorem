'use client';

import { Card } from '@/Components/Card';
import { AlertCircle, CreditCard } from 'lucide-react';

interface CIStepProps {
  ci: string;
  onCIChange: (ci: string) => void;
  error?: string;
}

export function CIStep({ ci, onCIChange, error }: CIStepProps) {
  const handleChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, '').slice(0, 10);
    onCIChange(sanitized);
  };

  return (
    <Card title='Registrar CI'>
      <div className='space-y-3'>
        <div className='space-y-1'>
          <label className='flex items-center gap-2 text-sm text-gray-700'>
            <CreditCard className='h-4 w-4 text-blue-600' />
            Cédula de Identidad <span className='text-red-600'>*</span>
          </label>
          <input
            value={ci}
            onChange={(e) => handleChange(e.target.value)}
            placeholder='Ej: 1234567890'
            maxLength={10}
            className='w-full rounded-full border border-transparent bg-gray-200 px-4 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-gray-100 focus:ring-2 focus:ring-blue-400 transition-all'
          />
          <p className='text-xs text-gray-600'>Solo números, máximo 10 dígitos ({ci.length}/10)</p>
        </div>
        {error && (
          <div className='flex items-center gap-1 text-sm text-red-600'>
            <AlertCircle className='h-4 w-4' />
            <span>{error}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
