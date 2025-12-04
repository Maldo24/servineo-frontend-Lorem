// src/Components/ask_for_help/FORUMCommentsList.tsx
'use client';

import React from 'react';
import type { ForumComment } from './forum.types';

interface FORUMCommentsListProps {
  comments: ForumComment[];
}

export const FORUMCommentsList: React.FC<FORUMCommentsListProps> = ({ comments }) => {
  return (
    <div className='space-y-3 mb-4'>
      {comments.map((c) => (
        <div key={c._id} className='border border-gray-200 rounded-lg p-3 text-sm'>
          <p className='font-semibold text-gray-800'>
            {c.authorName}
            <span className='ml-2 text-xs text-gray-500'>
              {c.authorRole === 'fixer' && '(Fixer)'}
              {c.authorRole === 'requester' && '(Solicitante)'}
              {c.authorRole === 'admin' && '(Admin)'}
              {c.authorRole === 'visitor' && '(Visitante)'}
            </span>
          </p>
          <p className='text-gray-700 mt-1'>{c.contenido}</p>
          <p className='text-xs text-gray-400 mt-1'>{new Date(c.createdAt).toLocaleString()}</p>
        </div>
      ))}

      {comments.length === 0 && (
        <p className='text-sm text-gray-500'>
          Aún no hay comentarios. ¡Sé el primero en responder!
        </p>
      )}
    </div>
  );
};
