import { Button } from '@/Components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import React from 'react';

export function FilterButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      size='lg'
      className='
        bg-[#2B6AE0] text-white hover:bg-[#2B6AE0]/90 
        shrink-0
        w-10
        px-2
        rounded-[8px] sm:rounded-[10px] 
        flex items-center justify-center 
        font-roboto 
        shadow-lg sm:shadow-xl 
        ring-1 sm:ring-2 
        cursor-pointer 
        border
        transition-all duration-200
      '
      {...props}
    >
      <SlidersHorizontal size={18} color='white' strokeWidth={2.8} />
    </Button>
  );
}
