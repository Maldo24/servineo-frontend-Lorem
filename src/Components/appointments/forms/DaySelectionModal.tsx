'use client';

import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';

import { AvailabilityHeader } from './modules/AvailabilityHeader';
import { AvailabilityActions } from './modules/AvailabilityActions';
import { DaySelectSection } from './modules/DaySelectSection';
import { DayAvailabilityModal, DayAvailabilityModalHandles } from './DayAvailabilityModal';

const API = process.env.NEXT_PUBLIC_BACKEND as string;

interface AvailabilityResponse {
  message: string;
  availability: {
    lunes: number[];
    martes: number[];
    miercoles: number[];
    jueves: number[];
    viernes: number[];
    sabado: number[];
    domingo: number[];
  };
}

interface DaySelectionModalProps {
  fixerId?: string;
  onClose?: () => void;
}

export interface DaySelectionModalHandles {
  open: () => void;
  close: () => void;
}

export const DaySelectionModal = forwardRef<DaySelectionModalHandles, DaySelectionModalProps>(
  ({ fixerId = '68f55bf8f5c96a8e785049b9', onClose }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [availability, setAvailability] = useState<Record<string, number[]>>({});
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hourModalRef = useRef<DayAvailabilityModalHandles>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
        loadPreviousConfiguration();
      },
      close: () => handleClose(),
    }));

    const loadPreviousConfiguration = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<AvailabilityResponse>(
          `${API}/api/crud_read/appointments/get_fixer_availability?fixer_id=${fixerId}`,
        );

        const availability = response.data.availability;

        setAvailability(availability);
      } catch (err) {
        setError('Error al cargar la configuracion previa');
        console.error('Error loading availability:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      setIsOpen(false);
      setAvailability({});
      setSelectedDays([]);
      setError(null);
      onClose?.();
    };

    const handleConfirm = () => {
      if (selectedDays.length > 0) {
        // console.log("dias seleccionados para editar:", selectedDays);
        setIsOpen(false);
        hourModalRef.current?.open(selectedDays);
      }
    };

    const handleCancel = () => {
      handleClose();
    };

    const handleSelectedDaysChange = (days: string[]) => {
      // console.log("Desde handleSelectedDaysChange", days);
      setSelectedDays(days);
    };

    const handleHourModalClose = () => {
      setIsOpen(true);
    };

    const handleHourModalConfirm = () => {
      handleClose();
    };

    const isConfirmDisabled = selectedDays.length === 0;

    return (
      <>
        <div
          className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 ${
            isOpen ? 'scale-100' : 'scale-95'
          }"
          >
            <AvailabilityHeader headerText='Seleccionar Disponibilidad' onClose={handleClose} />

            <p className='text-black font-semibold mb-4'>Días de trabajo de la semana</p>

            {loading ? (
              <div className='flex justify-center items-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                <span className='ml-2'>Cargando configuración...</span>
              </div>
            ) : error ? (
              <div className='text-red-600 text-center py-4'>
                {error}
                <div className='flex gap-2 justify-center mt-3'>
                  <button
                    onClick={loadPreviousConfiguration}
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm'
                  >
                    Reintentar
                  </button>
                  <button
                    onClick={handleClose}
                    className='px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm'
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <DaySelectSection
                  availableDays={availability}
                  onDaysChange={handleSelectedDaysChange}
                />

                <p className='text-sm text-gray-700 mb-4'>
                  *Se editará la disponibilidad los días seleccionados (azules)
                </p>

                <AvailabilityActions
                  onCancel={handleCancel}
                  confirmPlaceholder='Editar'
                  onConfirm={handleConfirm}
                  confirmDisabled={isConfirmDisabled}
                />
              </>
            )}
          </div>
        </div>

        <DayAvailabilityModal
          ref={hourModalRef}
          fixerId={fixerId}
          onClose={handleHourModalClose}
          onConfirm={handleHourModalConfirm}
          availableDays={availability}
        />
      </>
    );
  },
);

DaySelectionModal.displayName = 'DaySelectionModal';

export default DaySelectionModal;
