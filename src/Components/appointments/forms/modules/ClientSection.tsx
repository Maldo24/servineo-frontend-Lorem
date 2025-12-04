import { Input } from '@/Components/atoms/inputs';
import React from 'react';

interface ClientSectionProps {
  client: string;
  contact: string;
  errors: Record<string, string>;
  onClientChange: (value: string) => void;
  onContactChange: (value: string) => void;
  readonly?: boolean;
}

export const ClientSection = React.forwardRef<HTMLInputElement, ClientSectionProps>(
  ({ client, contact, errors, onClientChange, onContactChange, readonly }, ref) => {
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      const numbersOnly = value.replace(/[^\d]/g, '').slice(0, 8);
      onContactChange(numbersOnly);
    };

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <Input
          ref={ref}
          label='Cliente *'
          value={client}
          readOnly={readonly}
          onChange={(e) => onClientChange(e.target.value)}
          placeholder='Nombre del cliente'
          error={errors.client}
        />

        <Input
          label='Contacto *'
          value={contact}
          readOnly={readonly}
          onChange={handleContactChange}
          placeholder='7XXXXXXX'
          error={errors.contact}
        />
      </div>
    );
  },
);

ClientSection.displayName = 'ClientSection';
