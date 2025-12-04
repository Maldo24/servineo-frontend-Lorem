'use client';
import React, { useState, useEffect } from 'react';
import JobRequestForm from './JobRequestForm';
import { getUserLocation, createJobRequest } from '../../../../services/job-request.modal';
import {
  UserLocation,
  CreateJobRequestPayload,
  JobRequest,
  Location,
  JobRequestData,
  JobRequestModalProps,
} from '../../../../types/job-request';

type TimeInput = { $date: string } | string;

const JobRequestModal: React.FC<JobRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fixerId,
  appointmentData,
  offerId,
}) => {
  const [initialLocation, setInitialLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<JobRequestData>({
    jobMotive: '',
    jobDescription: '',
    locationOption: 'keep',
    startTime: '',
    endTime: '',
    suggestedRate: '',
  });

  const [formInstanceKey, setFormInstanceKey] = useState(0);

  const extractTime = (timeInput: TimeInput): string => {
    const dateString = typeof timeInput === 'object' ? timeInput?.$date : timeInput;

    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return '';

      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return '';
    }
  };

  const getToken = (): string => {
    if (process.env.NODE_ENV === 'development') {
      return 'development-mock-token';
    }
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || 'fallback-mock-token';
    }
    return 'mock-token';
  };

  const getUserIdFromToken = (): string => {
    if (appointmentData) {
      return '68e87a9cdae3b73d8040102f';
    } else {
      return '68ec99ddf39c7c140f42fcfa';
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormInstanceKey((prev) => prev + 1);
    }
  }, [isOpen, appointmentData?._id]);

  useEffect(() => {
    if (isOpen) {
      const initializeModal = async () => {
        setLoading(true);
        setError('');

        try {
          const authToken = getToken();

          if (!appointmentData) {
            if (authToken) {
              const userLocation: UserLocation = await getUserLocation(authToken);
              const locationForMap: Location = {
                lat: parseFloat(userLocation.lat),
                lng: parseFloat(userLocation.lng),
              };
              setInitialLocation(locationForMap);
            }

            setFormData({
              jobMotive: '',
              jobDescription: '',
              locationOption: 'keep',
              startTime: '',
              endTime: '',
              suggestedRate: '',
            });
          } else {
            let userLocation: UserLocation;
            if (appointmentData.lat && appointmentData.lon) {
              userLocation = {
                lat: appointmentData.lat,
                lng: appointmentData.lon,
              };
            } else if (authToken) {
              userLocation = await getUserLocation(authToken);
            } else {
              userLocation = { lat: '-16.5000', lng: '-68.1500' };
            }

            const locationForMap: Location = {
              lat: parseFloat(userLocation.lat),
              lng: parseFloat(userLocation.lng),
            };
            setInitialLocation(locationForMap);

            const startTime = extractTime(appointmentData.starting_time);
            const endTime = extractTime(appointmentData.finishing_time);

            setFormData({
              jobMotive: appointmentData.appointment_description,
              jobDescription: appointmentData.appointment_description,
              locationOption: 'keep',
              startTime: startTime,
              endTime: endTime,
              suggestedRate: '',
            });
          }
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setLoading(false);
        }
      };

      initializeModal();
    } else {
      setFormData({
        jobMotive: '',
        jobDescription: '',
        locationOption: 'keep',
        startTime: '',
        endTime: '',
        suggestedRate: '',
      });
    }
  }, [isOpen, appointmentData]);

  const handleFormSubmit = async (formData: JobRequestData, newLocation: Location | null) => {
    const token = getToken();

    const currentUserId = getUserIdFromToken();

    setLoading(true);
    setError('');

    try {
      let finalLocation: { type: 'Point'; coordinates: [string, string] };
      if (formData.locationOption === 'modify' && newLocation) {
        finalLocation = {
          type: 'Point' as const,
          coordinates: [newLocation.lat.toString(), newLocation.lng.toString()] as [string, string],
        };
      } else if (initialLocation) {
        finalLocation = {
          type: 'Point' as const,
          coordinates: [initialLocation.lat.toString(), initialLocation.lng.toString()] as [
            string,
            string,
          ],
        };
      } else {
        throw new Error('No se ha definido una ubicación para el trabajo.');
      }

      let requesterId: string;
      let finalFixerId: string;

      if (!appointmentData) {
        requesterId = currentUserId;
        finalFixerId = fixerId;
      } else {
        requesterId = appointmentData.id_requester;
        finalFixerId = currentUserId;
      }

      if (!requesterId) {
        throw new Error('No se pudo determinar el ID del requester');
      }
      if (!finalFixerId) {
        throw new Error('No se pudo determinar el ID del fixer');
      }

      const payload: CreateJobRequestPayload = {
        title: formData.jobMotive,
        description: formData.jobDescription,
        location: finalLocation,
        startTime: formData.startTime,
        endTime: formData.endTime,
        price: formData.suggestedRate || '0',
        fixerId: finalFixerId,
        requesterId: requesterId,
        appointmentId: appointmentData?._id,
        offerId: offerId,
      };

      const data: JobRequest = await createJobRequest(payload, token);

      window.alert('✅ Trabajo creado exitosamente');

      onSubmit(data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-4'
      onClick={handleOverlayClick}
    >
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden'>
        <div className='bg-blue-600 text-white p-4'>
          <h2 className='text-xl font-bold text-center'>
            {appointmentData ? 'Crear Trabajo desde Cita' : 'Formulario de solicitud'}
          </h2>
        </div>

        <div className='p-6 overflow-y-auto max-h-[calc(90vh-80px)]'>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
              {error}
            </div>
          )}

          <JobRequestForm
            key={formInstanceKey}
            initialLocation={initialLocation}
            loading={loading}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            initialFormData={formData}
          />
        </div>
      </div>
    </div>
  );
};

export default JobRequestModal;
