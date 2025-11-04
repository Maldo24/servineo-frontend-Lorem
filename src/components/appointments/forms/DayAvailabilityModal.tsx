import React from 'react'; 
import { useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';

import { AvailabilityActions } from './modules/AvailabilityActions';
import { AvailabilityHeader } from './modules/AvailabilityHeader';
import { SelectHourSection } from './modules/SelectHourSection';

const API = process.env.NEXT_PUBLIC_BACKEND as string;

interface DayAvailabilityModalProps {
  fixerId?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  availableDays: Record<string, number[]>;
}

export interface DayAvailabilityModalHandles {
  open: (daysToConfigure: string[]) => void;
  close: () => void;
}

export const DayAvailabilityModal = forwardRef<DayAvailabilityModalHandles, DayAvailabilityModalProps>(
  ({ fixerId = '68f55bf8f5c96a8e785049b9', onClose, onConfirm, availableDays}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [daysToConfigure, setDaysToConfigure] = useState<string[]>([]);
    const [selectedHours, setSelectedHours] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      open: (days: string[]) => {
        setDaysToConfigure(days);
        setSelectedHours([]);
        setError(null);
        setIsOpen(true);
      },
      close: () => handleClose()
    }), []);

    const toggleHour = (hours: number[]) => {
      setSelectedHours(hours);
    }

    const handleClose = () => {
      setIsOpen(false);
      setDaysToConfigure([]);
      setSelectedHours([]);
      setError(null);
      onClose?.();
    };

    const handleCancel = () => {
      handleClose();
    }

    const handleConfirm = async () => {
      if(selectedHours.length > 0 && daysToConfigure.length > 0) {
        try {
          setLoading(true);
          setError(null);

          const availabilityData: Record<string, number[]> = {
            lunes: availableDays.lunes || [],
            martes: availableDays.martes || [],
            miercoles: availableDays.miercoles || [],
            jueves: availableDays.jueves || [],
            viernes: availableDays.viernes || [],
            sabado: availableDays.sabado || [],
            domingo: availableDays.domingo || []
          };

          daysToConfigure.forEach(day => {
            availabilityData[day] = [...selectedHours];
          });

          const response = await axios.put(
            `${API}/api/crud_update/appointments/update_fixer_availability`, 
            {
              fixer_id: fixerId,
              availability: availabilityData
            });
          
          if (response.data.updated) {
            console.log('Disponibilidad actualizada correctamente');
            handleClose();
            onConfirm?.();
          } else {
            setError('Error al actualizar la disponibilidad');
          }
        } catch (err) {
          console.error('Error guardando configuración:', err);
          setError('Error al guardar la configuración');   
        } finally {
          setLoading(false);
        }
      } else {
        if (selectedHours.length === 0) {
          setError('Selecciona al menos una hora');
        }
      }
    }

    const isConfirmDisabled = selectedHours.length === 0 || daysToConfigure.length === 0 || loading;

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <AvailabilityHeader 
            headerText='Seleccionar Disponibilidad' 
            onClose={handleClose}
          />

          <p className="text-black font-semibold mb-4">
            Horas de trabajo para: {daysToConfigure.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
          </p>

          <SelectHourSection
            selectedHours={selectedHours}
            onHoursChange={toggleHour}
          />

          <p className="text-sm text-gray-700 mb-4">
            *Las horas seleccionadas se aplicaran para todos los días laborales seleccionados de cada semana.
          </p>

          {error && (
            <div className="text-red-600 text-sm mb-4 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <AvailabilityActions
            onCancel={handleCancel}
            confirmPlaceholder={loading ? 'Guardando...' : 'Guardar'}
            onConfirm={handleConfirm}
            confirmDisabled={isConfirmDisabled}
          />
        </div>
      </div>
    );
  }
);

DayAvailabilityModal.displayName = 'DayAvailabilityModal';

export default DayAvailabilityModal;