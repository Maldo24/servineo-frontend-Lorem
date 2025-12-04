// src/Components/ask_for_help/FORUMThreadDetail.tsx
'use client';

import React from 'react';
import type { ForumThread } from './forum.types';

interface FORUMThreadDetailProps {
  forum: ForumThread;
  onBack: () => void;
}

export const FORUMThreadDetail: React.FC<FORUMThreadDetailProps> = ({ forum, onBack }) => {
  return (
    <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
      <button onClick={onBack} className='text-sm text-gray-600 mb-4 hover:underline'>
        ← Volver al foro
      </button>

      <h1 className='text-2xl font-bold mb-2'>{forum.titulo}</h1>

      {/* Chip de categoría */}
      <p className='mb-2'>
        <span className='inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700'>
          {forum.categoria === 'problemas' && 'Problemas'}
          {forum.categoria === 'servicios' && 'Servicios'}
          {forum.categoria === 'consejos' && 'Consejos'}
          {forum.categoria === 'general' && 'General'}
        </span>
      </p>

      <p className='text-sm text-gray-500 mb-4'>
        Por {forum.authorName} • {new Date(forum.createdAt).toLocaleString()}
      </p>

      <div className='border border-gray-200 rounded-lg p-4 text-gray-800'>{forum.descripcion}</div>
    </div>
  );
};
