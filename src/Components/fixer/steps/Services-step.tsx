'use client';

import type React from 'react';

import { Card } from '@/Components/Card';
import { PillButton } from '../Pill-button';
import { Plus, Edit2, Trash2, Wrench } from 'lucide-react';
import { useState } from 'react';

export interface Service {
  id: string;
  name: string;
  custom?: boolean;
}

interface ServicesStepProps {
  services: Service[];
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
  onAddCustomService: (name: string) => void;
  onEditService: (id: string, name: string) => void;
  onDeleteService: (id: string) => void;
  error?: string;
}

export function ServicesStep({
  services,
  selectedServiceIds,
  onToggleService,
  onAddCustomService,
  onEditService,
  onDeleteService,
  error,
}: ServicesStepProps) {
  const [newService, setNewService] = useState('');

  const handleServiceChange = (value: string) => {
    const sanitized = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 20);
    setNewService(sanitized);
  };

  const handleAddService = () => {
    if (!newService.trim()) {
      alert('Por favor ingresa un nombre para el servicio');
      return;
    }

    if (newService.trim().length < 2) {
      alert('El servicio debe tener al menos 2 caracteres');
      return;
    }

    onAddCustomService(newService.trim());
    setNewService('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddService();
    }
  };

  const handleEdit = (service: Service) => {
    const newName = prompt('Editar servicio', service.name);
    if (newName) {
      const sanitized = newName.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 20);
      if (sanitized.trim().length >= 2) {
        onEditService(service.id, sanitized.trim());
      } else {
        alert('El servicio debe tener al menos 2 caracteres y solo contener letras');
      }
    }
  };

  return (
    <Card title='Selecciona tus servicios'>
      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <Wrench className='h-4 w-4' />
          <span>Selecciona los servicios que ofreces</span>
        </div>

        <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
          {services.map((s) => (
            <label
              key={s.id}
              className='flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-900 hover:bg-gray-300 transition-colors cursor-pointer'
            >
              <input
                type='checkbox'
                checked={selectedServiceIds.includes(s.id)}
                onChange={() => onToggleService(s.id)}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='flex-1 truncate'>{s.name}</span>
              {s.custom && (
                <span className='flex gap-2 text-xs'>
                  <button
                    type='button'
                    className='text-blue-600 hover:text-blue-800 transition-colors'
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(s);
                    }}
                    title='Editar servicio'
                  >
                    <Edit2 className='h-3 w-3' />
                  </button>
                  <button
                    type='button'
                    className='text-red-600 hover:text-red-700 transition-colors'
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteService(s.id);
                    }}
                    title='Eliminar servicio'
                  >
                    <Trash2 className='h-3 w-3' />
                  </button>
                </span>
              )}
            </label>
          ))}
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <input
              value={newService}
              onChange={(e) => handleServiceChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Añadir nuevo servicio'
              maxLength={20}
              className='flex-1 rounded-full bg-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition-all'
            />
            <PillButton
              className='bg-blue-600 text-white hover:bg-blue-800 flex items-center gap-2'
              onClick={handleAddService}
            >
              <Plus className='h-4 w-4' />
              Agregar
            </PillButton>
          </div>
          <p className='text-xs text-gray-600 px-2'>
            Solo letras, máximo 20 caracteres ({newService.length}/20)
            {newService.trim().length < 2 && newService.length > 0 && (
              <span className='text-amber-600 ml-1'>Mínimo 2 caracteres</span>
            )}
          </p>
        </div>
        {error && <p className='text-sm text-red-600'>{error}</p>}
      </div>
    </Card>
  );
}
