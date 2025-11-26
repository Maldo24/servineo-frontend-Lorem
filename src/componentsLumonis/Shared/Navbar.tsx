'use client';

import Link from 'next/link';
import { Briefcase, UserCog, ClipboardList } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/redux/hooks';
import { resetFilters } from '@/app/redux/slice/jobOfert';
import { clearJobOffersStorage } from '@/app/redux/features/jobOffers/storage';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isActive = (path: string) => pathname.includes(path)

  const handleJobOffersClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    clearJobOffersStorage();
    dispatch(resetFilters());
    router.push('/job-offer-list');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo o nombre del sitio */}
          <Link href="/" className="text-xl font-bold bg-primary bg-clip-text text-transparent">
            Logo
          </Link>

          {/* Navegación principal */}
          <div className="flex items-center gap-1">
            <Link
              href="/job-offer-list"
              onClick={handleJobOffersClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/job-offer-list')
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">Ofertas de Trabajo</span>
            </Link>

            <Link
              href="/fixers-by-job"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive("/fixers-by-job")
                  ? "bg-primary text-white shadow-lg shadow-blue-500/30"
                  : "text-blue-900 hover:bg-blue-50"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span className="font-medium">Fixers Por Trabajo</span>
            </Link>

            <Link
              href="/become-fixer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/become-fixer')
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <UserCog className="w-4 h-4" />
              <span className="font-medium">Convertirse en Fixer</span>
            </Link>

            <Link
              href="/fixer/my-offers"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/fixer/my-offers')
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span className="font-medium">Mis Ofertas</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
