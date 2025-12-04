'use client';

import dynamic from 'next/dynamic';

const RegistroTelefono = dynamic(() => import('@/Components/requester/telefono/RegistroTelefono'), {
  ssr: false,
});

export default function PageTelefono() {
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <RegistroTelefono />
    </div>
  );
}
