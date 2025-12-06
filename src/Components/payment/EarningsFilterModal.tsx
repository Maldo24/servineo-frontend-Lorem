//src/Components/payment/EarningsFilterModal.tsx
'use client';
import React, { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

interface Props {
  currentFrom: string; // YYYY-MM-DD
  currentTo: string; // YYYY-MM-DD
  onApply: (from: string, to: string) => void;
  onClose: () => void;
}

export default function EarningsFilterModal({ currentFrom, currentTo, onApply, onClose }: Props) {
  // Convertir YYYY-MM-DD a MM/DD/YYYY para mostrar
  const formatToDisplay = (isoDate: string): string => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${month}/${day}/${year}`;
  };

  // Convertir MM/DD/YYYY a YYYY-MM-DD para guardar
  const formatToISO = (displayDate: string): string => {
    if (!displayDate || displayDate.length !== 10) return '';
    const parts = displayDate.split('/');
    if (parts.length !== 3) return '';
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const [fromDateDisplay, setFromDateDisplay] = useState(formatToDisplay(currentFrom));
  const [toDateDisplay, setToDateDisplay] = useState(formatToDisplay(currentTo));
  const [dateError, setDateError] = useState<string | null>(null);

  // ===== VALIDACIONES =====
  const isValidDate = (month: number, day: number, year: number): boolean => {
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;

    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() + 1 === month && d.getDate() === day;
  };

  const validateDateString = (dateStr: string, fieldName: string): string | null => {
    if (!dateStr) return `La fecha "${fieldName}" es obligatoria`;

    if (dateStr.length !== 10) {
      return `La fecha "${fieldName}" está incompleta. Use formato MM/DD/YYYY`;
    }

    const parts = dateStr.split('/');
    if (parts.length !== 3) {
      return `La fecha "${fieldName}" tiene formato incorrecto`;
    }

    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return `La fecha "${fieldName}" contiene valores no numéricos`;
    }

    if (!isValidDate(month, day, year)) {
      if (month === 2 && day > 29) {
        return `Fecha inválida: Febrero solo tiene hasta 29 días`;
      } else if ([4, 6, 9, 11].includes(month) && day > 30) {
        return `Fecha inválida: Este mes solo tiene 30 días`;
      } else if (day > 31) {
        return `Fecha inválida: Ningún mes tiene más de 31 días`;
      } else if (month < 1 || month > 12) {
        return `Fecha inválida: El mes debe estar entre 01 y 12`;
      }
      return `La fecha "${fieldName}" no existe en el calendario`;
    }

    return null;
  };

  // ===== HANDLERS =====
  const handleTextInput = (value: string, setter: (val: string) => void, fieldName: string) => {
    // Permitir solo números y /
    let cleaned = value.replace(/[^\d/]/g, '');

    // Auto-agregar / después de MM y DD
    if (cleaned.length === 2 && !cleaned.includes('/')) {
      cleaned = cleaned + '/';
    } else if (cleaned.length === 5 && cleaned.split('/').length === 2) {
      cleaned = cleaned + '/';
    }

    // Limitar a 10 caracteres
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }

    setter(cleaned);

    // Validar si está completo
    if (cleaned.length === 10) {
      const error = validateDateString(cleaned, fieldName);
      setDateError(error);
    } else {
      setDateError(null);
    }
  };

  const handleSubmit = () => {
    // Validar ambas fechas
    const fromError = validateDateString(fromDateDisplay, 'Desde');
    if (fromError) {
      setDateError(fromError);
      return;
    }

    const toError = validateDateString(toDateDisplay, 'Hasta');
    if (toError) {
      setDateError(toError);
      return;
    }

    const fromISO = formatToISO(fromDateDisplay);
    const toISO = formatToISO(toDateDisplay);

    // Validar orden de fechas
    const fromDateObj = new Date(fromISO + 'T00:00:00');
    const toDateObj = new Date(toISO + 'T23:59:59');

    if (fromDateObj > toDateObj) {
      setDateError("La fecha 'Desde' no puede ser posterior a 'Hasta'");
      return;
    }

    // Validar rango máximo de 7 días
    const daysDiff = Math.ceil(
      (toDateObj.getTime() - fromDateObj.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysDiff > 7) {
      setDateError('El rango de fechas no puede ser mayor a 7 días');
      return;
    }

    // Todo OK, aplicar filtro
    setDateError(null);
    onApply(fromISO, toISO);
  };

  const hasError = (dateDisplay: string): boolean => {
    return dateDisplay.length === 10 && validateDateString(dateDisplay, '') !== null;
  };

  const setPresetRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));

    setFromDateDisplay(formatToDisplay(from.toISOString().split('T')[0]));
    setToDateDisplay(formatToDisplay(to.toISOString().split('T')[0]));
    setDateError(null);
  };

  return (
    <div className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4'>
      <div className='bg-white w-full max-w-md rounded-2xl shadow-xl relative overflow-hidden'>
        {/* Header */}
        <div className='bg-blue-600 text-white px-6 py-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold'>Filtrar por Fechas</h2>
          <button onClick={onClose} className='text-white hover:text-gray-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
        </div>

        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            Seleccione el rango de fechas (máximo 7 días)
          </h3>
          <div className='space-y-5'>
            {/* Campo Desde */}
            <div>
              <label className='block font-semibold text-gray-700 mb-2'>Desde</label>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='MM/DD/YYYY'
                  value={fromDateDisplay}
                  onChange={(e) => handleTextInput(e.target.value, setFromDateDisplay, 'Desde')}
                  maxLength={10}
                  className={`w-full p-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    hasError(fromDateDisplay)
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <input
                  type='date'
                  onChange={(e) => {
                    if (e.target.value) {
                      setFromDateDisplay(formatToDisplay(e.target.value));
                      setDateError(null);
                    }
                  }}
                  className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 w-8 h-8 cursor-pointer'
                  title='Abrir calendario'
                />
                <Calendar
                  size={20}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    hasError(fromDateDisplay) ? 'text-red-400' : 'text-gray-400'
                  }`}
                />
              </div>
            </div>

            {/* Campo Hasta */}
            <div>
              <label className='block font-semibold text-gray-700 mb-2'>Hasta</label>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='MM/DD/YYYY'
                  value={toDateDisplay}
                  onChange={(e) => handleTextInput(e.target.value, setToDateDisplay, 'Hasta')}
                  maxLength={10}
                  className={`w-full p-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    hasError(toDateDisplay)
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <input
                  type='date'
                  onChange={(e) => {
                    if (e.target.value) {
                      setToDateDisplay(formatToDisplay(e.target.value));
                      setDateError(null);
                    }
                  }}
                  className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 w-8 h-8 cursor-pointer'
                  title='Abrir calendario'
                />
                <Calendar
                  size={20}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    hasError(toDateDisplay) ? 'text-red-400' : 'text-gray-400'
                  }`}
                />
              </div>
            </div>

            {/* Error */}
            {dateError && (
              <div className='bg-red-50 border-2 border-red-400 rounded-lg p-4 flex gap-3'>
                <AlertCircle className='text-red-600 flex-shrink-0' size={24} />
                <div>
                  <p className='text-red-800 font-bold text-sm'>¡Error!</p>
                  <p className='text-red-700 text-sm'>{dateError}</p>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className='flex gap-4 pt-4'>
              <button
                onClick={handleSubmit}
                disabled={!!dateError}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white ${
                  dateError ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Aplicar Filtro
              </button>
              <button
                onClick={onClose}
                className='flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200'
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
