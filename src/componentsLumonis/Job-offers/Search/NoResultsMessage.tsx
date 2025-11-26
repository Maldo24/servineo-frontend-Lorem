import { useTranslations } from 'next-intl';

type NoResultsMessageProps = {
  search: string;
};

export const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ search }) => {
  const t = useTranslations('search');
  const trimmed = search?.trim();

  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-xl font-roboto font-normal">
        {t('noResults')}
        {trimmed && (
          <>
            {' '}
            {t('for')} <span className="font-bold">&quot;{trimmed}&quot;</span>
          </>
        )}
      </p>
    </div>
  );
};
