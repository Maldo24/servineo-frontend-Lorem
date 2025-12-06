// frontend/src/Components/ask_for_help/FORUMThreadList.tsx
'use client';

import React from 'react';
import type { ForumThread } from './forum.types';

interface FORUMThreadListProps {
  threads: ForumThread[];
  loading: boolean;
  error: string | null;
  onOpenThread: (id: string) => void;
}

export const FORUMThreadList: React.FC<FORUMThreadListProps> = ({
  threads,
  loading,
  error,
  onOpenThread,
}) => {
  if (loading) {
    return (
      <p className="text-center text-gray-600">
        Cargando publicaciones...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (threads.length === 0) {
    return (
      <section className="border border-gray-200 rounded-lg p-8 text-center text-gray-600">
        <p className="font-medium mb-2">No se encontraron publicaciones.</p>
        <p className="text-sm">
          Cuando los usuarios comiencen a crear publicaciones, aparecerán aquí.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {threads.map((thread) => (
        <button
          key={thread._id}
          type="button"
          onClick={() => onOpenThread(thread._id)}
          className="w-full text-left border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-gray-900">
                {thread.titulo}
              </h2>

              {/* chip de categoría */}
              <div className="mt-1 mb-1">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {thread.categoria === "problemas" && "Problemas"}
                  {thread.categoria === "servicios" && "Servicios"}
                  {thread.categoria === "consejos" && "Consejos"}
                  {thread.categoria === "general" && "General"}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {thread.descripcion}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Por {thread.authorName} •{" "}
                {new Date(thread.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {thread.commentsCount} comentarios
            </span>
          </div>
        </button>
      ))}
    </section>
  );
};