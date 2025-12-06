// src/Components/ask_for_help/FORUMCommentsList.tsx
'use client';

import React from 'react';
import type { ForumComment } from './forum.types';

interface FORUMCommentsListProps {
  comments: ForumComment[];
  requesterId: string;
}

export const FORUMCommentsList: React.FC<FORUMCommentsListProps> = ({
  comments,
  requesterId,
}) => {
  return (
    <div className="space-y-3 mb-4">
      {comments.map((c) => {
        const isRequester =
          c.authorId === requesterId || c.authorId === requesterId; // usa el campo correcto

        const label =
          isRequester
            ? "(Solicitante)"
            : c.authorRole === "fixer"
            ? "(Fixer)"
            : c.authorRole === "admin"
            ? "(Admin)"
            : c.authorRole === "visitor"
            ? "(Visitante)"
            : "";

        return (
          <div
            key={c._id}
            className="border border-gray-200 rounded-lg p-3 text-sm"
          >
            <p className="font-semibold text-gray-800">
              {c.authorName}
              {label && (
                <span className="ml-2 text-xs text-gray-500">{label}</span>
              )}
            </p>
            <p className="text-gray-700 mt-1">{c.contenido}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        );
      })}

      {comments.length === 0 && (
        <p className="text-sm text-gray-500">
          Aún no hay comentarios. ¡Sé el primero en responder!
        </p>
      )}
    </div>
  );
};