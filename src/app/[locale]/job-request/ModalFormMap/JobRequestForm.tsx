'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import MapJobRequest from './MapJobRequest';
import { JobRequestData, Location, JobRequestFormProps } from '../../../../types/job-request';

const MapJobRequestMemo = React.memo(MapJobRequest);

const JobRequestForm: React.FC<JobRequestFormProps> = ({
  initialLocation,
  loading,
  onSubmit,
  onCancel,
  initialFormData,
}) => {
  const [formData, setFormData] = useState<JobRequestData>(
    initialFormData || {
      jobMotive: '',
      jobDescription: '',
      locationOption: 'keep',
      startTime: '',
      endTime: '',
      suggestedRate: '',
    },
  );

  const [newLocation, setNewLocation] = useState<Location | null>(null);
  const [timeError, setTimeError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const isFormValid = useMemo(() => {
    return (
      formData.jobMotive.trim() !== '' &&
      formData.jobDescription.trim() !== '' &&
      formData.startTime !== '' &&
      formData.endTime !== '' &&
      !timeError
    );
  }, [
    formData.jobMotive,
    formData.jobDescription,
    formData.startTime,
    formData.endTime,
    timeError,
  ]);

  const currentMapLocation = useMemo(() => {
    if (formData.locationOption === 'modify' && newLocation) {
      return newLocation;
    }
    return initialLocation || { lat: -16.5, lng: -68.15 };
  }, [formData.locationOption, newLocation, initialLocation]);

  const isMapEnabled = formData.locationOption === 'modify';

  const validateTimes = useCallback((start: string, end: string): string => {
    if (!start || !end) return '';

    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);

    const minTime = new Date(`2000-01-01T07:00`);
    const maxTime = new Date(`2000-01-01T21:00`);

    if (startTime < minTime || startTime > maxTime) {
      return 'La hora de inicio debe estar entre 7:00 y 21:00';
    }

    if (endTime < minTime || endTime > maxTime) {
      return 'La hora de fin debe estar entre 7:00 y 21:00';
    }

    if (endTime <= startTime) {
      return 'La hora de fin debe ser mayor a la hora de inicio';
    }

    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    if (durationHours < 2) {
      return 'La duración mínima del trabajo es de 2 horas';
    }

    if (durationHours > 8) {
      return 'La duración máxima del trabajo es de 8 horas';
    }

    return '';
  }, []);

  const validateTextOnly = (text: string): string => {
    return text.replace(/[0-9]/g, '');
  };

  const validateDependentFields = useCallback(
    (name: string) => {
      if (name === 'jobDescription' && !formData.jobMotive.trim()) {
        setFieldErrors((prev) => ({
          ...prev,
          jobDescription: 'Primero debe completar el motivo del trabajo',
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [formData.jobMotive],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      let processedValue = value;

      if (name === 'jobMotive' || name === 'jobDescription') {
        processedValue = validateTextOnly(value);
        validateDependentFields(name);
      }

      setFormData((prev) => ({ ...prev, [name]: processedValue }));
    },
    [validateDependentFields],
  );

  const handleTextAreaFocus = () => {
    if (!formData.jobMotive.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        jobDescription: 'Primero debe completar el motivo del trabajo',
      }));
      document.getElementById('jobMotive')?.focus();
    }
  };

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const error = validateTimes(formData.startTime, formData.endTime);
      setTimeError(error);
    } else {
      setTimeError('');
    }
  }, [formData.startTime, formData.endTime, validateTimes]);

  const handlePositionChange = useCallback((pos: Location) => {
    setNewLocation({ lat: pos.lat, lng: pos.lng });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.jobMotive.trim()) {
      setFieldErrors((prev) => ({ ...prev, jobMotive: 'Este campo es requerido' }));
      return;
    }

    if (!formData.jobDescription.trim()) {
      setFieldErrors((prev) => ({ ...prev, jobDescription: 'Este campo es requerido' }));
      return;
    }

    if (formData.startTime && formData.endTime) {
      const finalError = validateTimes(formData.startTime, formData.endTime);
      if (finalError) {
        setTimeError(finalError);
        return;
      }
    }

    if (!formData.startTime || !formData.endTime) {
      setTimeError('Debe ingresar tanto la hora de inicio como la de fin');
      return;
    }

    onSubmit(formData, newLocation);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label htmlFor='jobMotive' className='block text-sm font-medium text-gray-700 mb-2'>
          Motivo del trabajo:
        </label>
        <input
          type='text'
          id='jobMotive'
          name='jobMotive'
          value={formData.jobMotive}
          onChange={handleInputChange}
          placeholder='Ingrese el motivo del trabajo...'
          required
          disabled={loading}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500 ${
            fieldErrors.jobMotive ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.jobMotive && (
          <p className='text-red-500 text-xs mt-1'>{fieldErrors.jobMotive}</p>
        )}
      </div>

      <div>
        <label htmlFor='jobDescription' className='block text-sm font-medium text-gray-700 mb-2'>
          Descripción del trabajo:
        </label>
        <textarea
          id='jobDescription'
          name='jobDescription'
          value={formData.jobDescription}
          onChange={handleInputChange}
          onFocus={handleTextAreaFocus}
          placeholder='Describa el trabajo a realizar...'
          required
          disabled={loading || !formData.jobMotive.trim()}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500 resize-none ${
            fieldErrors.jobDescription ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.jobDescription && (
          <p className='text-red-500 text-xs mt-1'>{fieldErrors.jobDescription}</p>
        )}
        {!formData.jobMotive.trim() && (
          <p className='text-gray-500 text-xs mt-1'>
            Complete primero el motivo del trabajo para habilitar este campo
          </p>
        )}
      </div>

      <fieldset className='border border-gray-300 rounded-md p-4'>
        <legend className='text-sm font-medium text-gray-700 px-2'>Ubicación del trabajo:</legend>
        <div className='space-y-3'>
          <label className='flex items-center'>
            <input
              type='radio'
              name='locationOption'
              value='keep'
              checked={formData.locationOption === 'keep'}
              onChange={handleInputChange}
              disabled={loading}
              className='mr-3'
            />
            <span className='text-sm text-gray-700 font-medium'>
              Mantener la ubicación guardada
            </span>
          </label>
          <label className='flex items-center'>
            <input
              type='radio'
              name='locationOption'
              value='modify'
              checked={formData.locationOption === 'modify'}
              onChange={handleInputChange}
              disabled={loading}
              className='mr-3'
            />
            <span className='text-sm text-gray-700 font-medium'>
              Modificar la ubicación del trabajo
            </span>
          </label>
        </div>
      </fieldset>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Mapa de ubicación:</label>
        {loading && !initialLocation ? (
          <div className='flex items-center justify-center h-48 bg-gray-100 rounded-md'>
            <p className='text-gray-500'>Cargando mapa...</p>
          </div>
        ) : (
          <MapJobRequestMemo
            isEnabled={isMapEnabled}
            initialLocationObject={currentMapLocation}
            onPositionChange={handlePositionChange}
          />
        )}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Disponibilidad:</label>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='startTime' className='block text-sm font-medium text-gray-700 mb-2'>
              De:
            </label>
            <input
              type='time'
              id='startTime'
              name='startTime'
              value={formData.startTime}
              onChange={handleInputChange}
              required
              disabled={loading}
              min='07:00'
              max='21:00'
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900'
            />
            <p className='text-xs text-gray-500 mt-1'>Entre 7:00 y 21:00</p>
          </div>

          <div>
            <label htmlFor='endTime' className='block text-sm font-medium text-gray-700 mb-2'>
              Hasta:
            </label>
            <input
              type='time'
              id='endTime'
              name='endTime'
              value={formData.endTime}
              onChange={handleInputChange}
              required
              disabled={loading}
              min='07:00'
              max='21:00'
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900'
            />
            <p className='text-xs text-gray-500 mt-1'>Entre 7:00 y 21:00</p>
          </div>
        </div>
      </div>

      {timeError && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm'>
          {timeError}
        </div>
      )}

      {formData.startTime && formData.endTime && !timeError && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm'>
          Duración: {calculateDuration(formData.startTime, formData.endTime)}
        </div>
      )}

      <div>
        <label htmlFor='suggestedRate' className='block text-sm font-medium text-gray-700 mb-2'>
          Tarifa sugerida (opcional):
        </label>
        <input
          type='number'
          id='suggestedRate'
          name='suggestedRate'
          value={formData.suggestedRate}
          onChange={handleInputChange}
          placeholder='Ingrese una tarifa en bs.'
          disabled={loading}
          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500'
        />
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          disabled={loading}
          className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
        >
          Cancelar
        </button>
        <button
          type='submit'
          disabled={loading || !!timeError || !isFormValid}
          className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

function calculateDuration(startTime: string, endTime: string): string {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes} minutos`;
  } else if (minutes === 0) {
    return `${hours} horas`;
  } else {
    return `${hours} horas y ${minutes} minutos`;
  }
}

export default JobRequestForm;
