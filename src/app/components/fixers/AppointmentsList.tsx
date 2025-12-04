'use client';
import React, { useState } from 'react';
import { Appointment } from '@/services/appointments';
import AppointmentCard from './AppointmentCard';
import JobRequestModal from '../../[locale]/job-request/ModalFormMap/JobRequestModal';

export default function AppointmentsList({ appointments }: { appointments: Appointment[] }) {
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  if (!appointments || appointments.length === 0) {
    return (
      <div className='rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500'>
        No appointments yet.
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <JobRequestModal
        isOpen={isJobModalOpen}
        onClose={() => {
          setIsJobModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSubmit={() => {
          setIsJobModalOpen(false);
          setSelectedAppointment(null);
        }}
        fixerId={selectedAppointment?.id_fixer || ''}
        appointmentData={selectedAppointment || undefined}
      />

      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment._id}
          appointment={appointment}
          onCreateJob={() => {
            setSelectedAppointment(appointment);
            setIsJobModalOpen(true);
          }}
        />
      ))}
    </div>
  );
}
