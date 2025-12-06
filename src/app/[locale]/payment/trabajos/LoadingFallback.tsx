import { Loader2 } from 'lucide-react';
export default function LoadingFallback() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='animate-spin text-blue-600 mx-auto mb-4' size={48} />
        <p className='text-gray-600'>Cargando Trabajos...</p>
      </div>
    </div>
  );
}
