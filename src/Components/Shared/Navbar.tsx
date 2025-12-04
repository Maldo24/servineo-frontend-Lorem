'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Briefcase, UserCog, ClipboardList } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/redux/hooks';
import { resetFilters } from '@/app/redux/slice/jobOfert';
//import { clearJobOffersStorage } from '@/app/redux/features/jobOffers/storage';

export function Navbar() {
  const t = useTranslations('navbar');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isActive = (path: string) => pathname === `/${locale}${path}`;

  const handleJobOffersClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    //clearJobOffersStorage();
    dispatch(resetFilters());
    router.push('/job-offer-list');
  };

  return (
    <nav className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo o nombre del sitio */}
          <Link
            href={`/${locale}`}
            className='text-xl font-bold bg-primary bg-clip-text text-transparent'
          >
            {t('logo')}
          </Link>

          {/* Navegación principal */}
          <div className='flex items-center gap-1'>
            <Link
              href={`/${locale}/job-offer-list`}
              onClick={handleJobOffersClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/job-offer-list')
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <Briefcase className='w-4 h-4' />
              <span className='font-medium'>{t('jobOffers')}</span>
            </Link>

            <Link
              href={`/${locale}/become-fixer`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/fixers-by-job')
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <ClipboardList className='w-4 h-4' />
              <span className='font-medium'>{t('a')}</span>
            </Link>

            <Link
              href='/become-fixer'
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/become-fixer')
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <UserCog className='w-4 h-4' />
              <span className='font-medium'>{t('becomeFixer')}</span>
            </Link>

            <Link
              href={`/${locale}/fixer/my-offers`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/fixer/my-offers')
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <ClipboardList className='w-4 h-4' />
              <span className='font-medium'>{t('myOffers')}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
