'use client';

import { useCallback, useEffect, useState } from 'react';
import { jsonFetcher, type FixerRating } from './utils';
import { apiUrl } from '@/config/api';
import { DetailsModal } from '@/app/components/fixers/DetailsModal';

function useFixerRatings(fixerId: string, pollInterval: number = 2000) {
  const [ratings, setRatings] = useState<FixerRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const url = fixerId ? apiUrl(`/api/ratings.details/${fixerId}`) : null;

  type RatingResponse = {
    _id: string;
    title?: string;
    rating: 1 | 2 | 3;
    comment?: string;
    createdAt: string;
  };

  const load = useCallback(async () => {
    if (!url) return;
    try {
      const data = await jsonFetcher<RatingResponse[]>(url);
      const mapped = data.map((d) => ({
        id: d._id,
        requester: d.title || 'Unknown',
        score: d.rating as 1 | 2 | 3,
        comment: d.comment || '',
        createdAt: d.createdAt,
      }));
      setRatings(mapped);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setRatings([]);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    setIsLoading(true);
    load();
  }, [url, load]);

  useEffect(() => {
    const interval = setInterval(() => {
      load();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [load, pollInterval]);

  return { ratings, isLoading, error, refresh: load };
}

export function StarRating({
  value,
  size = 18,
  srLabel,
}: {
  value: 1 | 2 | 3;
  size?: number;
  srLabel?: string;
}) {
  return (
    <div className='inline-flex gap-1' aria-label={srLabel ?? `${value} of 3 stars`}>
      {Array.from({ length: 3 }).map((_, i) => {
        const filled = i < value;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox='0 0 24 24'
            role='img'
            aria-hidden='true'
            style={
              filled
                ? { fill: 'var(--highlight)' }
                : { fill: 'transparent', stroke: 'var(--highlight)' }
            }
          >
            <path d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
          </svg>
        );
      })}
    </div>
  );
}

export function RatingDetailsList({
  ratings,
  error,
  fixerId,
}: {
  ratings: FixerRating[];
  error?: string;
  fixerId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRatingId, setSelectedRatingId] = useState<string | null>(null);
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const commentLengthLimit = isMobile ? 100 : 200;
  const toggleComment = (id: string) => setExpandedCommentId((prev) => (prev === id ? null : id));

  if (error) {
    return (
      <div className='p-4 rounded-lg text-sm error-box'>
        ⚠️ Ocurrió un problema al cargar las calificaciones. Inténtalo nuevamente.
      </div>
    );
  }

  if (!ratings?.length) {
    return (
      <div
        className='p-6 text-sm border rounded-lg'
        style={{
          color: 'var(--text-muted)',
          background: 'var(--surface-card)',
          borderColor: 'var(--surface-border)',
        }}
      >
        Este FIXER no tiene calificaciones registradas.
      </div>
    );
  }

  const ordered = [...ratings].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <>
      <DetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRatingId(null);
        }}
        onAccept={() => {
          setIsModalOpen(false);
          setSelectedRatingId(null);
        }}
        dataId={selectedRatingId || ''}
        fixerId={fixerId}
      />
      <ul className='flex flex-col gap-4'>
        {ordered.map((r) => {
          const isLongComment = r.comment && r.comment.length > commentLengthLimit;
          return (
            <li
              key={r.id}
              className='flex items-start gap-4 p-4 rounded-xl transition-colors border cursor-pointer hover:!bg-gray-200'
              style={{ borderColor: 'var(--surface-border)', background: 'var(--surface-card)' }}
              onClick={() => {
                setSelectedRatingId(r.id);
                setIsModalOpen(true);
              }}
            >
              <div className='h-10 w-10 shrink-0 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden'>
                <span className='text-xs'>👤</span>
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <p className='font-medium truncate'>{r.requester}</p>
                  <StarRating value={r.score} />
                </div>

                <p className='text-xs' style={{ color: 'var(--text-muted)' }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>

                <p
                  className={`text-sm mt-1 leading-6 ${expandedCommentId === r.id ? '' : 'line-clamp-2'}`}
                  style={{ color: 'color-mix(in srgb, var(--foreground) 80%, transparent)' }}
                >
                  {r.comment}
                </p>

                {isLongComment && (
                  <button
                    className='mt-2 text-xs sm:hidden'
                    style={{ color: 'var(--primary)' }}
                    onClick={() => toggleComment(r.id)}
                    aria-expanded={expandedCommentId === r.id}
                  >
                    {expandedCommentId === r.id ? 'See less' : 'See more'}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function ClientRatings({ fixerId }: { fixerId: string }) {
  const { ratings, isLoading, error } = useFixerRatings(fixerId);
  if (isLoading) return <div className='p-4 text-sm'>Loading...</div>;
  return <RatingDetailsList ratings={ratings} error={error?.message} fixerId={fixerId} />;
}
