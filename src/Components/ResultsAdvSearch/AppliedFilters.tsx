'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DB_TO_TRANSLATION_KEY } from '@/app/redux/contants';

type NoResultsMessageProps = {
  search: string;
};

export const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ search }) => {
  const t = useTranslations('search');
  const trimmed = search?.trim();

  return (
    <div className='text-center py-12'>
      <p className='text-gray-500 text-xl font-roboto font-normal'>
        {t('noResults')}
        {trimmed && (
          <>
            {' '}
            {t('for')} <span className='font-bold'>&quot;{trimmed}&quot;</span>
          </>
        )}
      </p>
    </div>
  );
};

type FilterParamValue = string | string[] | number | boolean | null;

interface Props {
  params: Record<string, FilterParamValue>;
  onModify?: () => void;
}

function formatPriceString(s: string) {
  if (!s) return s;
  return s.replace(/\$\s*([0-9]+(?:\.\d+)?)/g, '$1bs');
}

export default function AppliedFilters({ params, onModify }: Props) {
  const router = useRouter();
  const t = useTranslations('search');
  const tAdv = useTranslations('advancedSearch');

  const translateDbValue = (value: string): string => {
    const translationKey = DB_TO_TRANSLATION_KEY[value as keyof typeof DB_TO_TRANSLATION_KEY];
    if (translationKey) {
      return tAdv(translationKey as Parameters<typeof tAdv>[0]);
    }
    return value;
  };

  const handleModify = () => {
    if (onModify) return onModify();
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, val]) => {
      if (val == null) return;
      if (Array.isArray(val)) {
        val.forEach((v) => sp.append(k, String(v)));
      } else {
        sp.set(k, String(val));
      }
    });
    router.push(`/adv-search?${sp.toString()}`);
  };

  const renderTranslatedValue = (v: FilterParamValue): string | null => {
    if (v == null) return null;

    if (Array.isArray(v)) {
      const translated = v.map((item) => translateDbValue(String(item)));
      return translated.join(', ');
    }

    return translateDbValue(String(v));
  };

  return (
    <div className='w-full max-w-5xl mx-auto mt-6 px-4'>
      <div className="bg-white border rounded-lg shadow-sm p-4 flex items-center justify-between font-['Roboto'] text-sm">
        <div>
          <p className='text-sm font-semibold text-gray-700'>{t('searchPlaceholder')}</p>
          <div className='mt-2 flex flex-wrap gap-2'>
            {(() => {
              const minRaw = params['minPrice'] as FilterParamValue;
              const maxRaw = params['maxPrice'] as FilterParamValue;
              const tags: React.ReactNode[] = [];

              const hasMin = minRaw != null && minRaw !== '';
              const hasMax = maxRaw != null && maxRaw !== '';

              if (hasMin || hasMax) {
                const minN = Number(minRaw);
                const maxN = Number(maxRaw);
                const minValid = !Number.isNaN(minN);
                const maxValid = !Number.isNaN(maxN);
                let text = '';
                if (minValid && maxValid) {
                  text = `${t('price')}: ${minN}bs - ${maxN}bs`;
                } else if (minValid && !maxValid) {
                  text = `${t('price')}: ${t('moreThan')} ${minN}bs`;
                } else if (!minValid && maxValid) {
                  text = `${t('price')}: ${t('lessThan')} ${maxN}bs`;
                }

                tags.push(
                  <span
                    key='price'
                    className='inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded'
                  >
                    {text}
                  </span>,
                );
              }

              Object.entries(params).forEach(([k, v]) => {
                if (k === 'minPrice' || k === 'maxPrice') return;

                if (k === 'sortBy' && typeof v === 'string') {
                  const txt =
                    v === 'recent' ? t('mostRecent') : v === 'oldest' ? t('oldest') : String(v);
                  tags.push(
                    <span
                      key={k}
                      className='inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded'
                    >
                      {txt}
                    </span>,
                  );
                  return;
                }

                if (k === 'titleOnly' && v === true) {
                  tags.push(
                    <span
                      key={k}
                      className='inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded'
                    >
                      {t('titleOnly')}
                    </span>,
                  );
                  return;
                }

                if (k === 'exact' && v === true) {
                  tags.push(
                    <span
                      key={k}
                      className='inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded'
                    >
                      {t('exactWords')}
                    </span>,
                  );
                  return;
                }

                if (k === 'date' && typeof v === 'string') {
                  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                  const dateLabel = m ? `${m[3]}/${m[2]}/${m[1]}` : String(v);
                  tags.push(
                    <span
                      key={k}
                      className='inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded'
                    >
                      {`${t('date')}: ${dateLabel}`}
                    </span>,
                  );
                  return;
                }

                if (k === 'rating' && (typeof v === 'number' || typeof v === 'string')) {
                  const ratingNum = typeof v === 'string' ? parseFloat(v) : v;
                  if (!Number.isNaN(ratingNum)) {
                    tags.push(
                      <span
                        key={k}
                        className='inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded'
                      >
                        {`Calificación: ${ratingNum.toFixed(1)}`}
                      </span>,
                    );
                    return;
                  }
                }

                let value = renderTranslatedValue(v as FilterParamValue);
                if (!value) return;
                if (value.includes('$')) value = formatPriceString(value);

                tags.push(
                  <span
                    key={k}
                    className='inline-block bg-sky-50 text-sky-500 text-sm px-3 py-1 rounded'
                  >
                    {value}
                  </span>,
                );
              });

              return tags;
            })()}
          </div>
        </div>

        <div className='flex items-center mt-3'>
          <button
            type='button'
            onClick={handleModify}
            className='bg-[#2B6AE0] text-white hover:bg-[#2B6AE0]/90 px-4 py-2 text-sm sm:text-base font-roboto font-semibold rounded shadow transition-all duration-200'
          >
            {t('modify')}
          </button>
        </div>
      </div>
    </div>
  );
}
