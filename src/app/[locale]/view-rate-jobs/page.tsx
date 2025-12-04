'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Roboto } from 'next/font/google';
import type { RatedJob } from './utils';
import { apiFetch } from '../../../config/api'; // corrige la ruta según tu estructura
import Link from 'next/link';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

function StarRating({
  value,
  size = 38,
  srLabel,
}: {
  value: 0 | 1 | 2 | 3;
  size?: number;
  srLabel?: string;
}) {
  return (
    <div className='inline-flex gap-1' aria-label={srLabel ?? `${value} de 3 estrellas`}>
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
            className={filled ? 'drop-shadow-sm' : 'opacity-60'}
          >
            <path
              d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
              style={
                filled
                  ? { fill: '#facc15' } // yellow
                  : { fill: 'transparent', stroke: '#cbd5e1', strokeWidth: 1.5 }
              }
            />
          </svg>
        );
      })}
    </div>
  );
}

function GenericDropdown({
  label,
  options,
  align = 'right',
  disabled = false,
  onSelect,
  selectedKey,
}: {
  label: string;
  options: { key: string; label: string }[];
  align?: 'right' | 'left';
  disabled?: boolean;
  onSelect?: (key: string) => void;
  selectedKey?: string;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number; width: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const displayLabel = label;

  function updateCoords() {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setCoords({
      left: rect.left + window.scrollX,
      top: rect.bottom + window.scrollY,
      width: rect.width,
    });
  }

  useEffect(() => {
    if (!open) return;
    updateCoords();

    function onDocClick(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    window.addEventListener('resize', updateCoords);
    window.addEventListener('scroll', updateCoords, true);
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords, true);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function toggle() {
    if (disabled) return; // prevent opening when disabled
    if (!btnRef.current) return setOpen((v) => !v);
    const rect = btnRef.current.getBoundingClientRect();
    setCoords({
      left: rect.left + window.scrollX,
      top: rect.bottom + window.scrollY,
      width: rect.width,
    });
    setOpen((v) => !v);
  }

  return (
    <>
      <div className='inline-block'>
        <button
          ref={btnRef}
          type='button'
          onClick={toggle}
          disabled={disabled}
          className={`px-3 py-2 rounded-lg border shadow-sm text-sm flex items-center gap-2 border-gray-200 ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'} `}
          aria-haspopup='menu'
          aria-expanded={open}
          aria-disabled={disabled}
        >
          {displayLabel}
          {disabled && <span className='sr-only'>(deshabilitado)</span>}
          <svg
            className='w-3 h-3 ml-1 text-blue-600'
            viewBox='0 0 10 6'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden
          >
            <path d='M1 1l4 4 4-4' />
          </svg>
        </button>
      </div>

      {open &&
        coords &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role='menu'
            style={{
              position: 'absolute',
              left: align === 'right' ? coords.left : coords.left,
              top: coords.top,
              width: coords.width,
              zIndex: 99999,
            }}
            className='rounded-xl border bg-white opacity-100 shadow-lg border-gray-200 text-gray-800 pointer-events-auto'
          >
            {options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setOpen(false);
                  onSelect?.(opt.key);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                  opt.key === selectedKey ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

function RatedJobsList({ jobs }: { jobs: RatedJob[] }) {
  return (
    <section className='space-y-6 relative w-full'>
      <div className='relative max-h-[65vh] overflow-y-auto pr-1'>
        {jobs.length === 0 ? (
          <div className='flex items-center justify-center min-h-[220px]'>
            <p className='text-sm text-gray-500'>No hay trabajos calificados aún</p>
          </div>
        ) : (
          <ul className='flex flex-col gap-4'>
            {jobs.map((job) => (
              <li
                key={job.id}
                className='
    flex items-center justify-between gap-4 p-4 rounded-xl border bg-white 
    border-gray-200 w-full shadow-[0_6px_8px_rgba(0,0,0,0.06)]
    transition-all duration-200 transform
    hover:-translate-y-1 hover:shadow-[0_12px_16px_rgba(0,0,0,0.15)]
  '
              >
                <div className='min-w-0'>
                  <p className='font-medium truncate text-gray-800'>{job.title}</p>
                  <p className='text-xs text-gray-500'>
                    Date: {new Date(job.dateISO).toLocaleDateString()}
                  </p>
                </div>

                <StarRating value={job.rating ?? 0} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='w-full flex justify-end mt-4'>
        <Link
          href='/fixers/68e87a9cdae3b73d8040102f/comments'
          className='px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition'
        >
          Ir a los comentarios
        </Link>
      </div>
    </section>
  );
}

export default function RatedJobsPage() {
  const [jobs, setJobs] = useState<RatedJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [slowLoading, setSlowLoading] = useState<boolean>(false);
  const [currentSort, setCurrentSort] = useState<string>('recent');

  const fetchJobs = async (sortParam: string) => {
    const slowTimer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setSlowLoading(true);
    }, 2000);

    setLoading(true);
    setError(null);

    try {
      const result = await apiFetch<{ data?: RatedJob[] }>(`api/rated-jobs?sortBy=${sortParam}`);
      setJobs(result.data ?? []);
    } catch (err) {
      console.warn('Error fetching jobs:', err);
      setError('Sin conexión. Intenta de nuevo más tarde');
    } finally {
      setLoading(false);
      clearTimeout(slowTimer);
      setSlowLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs('recent');
  }, []);

  const handleRatingSort = (key: string) => {
    setCurrentSort(key);
    fetchJobs(key);
  };

  const handleDateSort = (key: string) => {
    setCurrentSort(key);
    fetchJobs(key);
  };

  const disableDropdowns = !!error || (jobs.length === 0 && !loading);

  return (
    <main className={`min-h-screen bg-white text-gray-700 ${roboto.className}`}>
      <div className='max-w-3xl mx-auto p-6 space-y-6'>
        <header className='flex flex-col items-center w-full'>
          <h1 className='text-2xl font-semibold tracking-tight text-center'>
            Lista de trabajos calificados
          </h1>
          <div className='mt-3 flex items-center gap-4 w-full justify-end'>
            <div className='flex items-center mr-2 min-h-[32px]'>
              {loading && (
                <div className='flex items-center gap-2'>
                  <svg
                    className='animate-spin h-5 w-5 text-blue-600'
                    viewBox='0 0 24 24'
                    aria-hidden
                  >
                    <circle
                      cx='12'
                      cy='12'
                      r='10'
                      strokeWidth='4'
                      stroke='#3b82f6'
                      strokeOpacity='0.25'
                      fill='none'
                    />
                    <path
                      d='M22 12a10 10 0 0 1-10 10'
                      strokeWidth='4'
                      stroke='#3b82f6'
                      strokeLinecap='round'
                      fill='none'
                    />
                  </svg>
                  <span className='text-sm text-gray-500'>Procesando...</span>
                </div>
              )}
              {slowLoading && !error && (
                <div className='flex items-center gap-2'>
                  <svg
                    className='animate-spin h-5 w-5 text-yellow-500'
                    viewBox='0 0 24 24'
                    aria-hidden
                  >
                    <circle
                      cx='12'
                      cy='12'
                      r='10'
                      strokeWidth='4'
                      stroke='#eab308'
                      strokeOpacity='0.25'
                      fill='none'
                    />
                    <path
                      d='M22 12a10 10 0 0 1-10 10'
                      strokeWidth='4'
                      stroke='#eab308'
                      strokeLinecap='round'
                      fill='none'
                    />
                  </svg>
                  <span className='text-sm text-gray-500'>Cargando trabajos calificados...</span>
                </div>
              )}
              {error && (
                <p className='text-sm text-red-600'>Sin conexión. Intenta de nuevo más tarde</p>
              )}
            </div>

            <GenericDropdown
              label='Ordenar por calificación'
              disabled={disableDropdowns}
              onSelect={handleRatingSort}
              selectedKey={
                ['rating_asc', 'rating_desc'].includes(currentSort) ? currentSort : undefined
              }
              options={[
                { key: 'rating_desc', label: 'Descendente' },
                { key: 'rating_asc', label: 'Ascendente' },
              ]}
            />

            <GenericDropdown
              label='Ordenar por fecha'
              disabled={disableDropdowns}
              onSelect={handleDateSort}
              selectedKey={['recent', 'oldest'].includes(currentSort) ? currentSort : undefined}
              options={[
                { key: 'recent', label: 'Mas reciente' },
                { key: 'oldest', label: 'Mas antiguo' },
              ]}
            />
          </div>
        </header>

        <RatedJobsList jobs={jobs} />
      </div>
    </main>
  );
}
