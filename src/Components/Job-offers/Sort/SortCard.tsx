'use client';

import { Button } from '@/Components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SORT_OPTIONS } from '@/app/lib/constants/sortOptions';

interface SortCardProps {
  value: string; // Valor del backend: 'rating', 'recent', etc.
  onSelect: (backendValue: string) => void;
}

export default function SortCard({ value, onSelect }: SortCardProps) {
  const t = useTranslations();

  // Opciones con valor backend y label traducido
  const sortOptions = [
    { value: SORT_OPTIONS.DESTACADOS, label: t('sortBy.featured') },
    { value: SORT_OPTIONS.RECIENTES, label: t('sortBy.mostRecent') },
    { value: SORT_OPTIONS.ANTIGUOS, label: t('sortBy.oldest') },
    { value: SORT_OPTIONS.NOMBRE_ASC, label: t('sortBy.nameAZ') },
    { value: SORT_OPTIONS.NOMBRE_DESC, label: t('sortBy.nameZA') },
    { value: SORT_OPTIONS.CONTACTO_ASC, label: t('sortBy.contactAsc') },
    { value: SORT_OPTIONS.CONTACTO_DESC, label: t('sortBy.contactDesc') },
  ];

  // Obtener el label traducido del valor actual
  const currentLabel =
    sortOptions.find((opt) => opt.value === value)?.label || t('sortBy.mostRecent');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='flex font-bold items-center gap-2
          !bg-[#2B6AE0] !text-white !transition-colors hover:!bg-[#2B6AE0]/90
            !shadow-md
            focus-visible:!ring-0 focus-visible:!ring-offset-0
            py-5'
        >
          {currentLabel}
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        className='!bg-white !border-black !shadow-md !rounded-lg z-70'
      >
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSelect(option.value)} // Envía valor backend
            className={`cursor-pointer !px-3 !py-2 !rounded-md !transition-colors ${
              value === option.value // Comparación correcta con valor backend
                ? '!bg-[#2B6AE0] !text-white'
                : 'hover:!bg-[#1AA7ED] hover:!text-white'
            }`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
