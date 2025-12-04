import React from 'react';
import { Roboto } from 'next/font/google';
import { getAppointmentsByFixerId } from '@/services/appointments';
import type { Appointment } from '@/services/appointments';
import AppointmentsList from '@/app/components/fixers/AppointmentsList';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  let appointments: Appointment[] = [];

  try {
    appointments = await getAppointmentsByFixerId(id);
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[appointments/page] fixer ${id} -> ${appointments.length} appointments`);
    }
  } catch (err) {
    console.error('Failed to load appointments:', err);
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-auto w-full max-w-5xl p-4 sm:p-6'>
        <h1
          className={`${roboto.className} text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 text-center`}
        >
          Appointments
        </h1>
        <AppointmentsList appointments={appointments} />
      </div>
    </div>
  );
}
