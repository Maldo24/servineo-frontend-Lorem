import React from 'react';
import Image from 'next/image';

interface ConsejosCardProps {
  title: string;
  imageUrl: string;
  descripcion: string;
}

export const ConsejosCard = ({ title, imageUrl, descripcion }: ConsejosCardProps) => {
  return (
    <div className='flex flex-col items-center text-center gap-[15px]'>
      <div className='flex flex-col items-center gap-[15px]'>
        <strong> {title} </strong>
        <Image className='rounded-lg w-60 h-45' src={imageUrl} width={200} height={200} alt='' />
        <p className='opacity-[80%]'> {descripcion} </p>
      </div>
    </div>
  );
};
