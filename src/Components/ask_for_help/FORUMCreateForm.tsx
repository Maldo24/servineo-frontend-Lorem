// frontend/src/Components/ask_for_help/FORUMCreateForm.tsx
'use client';

import React from 'react';
import type { ForumCategoria } from './forum.types';

interface FORUMCreateFormProps {
  show: boolean;
  titulo: string;
  descripcion: string;
  categoria: ForumCategoria | '';
  creating: boolean;
  error: string | null;
  onChangeTitulo: (v: string) => void;
  onChangeDescripcion: (v: string) => void;
  onChangeCategoria: (v: ForumCategoria | '') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const FORUMCreateForm: React.FC<FORUMCreateFormProps> = ({
  show,
  titulo,
  descripcion,
  categoria,
  creating,
  error,
  onChangeTitulo,
  onChangeDescripcion,
  onChangeCategoria,
  onSubmit,
}) => {
  if (!show) return null;

  return (
    <section className='mb-6 border border-gray-200 rounded-lg p-4'>
      <h2 className='font-semibold mb-3'>Crear nueva publicación</h2>
      <form onSubmit={onSubmit} className='space-y-3'>
        <div>
          <label className='block text-sm font-medium mb-1'>Título</label>
          <input
            type='text'
            value={titulo}
            onChange={(e) => onChangeTitulo(e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            maxLength={150}
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Descripción del problema</label>
          <textarea
            value={descripcion}
            onChange={(e) => onChangeDescripcion(e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows={4}
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Categoría</label>
          <select
            value={categoria}
            onChange={(e) =>
              onChangeCategoria(e.target.value ? (e.target.value as ForumCategoria) : '')
            }
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>Selecciona una categoría</option>
            <option value='problemas'>Problemas</option>
            <option value='servicios'>Servicios</option>
            <option value='consejos'>Consejos</option>
            <option value='general'>General</option>
          </select>
        </div>

        {error && <p className='text-sm text-red-600'>{error}</p>}

        <button
          type='submit'
          disabled={creating}
          className='px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60'
        >
          {creating ? 'Publicando...' : 'Publicar foro'}
        </button>
      </form>
    </section>
  );
};
