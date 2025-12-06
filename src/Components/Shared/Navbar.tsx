'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Briefcase, UserCog, ClipboardList } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/redux/hooks';
import { resetFilters } from '@/app/redux/slice/jobOfert';

export function Navbar() {
  const t = useTranslations('navbar');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isActive = (path: string) => pathname === `/${locale}${path}`;

  const handleJobOffersClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(resetFilters());
    router.push('/job-offer-list');
  };

  return (
    <nav className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* NAV LINKS distribuidos a lo largo */}
          <div className='flex items-center w-full justify-between'>
            <Link
              href={`/${locale}/become-fixer`}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/fixers-by-job')
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <ClipboardList className='w-4 h-4' />
              <span className='font-medium text-center'>{t('a')}</span>
            </Link>

            <Link
              href='/become-fixer'
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/become-fixer')
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <UserCog className='w-4 h-4' />
              <span className='font-medium text-center'>{t('becomeFixer')}</span>
            </Link>

            <Link
              href={`/${locale}/fixer/my-offers`}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/fixer/my-offers')
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <ClipboardList className='w-4 h-4' />
              <span className='font-medium text-center'>{t('myOffers')}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
