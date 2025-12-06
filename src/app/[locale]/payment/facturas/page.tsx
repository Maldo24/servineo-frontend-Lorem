//src/app/facturas/page.tsx
//src/app/facturas/page.tsx
'use client';

import React from 'react';
// La ruta de importación necesita subir un nivel para llegar a 'app'
// facturas -> app -> payment/components
import InvoiceList from '../../../../Components/payment/InvoiceList';

// Esta es la página renderizada en la ruta base /facturas
const InvoicesPage: React.FC = () => {
  return (
    <div className='flex justify-center w-full min-h-screen bg-gray-50'>
      <InvoiceList />
    </div>
  );
};

export default InvoicesPage;
