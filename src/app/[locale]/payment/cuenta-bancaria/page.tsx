import { Suspense } from 'react';
import CuentaBancariaClient from './CuentaBancariaClient';

export default function CuentaBancariaPage() {
  return (
    // 🟢 SOLUCIÓN: Envolvemos el componente cliente en Suspense.
    // Esto le dice a Next.js: "Renderiza este fallback mientras esperas
    // a que los parámetros de la URL (searchParams) estén disponibles en el cliente".
    <Suspense
      fallback={
        <div className='min-h-screen bg-blue-600 flex items-center justify-center'>
          <div className='text-white text-lg font-medium animate-pulse'>
            Cargando información bancaria...
          </div>
        </div>
      }
    >
      <CuentaBancariaClient />
    </Suspense>
  );
}
