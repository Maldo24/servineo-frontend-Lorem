import { X } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';

interface ClearButtonProps {
  onClick: () => void;
}

export const ClearButton = ({ onClick }: ClearButtonProps) => {
  const t = useTranslations('search');

  return (
    <button
      onClick={onClick}
      type="button"
      className="absolute right-2 top-1/2 z-[2] -translate-y-1/2 flex items-center justify-center w-5 h-5 bg-transparent border-none cursor-pointer p-0"
      aria-label={t('clearSearch')}
    >
      <X size={16} color="#888" />
    </button>
  );
};
