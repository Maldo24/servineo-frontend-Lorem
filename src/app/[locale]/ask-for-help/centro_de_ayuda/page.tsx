'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Search, HelpCircle, Users } from 'lucide-react';
import WhatsappBanner from "@/Components/ask_for_help/WhatsappBanner";

interface Suggestion {
  id: number;
  title: string;
  url: string;
}

const CentroDeAyuda: React.FC = () => {
  const router = useRouter();
  const t = useTranslations('helpCenter');
  const locale = useLocale();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  /** Muestra un mensaje temporal */
  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    const timeoutId = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  /** Redirección centralizada */
  const handleRedirect = useCallback(
    (target: string, url: string | null = null) => {
      let finalUrl: string;

      switch (target) {
        case 'Preguntas Frecuentes sobre Servineo':
        case 'Preguntas Frecuentes (FAQ)':
        case 'Frequently Asked Questions (FAQ)':
          finalUrl = `/${locale}/ask-for-help/preguntas-frecuentes`;
          break;
        case 'Foro de Usuarios':
        case 'User Forum':
          finalUrl = `/${locale}/ask-for-help/foro-usuario`;
          break;
        case 'Home':
          finalUrl = `/${locale}`;
          break;
        case 'Perfil':
        case 'Profile':
          finalUrl = `/${locale}/perfil`;
          break;
        default:
          finalUrl = url || `/${locale}/${target.toLowerCase().replace(/\s/g, '-')}`;
      }

      if (typeof window !== 'undefined') {
        router.push(finalUrl);
      } else {
        console.log(`[REDIRECCIÓN SIMULADA] → ${finalUrl}`);
        showMessage(t('messages.navigating', { url: finalUrl }));
      }
    },
    [router, showMessage, locale, t],
  );

  /** Ejecuta búsqueda */
  const handleSearchSubmit = useCallback(
    (
      event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>,
      customQuery?: string,
    ) => {
      if (event && 'preventDefault' in event) event.preventDefault();

      const query = customQuery || searchTerm.trim();

      if (!query) {
        setIsSearching(false);
        showMessage(t('messages.emptySearch'));
        return;
      }

      setSuggestions([]);
      setIsSearching(true);
      setIsLoading(true);

      showMessage(t('messages.searching', { query }));

      setTimeout(() => {
        setIsLoading(false);

        if (query.toLowerCase().includes('pago') || query.toLowerCase().includes('payment')) {
          setSuggestions([
            { id: 1, title: t('suggestions.paymentProblems'), url: '/ayuda/pago-problemas' },
            { id: 2, title: t('suggestions.paymentMethods'), url: '/ayuda/metodos-pago' },
          ]);
        } else if (
          query.toLowerCase().includes('faq') ||
          query.toLowerCase().includes('pregunta') ||
          query.toLowerCase().includes('question')
        ) {
          setSuggestions([
            {
              id: 99,
              title: t('sections.faq.title'),
              url: `/${locale}/ask-for-help/preguntas-frecuentes`,
            },
          ]);
        } else {
          setSuggestions([]);
          showMessage(t('messages.noResults', { query }));
        }
      }, 600);
    },
    [searchTerm, showMessage, t, locale],
  );

  /** Click sobre sugerencia */
  const handleSuggestionClick = useCallback(
    (suggestion: Suggestion) => {
      setSearchTerm(suggestion.title);
      setSuggestions([]);
      handleSearchSubmit(undefined, suggestion.title);
    },
    [handleSearchSubmit],
  );

  /** Autocompletado */
  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    setIsSearching(false);

    if (query.length < 2) {
      setSuggestions([]);
      if (isLoading) setIsLoading(false);
      return;
    }

    const simSuggestions: Suggestion[] = [
      { id: 10, title: t('suggestions.paymentProblems'), url: '/ayuda/pago-problemas' },
      { id: 11, title: t('suggestions.resetPassword'), url: '/ayuda/restablecer' },
      { id: 12, title: t('suggestions.billing'), url: '/ayuda/facturacion' },
      {
        id: 13,
        title: t('suggestions.support'),
        url: `/${locale}/ask-for-help/preguntas-frecuentes`,
      },
      {
        id: 14,
        title: t('sections.faq.title'),
        url: `/${locale}/ask-for-help/preguntas-frecuentes`,
      },
    ];

    const filtered = simSuggestions.filter((s) => s.title.toLowerCase().includes(query));

    const handler = setTimeout(() => setSuggestions(filtered), 150);
    return () => clearTimeout(handler);
  }, [searchTerm, isLoading, t, locale]);

  /** Control de visibilidad */
  const normalizedQuery = searchTerm.trim().toLowerCase();

  const isFAQVisible = useMemo(() => {
    return (
      !isSearching &&
      (normalizedQuery.length === 0 ||
        ['pre', 'frec', 'faq', 'duda', 'pregunt', 'question', 'freq'].some((k) =>
          normalizedQuery.includes(k),
        ))
    );
  }, [normalizedQuery, isSearching]);

  const isForumVisible = useMemo(() => {
    return (
      !isSearching &&
      (normalizedQuery.length === 0 ||
        [
          'foro',
          'comunidad',
          'usuario',
          'usuarios',
          'duda',
          'ayuda',
          'forum',
          'community',
          'user',
        ].some((k) => normalizedQuery.includes(k)))
    );
  }, [normalizedQuery, isSearching]);

  const isResultsVisible = useMemo(() => isSearching && !isLoading, [isSearching, isLoading]);

  return (
    <div className='min-h-screen bg-gray-50 py-8 font-sans antialiased'>
      <div className='container mx-auto px-4 max-w-5xl'>
        {/* HEADER */}
        <div className='bg-white rounded-xl shadow-lg p-8 mb-8 relative'>
          <div className='flex flex-col items-center text-center'>
            <h1 className='text-4xl font-bold text-gray-900 mb-3'>{t('title')}</h1>
            <p className='text-gray-600 text-lg max-w-2xl'>{t('subtitle')}</p>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className='bg-white rounded-xl shadow-lg p-6'>
          {/* Buscador */}
          <section className='relative mb-6'>
            <div className='relative'>
              <button
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 p-1 rounded-full transition z-20'
                onClick={() => handleSearchSubmit()}
                aria-label={t('search.button')}
              >
                {isLoading ? (
                  <svg
                    className='animate-spin h-5 w-5 text-blue-500'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                    ></path>
                  </svg>
                ) : (
                  <Search className='h-5 w-5 hover:text-blue-600 transition' />
                )}
              </button>

              <input
                type='text'
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit(e);
                }}
                className='w-full pl-12 pr-10 py-3 border-2 border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:shadow-md'
              />
            </div>

            {/* Sugerencias */}
            {searchTerm.length >= 2 && suggestions.length > 0 && !isSearching && (
              <div className='absolute z-10 mt-2 left-0 right-0'>
                <ul className='bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100'>
                  {suggestions.map((s) => (
                    <li
                      key={s.id}
                      onClick={() => handleSuggestionClick(s)}
                      className='px-4 py-3 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-150'
                    >
                      <p className='font-semibold truncate'>{s.title}</p>
                      <p className='text-xs text-gray-400 truncate'>{s.url}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Mensaje */}
          {message && (
            <div className='mb-4 p-3 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-sm font-medium transition-opacity duration-300'>
              {message}
            </div>
          )}

          {/* Contenido */}
          <main className='pt-0'>
            {isResultsVisible && (
              <div className='mb-6'>
                <h2 className='text-2xl font-bold mb-4 text-gray-800'>
                  {t('results.title', { query: searchTerm })}
                </h2>
                {suggestions.length > 0 ? (
                  <div className='space-y-3'>
                    {suggestions.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => handleRedirect(r.title, r.url)}
                        className='p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition'
                      >
                        <p className='font-semibold text-blue-600'>{r.title}</p>
                        <p className='text-sm text-gray-500 truncate'>{r.url}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center p-10 bg-gray-50 rounded-lg text-gray-500'>
                    <Search className='h-8 w-8 mx-auto mb-3' />
                    <p>{t('results.empty')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Secciones por defecto */}
            {(!isSearching || isLoading) && (
              <div className='space-y-4'>
                {isFAQVisible && (
                  <button
                    onClick={() => handleRedirect(t('sections.faq.title'))}
                    className='w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] duration-200 text-left hover:bg-blue-50'
                  >
                    <div className='p-3 mr-4 rounded-full bg-blue-100 text-blue-600'>
                      <HelpCircle className='h-6 w-6' />
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold text-gray-800'>
                        {t('sections.faq.title')}
                      </h2>
                      <p className='text-sm text-gray-500'>{t('sections.faq.description')}</p>
                    </div>
                  </button>
                )}

                {isForumVisible && (
                  <button
                    onClick={() => handleRedirect(t('sections.forum.title'))}
                    className='w-full flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] duration-200 text-left hover:bg-blue-50'
                  >
                    <div className='p-3 mr-4 rounded-full bg-blue-100 text-blue-600'>
                      <Users className='h-6 w-6' />
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold text-gray-800'>
                        {t('sections.forum.title')}
                      </h2>
                      <p className='text-sm text-gray-500'>{t('sections.forum.description')}</p>
                    </div>
                  </button>
                )}

                {!isFAQVisible && !isForumVisible && normalizedQuery.length > 0 && (
                  <p className='text-center text-gray-500 py-4'>
                    {t('messages.noCategories', { query: searchTerm })}
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
        <WhatsappBanner />
      </div>
    </div>
  );
};

export default CentroDeAyuda;
