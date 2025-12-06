'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '../Common/StatCard';
import { useTranslations } from 'next-intl';
import { SearchBar } from './Searchbar-section';

type HeroSectionProps = {
  isFixer?: boolean;
};

export default function HeroSection({ isFixer = false }: HeroSectionProps) {
  const t = useTranslations('HeroSection');
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const handleSearch = (query: string) => {
    const trimmedSearch = query.trim();
    if (trimmedSearch) {
      router.push(`/job-offer-list?search=${encodeURIComponent(trimmedSearch)}`);
    } else {
      router.push('/job-offer-list');
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/job-offer-list?search=${encodeURIComponent(tag)}`);
  };

  const titleText = isFixer ? 'Haz crecer tu trabajo con nosotros' : t('title');
  const subtitleText = isFixer
    ? 'Recibe solicitudes de reparación y mantenimiento de personas cerca de ti'
    : t('subtitle');
  const placeholderText = isFixer ? 'Busca solicitudes de trabajo' : t('placeholder');

  return (
    <section
      id='tour-hero-section'
      className='relative w-full pt-28 pb-16 px-4 md:px-12 text-center bg-gradient-to-br from-primary/5 via-white to-primary/10 overflow-hidden'
    >
      {/* Decoraciones de fondo */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-5" />
      <div className='absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-[pulse_8s_ease-in-out_infinite]' />
      <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-[pulse_8s_ease-in-out_infinite] animation-delay-2000' />

      {/* Contenido */}
      <div className='max-w-6xl mx-auto relative z-10'>
        {/* Título */}
        <h1 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent drop-shadow-sm'>
          {titleText}
        </h1>

        {/* Subtítulo */}
        <p className='text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto font-medium'>
          {subtitleText}
        </p>

        {/* Barra de búsqueda: SOLO si NO es fixer */}
        {!isFixer && (
          <div className='mb-10 max-w-2xl mx-auto' id='tour-search-bar'>
            <SearchBar
              value={searchText}
              onChange={setSearchText}
              placeholder={placeholderText}
              onSearch={handleSearch}
              showButton={true}
              buttonText={t('search')}
            />
          </div>
        )}

        {/* Búsquedas populares: SOLO para usuario normal */}
        {!isFixer && (
          <div className='mb-16'>
            <div className='flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-6'>
              <span className='font-semibold text-gray-700 text-lg'>{t('a')}</span>
              <div className='flex flex-wrap justify-center gap-2'>
                {['Plomero', 'Electricista', 'Pintor', 'Carpintero'].map((tag) => (
                  <button
                    key={tag}
                    type='button'
                    onClick={() => handleTagClick(tag)}
                    className='px-4 py-2 text-sm bg-white border border-gray-200 text-gray-800 rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow'
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats: cambian según rol */}
        <div id='tour-stats-section' className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16'>
          {isFixer ? (
            <>
              <StatCard number='24/7' text='Soporte disponible' />
              <StatCard number='100%' text='Pago seguro' />
              <StatCard number='10+' text='Categorías de servicios' />
            </>
          ) : (
            <>
              <StatCard number='1,000+' text={t('professional')} />
              <StatCard number='5,000+' text={t('Projects completed')} />
              <StatCard number='4.8 ★' text={t('Overall grade')} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}