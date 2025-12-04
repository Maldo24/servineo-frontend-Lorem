'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function TerminosPage() {
  const t = useTranslations('TerminosPage');

  return (
    <main className='max-w-4xl mx-auto p-6 md:p-12'>
      <h1 className='text-3xl font-bold mb-6 text-center'>{t('title')}</h1>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>{t('section1.title')}</h2>
        <p>{t('section1.content')}</p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>{t('section2.title')}</h2>
        <p>{t('section2.content1')}</p>
        <p>{t('section2.content2')}</p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>{t('section3.title')}</h2>
        <p>{t('section3.content')}</p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>{t('section4.title')}</h2>
        <p>{t('section4.content')}</p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>{t('section5.title')}</h2>
        <p>{t('section5.content')}</p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>{t('section6.title')}</h2>
        <p>{t('section6.content')}</p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>{t('section7.title')}</h2>
        <p>{t('section7.content')}</p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>{t('section8.title')}</h2>
        <p>
          {t('section8.content')}{' '}
          <a href='mailto:XXXXXXXX#@gmail.com' className='text-blue-600 hover:underline'>
            XXXXXXXX#@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
