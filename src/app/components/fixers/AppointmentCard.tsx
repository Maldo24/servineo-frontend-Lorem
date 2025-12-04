'use client';
import React from 'react';
import { Appointment } from '@/services/appointments';

interface AppointmentCardProps {
  appointment: Appointment;
  onCreateJob: () => void;
}

type TimeInput = { $date: string } | string;

export default function AppointmentCard({ appointment, onCreateJob }: AppointmentCardProps) {
  const handleCreateJob = () => {
    onCreateJob();
  };

  return (
    <div className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white'>
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <h3 className='font-semibold text-gray-900 text-lg'>
            {appointment.current_requester_name}
          </h3>
          <p className='text-gray-600 mt-1'>{appointment.appointment_description}</p>
          <div className='mt-2 text-sm text-gray-500'>
            <p>📅 {formatDate(appointment.starting_time)}</p>
            <p>
              🕒 {formatTime(appointment.starting_time)} - {formatTime(appointment.finishing_time)}
            </p>
            <p>📍 {appointment.display_name_location || 'Ubicación no especificada'}</p>
            <p>📞 {appointment.current_requester_phone}</p>
            <div className='mt-1'>
              <span
                className={`inline-block px-2 py-1 rounded text-xs ${
                  appointment.schedule_state === 'booked'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {appointment.schedule_state}
              </span>
              <span
                className={`ml-2 inline-block px-2 py-1 rounded text-xs ${
                  appointment.appointment_type === 'virtual'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {appointment.appointment_type === 'virtual' ? 'Virtual' : 'Presencial'}
              </span>
            </div>
            {appointment.appointment_type === 'virtual' && appointment.link_id && (
              <p className='mt-1'>
                🔗{' '}
                <a
                  href={appointment.link_id}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  Link de reunión
                </a>
              </p>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-2 ml-4'>
          <button
            onClick={handleCreateJob}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
          >
            Create Job
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(timeInput: TimeInput): string {
  const dateString = typeof timeInput === 'object' ? timeInput?.$date : timeInput;

  if (!dateString) return 'Fecha no disponible';

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Fecha inválida';

    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Fecha no disponible';
  }
}

function formatTime(timeInput: TimeInput): string {
  const dateString = typeof timeInput === 'object' ? timeInput?.$date : timeInput;

  if (!dateString) return 'Hora no disponible';

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Hora inválida';

    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Hora no disponible';
  }
}
