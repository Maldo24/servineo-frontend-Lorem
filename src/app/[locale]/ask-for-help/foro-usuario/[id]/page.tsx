'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { getForumWithComments, addCommentToForum } from '@/Components/ask_for_help/forum.service';
import type { ForumWithComments } from '@/Components/ask_for_help/forum.types';
import { FORUMThreadDetail } from '@/Components/ask_for_help/FORUMThreadDetail';
import { FORUMCommentsList } from '@/Components/ask_for_help/FORUMCommetsList';
import { FORUMCommentForm } from '@/Components/ask_for_help/FORUMCommentForm';

export default function ForoDetallePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const forumId = params.id;

  const [data, setData] = useState<ForumWithComments | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getForumWithComments(forumId);
      setData(res);
    } catch (err: unknown) {
      let errorMessage = 'Error al cargar la publicación';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [forumId]);

  useEffect(() => {
    if (forumId) load();
  }, [forumId, load]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !data) return;

    try {
      setPosting(true);
      setPostError(null);
      await addCommentToForum(forumId, newComment);
      setNewComment('');
      await load();
    } catch (err: unknown) {
      let errorMessage = 'Error al enviar el comentario';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setPostError(errorMessage);
    } finally {
      setPosting(false);
    }
  }

  if (loading && !data) {
    return <p className='p-8 text-center'>Cargando...</p>;
  }

  if (error && !data) {
    return (
      <div className='p-8 text-center'>
        <p className='text-red-600 mb-4'>{error}</p>
        <button onClick={() => router.back()} className='px-4 py-2 border rounded-md'>
          Volver
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { forum, comments } = data;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Detalle del hilo */}
        <FORUMThreadDetail forum={forum} onBack={() => router.back()} />

        {/* Comentarios + formulario */}
        <div className='bg-white rounded-xl shadow-lg p-6'>
          <h2 className='font-semibold mb-4'>Comentarios ({comments.length})</h2>

          <FORUMCommentsList comments={comments} />

          <FORUMCommentForm
            value={newComment}
            posting={posting}
            error={postError}
            onChange={setNewComment}
            onSubmit={handleSend}
          />
        </div>
      </div>
    </div>
  );
}
