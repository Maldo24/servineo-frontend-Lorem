import { Button } from '@/Components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import React from 'react';

export function FilterButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      size="lg"
      className="
        bg-[#f7f7f7] text-white hover:bg-[#ffffff] 
        shrink-0
        w-10
        px-2
        rounded-[8px] sm:rounded-[10px] 
        flex items-center justify-center 
        font-roboto 
        shadow-lg sm:shadow-xl 
        ring-1 sm:ring-2 
        cursor-pointer 
        border border-black 
        transition-all duration-200
      "
      {...props}
    >
      <SlidersHorizontal size={18} color="black" />
    </Button>
  );
}
