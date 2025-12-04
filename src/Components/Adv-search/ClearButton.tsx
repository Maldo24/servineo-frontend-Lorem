'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ClearButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const ClearButton: React.FC<ClearButtonProps> = ({ onClick, disabled = false, className = '' }) => {
  const t = useTranslations('advancedSearch.buttons');

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={`${
        disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2B6AE0] hover:bg-[#265ACC]'
      } text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors duration-300 shadow-md ${className}`}
    >
      {disabled ? t('loading') : t('clearData')}
    </button>
  );
};

export default ClearButton;
