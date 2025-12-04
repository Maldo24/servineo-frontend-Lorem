'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLocale } from 'next-intl';

export const TranslationButton = () => {
  const router = useRouter();
  const pathName = usePathname();
  const currentLocale = useLocale();
  const [showMenu, setShowMenu] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleLanguageChange = (lang: string) => {
    const segments = pathName.split('/');
    segments[1] = lang;
    router.push(segments.join('/'));
    setShowMenu(false);
  };

  if (!isMounted) return null;

  return (
    <div className='fixed bottom-4 right-4 z-[9999]'>
      <div className='relative'>
        <button
          onClick={toggleMenu}
          className='bg-primary text-white rounded-full p-3 shadow-2xl hover:shadow-primary/50 active:scale-95 sm:hover:scale-110 transition-all duration-300 cursor-pointer touch-manipulation'
          aria-label='Cambiar idioma'
        >
          <Globe size={20} className='sm:w-6 sm:h-6' />
        </button>

        {/* Dropdown */}
        {showMenu && (
          <>
            {/* Overlay para cerrar al hacer clic fuera */}
            <div className='fixed inset-0 z-[9998]' onClick={() => setShowMenu(false)} />

            <div className='absolute bottom-full mb-2 right-0 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 w-40 p-2 z-[9999]'>
              <button
                onClick={() => handleLanguageChange('es')}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                  currentLocale === 'es'
                    ? 'bg-primary text-white font-semibold'
                    : 'hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <span className='flex items-center gap-2'>
                  <span className='text-lg'>🇪🇸</span>
                  <span>Español</span>
                </span>
                {currentLocale === 'es' && <Check size={16} />}
              </button>

              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                  currentLocale === 'en'
                    ? 'bg-primary text-white font-semibold'
                    : 'hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <span className='flex items-center gap-2'>
                  <span className='text-lg'>🇬🇧</span>
                  <span>English</span>
                </span>
                {currentLocale === 'en' && <Check size={16} />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
