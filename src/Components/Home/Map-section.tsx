import React from 'react';
import { useTranslations } from 'next-intl';
export default function MapSection() {
  const t = useTranslations('Map');
  return (
    <div className='mb-16'>
      <div className='text-center mb-8'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>{t('mapTitle')}</h2>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>{t('mapDescription')}</p>
      </div>
      <div className='h-96 bg-gray-100 rounded-xl overflow-hidden'>
        <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10'>
          <p className='text-gray-500 text-lg'>{t('mapInteractive')}</p>
        </div>
      </div>
    </div>
  );
}
