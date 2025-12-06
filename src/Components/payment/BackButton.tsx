'use client';
import { useRouter } from 'next/navigation';

export default function BackButton({
  fallback = '/payments',
  className = '',
}: {
  fallback?: string;
  className?: string;
}) {
  const router = useRouter();
  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length <= 1) router.push(fallback);
    else router.back();
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2B31E0] text-white hover:bg-gray-800 text-sm shadow-lg ${className}`}
      aria-label='Volver'
    >
      <span aria-hidden>←</span> Volver
    </button>
  );
}
