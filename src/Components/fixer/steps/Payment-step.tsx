'use client';

import type React from 'react';

import { Card } from '@/Components/Card';
import { Banknote, CreditCard, QrCode, AlertCircle } from 'lucide-react';

export type PaymentMethod = 'cash' | 'qr' | 'card';

interface PaymentStepProps {
  payments: PaymentMethod[];
  accountInfo: string;
  onTogglePayment: (method: PaymentMethod) => void;
  onAccountInfoChange: (info: string) => void;
  paymentsError?: string;
  accountError?: string;
}

const PAYMENT_CONFIG: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
  cash: { label: 'Efectivo', icon: <Banknote className='h-4 w-4' /> },
  qr: { label: 'QR', icon: <QrCode className='h-4 w-4' /> },
  card: { label: 'Tarjeta', icon: <CreditCard className='h-4 w-4' /> },
};

export function PaymentStep({
  payments,
  accountInfo,
  onTogglePayment,
  onAccountInfoChange,
  paymentsError,
  accountError,
}: PaymentStepProps) {
  const needsAccount = payments.includes('qr') || payments.includes('card');

  const handleAccountChange = (value: string) => {
    // Solo permitir números y limitar a 34 caracteres (máximo para CBU/IBAN)
    const numericOnly = value.replace(/\D/g, '').slice(0, 34);
    onAccountInfoChange(numericOnly);
  };

  const getAccountType = () => {
    const length = accountInfo.length;
    if (length === 22) return 'CBU';
    if (length === 24) return 'IBAN';
    if (length > 0 && length < 22) return 'Número incompleto';
    if (length > 24) return 'Número demasiado largo';
    return '';
  };

  return (
    <Card title='Métodos de pago aceptados'>
      <div className='space-y-4'>
        <div className='flex flex-wrap gap-2'>
          {(['cash', 'qr', 'card'] as const).map((m) => (
            <button
              key={m}
              type='button'
              onClick={() => onTogglePayment(m)}
              className={
                'rounded-full px-4 py-2 text-sm transition-all flex items-center gap-2 ' +
                (payments.includes(m)
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300')
              }
            >
              {PAYMENT_CONFIG[m].icon}
              {PAYMENT_CONFIG[m].label}
            </button>
          ))}
        </div>

        {needsAccount && (
          <div className='space-y-2 animate-fade-in'>
            <label className='text-sm text-gray-800'>Nro de Cuenta para recibir pagos</label>
            <input
              value={accountInfo}
              onChange={(e) => handleAccountChange(e.target.value)}
              placeholder='Ingrese solo números de su cuenta'
              maxLength={34}
              className='w-full rounded-full bg-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition-all'
            />
            <div className='flex justify-between items-center px-2'>
              <p className='text-xs text-gray-600'>
                Solo números, máximo 34 caracteres ({accountInfo.length}/34)
              </p>
              <span
                className={`text-xs ${
                  accountInfo.length === 22 || accountInfo.length === 24
                    ? 'text-green-600 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {getAccountType()}
              </span>
            </div>
          </div>
        )}

        {paymentsError && (
          <div className='flex items-center gap-1 text-sm text-red-600'>
            <AlertCircle className='h-4 w-4' />
            <span>{paymentsError}</span>
          </div>
        )}
        {accountError && (
          <div className='flex items-center gap-1 text-sm text-red-600'>
            <AlertCircle className='h-4 w-4' />
            <span>{accountError}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
