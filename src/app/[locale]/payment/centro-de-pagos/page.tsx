'use client';

// src/app/payment/pages/centro-de-pagos/page.tsx

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// 1. Importa tu componente (asegúrate que la ruta sea correcta)
import CentroPagos from '../../../../Components/payment/CentroPagos';

// 2. Crea un componente de Carga (Fallback)
function LoadingFallback() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='animate-spin text-blue-600 mx-auto mb-4' size={48} />
        <p className='text-gray-600'>Cargando Centro de Pagos...</p>
      </div>
    </div>
  );
}

// 3. Esta es tu nueva página (un Server Component)
export default function CentroDePagosPage() {
  return (
    // 4. Envuelve tu componente cliente en <Suspense>
    <Suspense fallback={<LoadingFallback />}>
      <CentroPagos />
    </Suspense>
  );
}
