'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/Components/ui/button';
import { useTranslations } from 'next-intl';

interface AdvancedSearchButtonProps {
  src?: string;
  alt?: string;
}

export function AdvancedSearchButton({
  src = '/img/advSearch.jpg',
  alt,
}: AdvancedSearchButtonProps) {
  const t = useTranslations('search');
  const router = useRouter();

  const handleClick = () => {
    router.push('/adv-search');
  };

  return (
    <Button
      onClick={handleClick}
      aria-label={t('goToAdvancedSearch')}
      size="lg"
      className="
        bg-[#2B6AE0] text-white
        hover:bg-[#2B6AE0]/90
        shrink-0
        px-1 sm:px-2
        py-2 sm:py-5
        text-sm sm:text-base
        font-semibold
        rounded
        shadow
        transition-all duration-200
        flex items-center justify-center
      "
    >
      <div className="flex-shrink-0">
        <Image
          src={src}
          alt={alt ?? t('advancedSearch')}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      </div>
    </Button>
  );
}
