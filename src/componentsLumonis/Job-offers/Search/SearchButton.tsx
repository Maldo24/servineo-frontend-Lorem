'use client';

import { Button } from '@/Components/ui/button';
import React from 'react';
import { useTranslations } from 'next-intl';

export function SearchButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const t = useTranslations('search'); 
  const { disabled, ...rest } = props;

  return (
    <Button
      size="lg"
      className={`
        bg-[#2B6AE0] text-white
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#2B6AE0]/90'}
        shrink-0
        px-3 sm:px-6 
        py-2 sm:py-5
        text-sm sm:text-base 
        font-semibold 
        rounded 
        shadow
        transition-all duration-200
      `}
      disabled={disabled}
      {...rest}
    >
      {t('buttonSearch')} 
    </Button>
  );
}
