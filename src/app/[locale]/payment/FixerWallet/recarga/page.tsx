import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import RechargePageClient from './RechargePageClient'; // Importa el archivo que renombraste

// Un componente simple de carga
function LoadingFallback() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='animate-spin text-blue-600 mx-auto mb-4' size={48} />
        <p className='text-gray-600'>Cargando página de recarga...</p>
      </div>
    </div>
  );
}

// Esta es tu nueva página.
export default function RechargePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RechargePageClient userid={'6928d79bba289c48b60798ad'} />
    </Suspense>
  );
}
