//src/app/payment/FixerWallet/page.tsx
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import WalletDashboardClient from '../../../../Components/payment/WalletDashboardClient'; // Importa el archivo que renombraste

// Un componente simple de carga que se mostrará mientras se leen los datos del cliente
function LoadingFallback() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='animate-spin text-blue-600 mx-auto mb-4' size={48} />
        <p className='text-gray-600'>Cargando Billetera...</p>
      </div>
    </div>
  );
}

// Esta es tu nueva página. Es un Server Component por defecto.
export default function FixerWalletPage() {
  return (
    // Suspense "pausa" el renderizado del componente cliente
    // y muestra el 'fallback' en su lugar.
    <Suspense fallback={<LoadingFallback />}>
      <WalletDashboardClient />
    </Suspense>
  );
}
