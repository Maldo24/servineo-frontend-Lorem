import React from 'react';
import Image from 'next/image';

interface Props {
  number: number;
  title: string;
  imageUrl: string;
  descripcion: string;
}

export const PasoCards = ({ number, title, imageUrl, descripcion }: Props) => {
  return (
    <div className='flex flex-col items-center text-center gap-[15px]'>
      <div className='flex flex-row gap-[8px]'>
        <strong> {number}. </strong>
        <strong> {title} </strong>
      </div>
      <Image className='rounded-lg w-48 h-45' src={imageUrl} width={200} height={200} alt='' />
      <p className='opacity-[80%]'> {descripcion} </p>
    </div>
  );
};
