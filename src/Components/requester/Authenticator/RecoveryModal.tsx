'use client';
import React from 'react';

interface Props {
  open: boolean;
  codes: string[] | null;
  onClose: () => void; // si el usuario cancela
  onConfirm: () => void; // cuando el usuario confirma que guardó los códigos
}

export default function RecoveryModal({ open, codes, onConfirm }: Props) {
  if (!open) return null;

  const handleCopyAll = async () => {
    if (!codes || codes.length === 0) return;
    const all = codes.join('\n');
    try {
      await navigator.clipboard.writeText(all);
      // feedback breve
      alert('Todos los códigos han sido copiados al portapapeles');
    } catch {
      // fallback si clipboard falla
      prompt('Copia manualmente los códigos (Ctrl+C):', all);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white rounded-lg w-[560px] p-6 shadow-lg border'>
        <h3 className='text-lg font-semibold mb-2'>Códigos de recuperación</h3>
        <p className='text-sm text-gray-600 mb-4'>
          Guarda estos códigos en un lugar seguro. Se mostrarán <strong>una sola vez</strong>. Cada
          código sirve para recuperar tu cuenta si pierdes el acceso al autenticador.
        </p>

        <div className='grid grid-cols-2 gap-3 mb-4'>
          {codes && codes.length > 0 ? (
            codes.map((c) => (
              <div key={c} className='flex items-center justify-between p-3 rounded bg-gray-50'>
                <code className='font-mono text-sm break-all'>{c}</code>
              </div>
            ))
          ) : (
            <div className='col-span-2 text-sm text-gray-500'>No hay códigos para mostrar.</div>
          )}
        </div>

        <div className='flex justify-between items-center'>
          <button
            onClick={handleCopyAll}
            className='px-3 py-2 rounded border text-sm bg-white text-gray-700'
            disabled={!codes || codes.length === 0}
          >
            Copiar todos
          </button>

          <div className='flex gap-3'>
            <button
              onClick={onConfirm}
              className='px-4 py-2 rounded text-sm bg-indigo-600 text-white'
            >
              He guardado los códigos (OK)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
