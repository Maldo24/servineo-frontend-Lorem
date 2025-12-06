import { Suspense } from 'react';
import HistoryPageClient from '../../../../Components/payment/HistoryClient'; // 1. Importa tu componente
import { Loader2 } from 'lucide-react';

// Componente simple de carga (puedes personalizarlo)
function LoadingFallback() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='animate-spin text-blue-600 mx-auto mb-4' size={48} />
        <p className='text-gray-600'>Cargando historial...</p>
      </div>
    </div>
  );
}

// 2. Esta es tu nueva página. Es un Server Component.
export default function FixerWalletHistoryPage() {
  return (
    // 3. Envuelve tu componente de cliente en Suspense
    <Suspense fallback={<LoadingFallback />}>
      <HistoryPageClient />
    </Suspense>
  );
}
