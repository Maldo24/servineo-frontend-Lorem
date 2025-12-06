'use client';
import LoadingFallback from './LoadingFallback';
import { Suspense } from 'react';
import TrabajosList from './TrabajosList';

export default function TrabajosRequester() {
  // Simulamos un usuario (puedes reemplazarlo con el real)
  const userId = '692b9c15e90a42ddc83350c5';

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TrabajosList userId={userId} />
    </Suspense>
  );
}
