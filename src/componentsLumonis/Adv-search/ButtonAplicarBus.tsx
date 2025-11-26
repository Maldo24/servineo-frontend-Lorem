'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ButtonAplicarBusProps {
  onClick: () => void;
  loading?: boolean;
}

const ButtonAplicarBus: React.FC<ButtonAplicarBusProps> = ({ onClick, loading = false }) => {
  const t = useTranslations('advancedSearch.buttons');

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2B6AE0] hover:bg-[#265ACC]'
      } text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors duration-300 shadow-md`}
    >
      {loading ? t('searching') : t('applySearch')}
    </button>
  );
};

export default ButtonAplicarBus;
