'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ButtonLimpiarDatosProps {
  onClick: () => void;
  disabled?: boolean;
}

const ButtonLimpiarDatos: React.FC<ButtonLimpiarDatosProps> = ({ onClick, disabled = false }) => {
  const t = useTranslations('advancedSearch.buttons');

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${
        disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2B6AE0] hover:bg-[#265ACC]'
      } text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors duration-300 shadow-md`}
    >
      {t('clearData')}
    </button>
  );
};

export default ButtonLimpiarDatos;
