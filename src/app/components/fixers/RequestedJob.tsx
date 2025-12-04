'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function RequestedJob({
  name = '',
  jobTitle = '',
  schedule = '',
  state = '',
  onAppointmentDetails,
  onRegisterJob,
  onViewPromos,
  onCreatePromo,
  className = '',
}: {
  name: string;
  jobTitle: string;
  schedule: string;
  state: string;
  onAppointmentDetails?: () => void;
  onRegisterJob?: () => void;
  onViewPromos?: () => void;
  onCreatePromo?: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const normalized = String(state || '').toLowerCase();
  const badge = getStateBadgeClasses(normalized);

  const handleAppointment = () => {
    onAppointmentDetails?.();
    setOpen(false);
  };

  const handleRegister = () => {
    onRegisterJob?.();
    setOpen(false);
  };

  const handleViewPromos = () => {
    onViewPromos?.();
    setOpen(false);
  };
  const handleCreatePromo = () => {
    onCreatePromo?.();
    setOpen(false);
  };

  return (
    <div
      className={`w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 ${className}`}
    >
      <div className='flex-1 min-w-0'>
        <div className='inline-flex items-center max-w-full'>
          <span className='truncate inline-flex items-center px-2.5 py-0.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium'>
            {name}
          </span>
        </div>
        <div className='mt-1 flex items-center gap-2 text-gray-700 min-w-0'>
          <span className='font-medium truncate'>{jobTitle}</span>
          <span className='text-gray-400' aria-hidden>
            •
          </span>
          <span className='text-sm text-gray-500 whitespace-nowrap shrink-0'>{schedule}</span>
        </div>
      </div>
      <div
        className='flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end'
        ref={menuRef}
      >
        <div className='flex items-center gap-2 text-gray-500'>
          <span className='text-sm'>State</span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${badge} w-28 sm:w-32 truncate whitespace-nowrap text-center`}
          >
            {capitalizeFirst(normalized || 'unknown')}
          </span>
        </div>

        <div className='relative'>
          <button
            type='button'
            aria-haspopup='menu'
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <span className='sr-only'>Open menu</span>
            <KebabIcon />
          </button>

          {open && (
            <div
              role='menu'
              className='absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none z-20'
            >
              <button
                role='menuitem'
                onClick={handleAppointment}
                className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
              >
                Appointment details
              </button>
              <div className='h-px bg-gray-100' />
              <button
                role='menuitem'
                onClick={handleRegister}
                className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
              >
                Register job
              </button>
              <div className='h-px bg-gray-100' />
              <button
                role='menuitem'
                onClick={handleViewPromos}
                className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
              >
                View promos
              </button>
              <div className='h-px bg-gray-100' />
              <button
                role='menuitem'
                onClick={handleCreatePromo}
                className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
              >
                Create promo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function capitalizeFirst(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getStateBadgeClasses(state: string) {
  switch (state) {
    case 'accepted':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'completed':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

function KebabIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
      {...props}
    >
      <path
        d='M12 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'
        className='fill-current'
      />
    </svg>
  );
}
