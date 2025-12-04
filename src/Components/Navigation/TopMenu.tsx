'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Wrench, UserCircle, Home, Briefcase, HelpCircle } from 'lucide-react';
import { useGetUserByIdQuery } from '@/app/redux/services/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/app/redux/slice/userSlice';
import { IUser } from '@/types/user';
import { useTranslations } from 'next-intl';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface RootState {
  user: UserState;
}

export default function TopMenu() {
  const t = useTranslations('TopMenu');
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.user);

  const [scrolled, setScrolled] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLButtonElement | null>(null);

  const navItems = [
    { name: t('nav.home'), href: '/', icon: <Home className='h-5 w-5' /> },
    { name: t('nav.jobOffers'), href: '/job-offer-list', icon: <Briefcase className='h-5 w-5' /> },
    {
      name: t('nav.help'),
      href: '/ask-for-help/centro_de_ayuda',
      icon: <HelpCircle className='h-5 w-5' />,
    },
  ];

  const [currentPath, setCurrentPath] = useState('');

  // Detectar ruta actual
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Obtener userId desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('servineo_user');
    if (token) {
      const userData = JSON.parse(token);
      setUserId(userData._id);
    }
  }, []);

  // Consultar user por ID
  const { data: userData } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  // Guardar user en redux
  useEffect(() => {
    if (userData) dispatch(setUser(userData));
  }, [userData, dispatch]);

  // Scroll y login
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    const token = localStorage.getItem('servineo_token');
    setIsLogged(!!token);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem('servineo_token');
    localStorage.removeItem('servineo_user');
    window.location.reload();
  };

  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/';
    }
  };

  // Botón de rol para Desktop
  const getRoleButton = () => {
    if (loading || !user) return null;
    if (!user.role) return null;

    if (user.role === 'requester') {
      return (
        <Link
          href='/become-fixer'
          className='flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-primary transition-colors'
        >
          <Wrench className='h-4 w-4' />
          {t('buttons.becomeFixer')}
        </Link>
      );
    }

    if (user.role === 'fixer') {
      return (
        <Link
          href='/fixer/dashboard'
          className='flex items-center gap-2 text-white px-4 py-2 rounded-md text-sm font-medium bg-primary transition-colors'
        >
          <UserCircle className='h-4 w-4' />
          {t('buttons.fixerProfile')}
        </Link>
      );
    }
    return null;
  };

  return (
    <>
      {/* DESKTOP HEADER */}
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-white'
        } border-b border-gray-100`}
        role='banner'
      >
        <div className='w-full max-w-8xl mx-auto px-4 flex items-center h-16'>
          {/* Logo */}
          <button
            ref={logoRef}
            onClick={handleLogoClick}
            className='flex items-center gap-2 group transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]'
            aria-label='Ir al inicio'
          >
            <div className='relative overflow-hidden rounded-full shadow-md'>
              <Image
                src='/es/img/icon.png'
                alt='Logo de Servineo'
                width={40}
                height={40}
                className='transition-transform duration-300 group-hover:scale-110'
              />
            </div>
            <span
              className='text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]'
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Servineo
            </span>
          </button>

          {/* Desktop Nav */}
          <div className='flex-1 flex justify-center'>
            <nav className='flex gap-6' role='navigation' aria-label='Menú principal'>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--color-primary)] after:transition-all
                  ${currentPath === item.href ? 'text-[var(--color-primary)] after:w-full' : 'text-gray-900 hover:text-[var(--color-primary)] after:w-0 hover:after:w-full'}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Right */}
          <div className='flex items-center gap-3'>
            {!isLogged ? (
              <>
                <Link
                  href='/login'
                  className='text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  {t('buttons.login')}
                </Link>
                <Link
                  href='/signUp'
                  className='bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors'
                >
                  {t('buttons.register')}
                </Link>
              </>
            ) : (
              <>
                {getRoleButton()}

                <div className='relative' ref={dropdownRef}>
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className='text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors'
                  >
                    {t('buttons.myAccount')}
                  </button>
                  {accountOpen && (
                    <div className='absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-md py-2 z-50'>
                      <Link
                        href='/requesterEdit'
                        className='block px-4 py-2 text-gray-700 hover:bg-gray-50'
                      >
                        {t('dropdown.editProfile')}
                      </Link>
                      <button
                        onClick={logout}
                        className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50'
                      >
                        {t('dropdown.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE/TABLET HEADER */}
      <div className='lg:hidden'>
        {/* Barra superior */}
        <div className='flex items-center justify-between px-3 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50'>
          {/* Logo */}
          <button onClick={handleLogoClick} className='flex items-center gap-2 min-w-0'>
            <div className='relative overflow-hidden rounded-full shadow-md shrink-0'>
              <Image src='/es/img/icon.png' alt='Servineo' width={32} height={32} />
            </div>
            <span className='text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] truncate max-w-[130px]'>
              Servineo
            </span>
          </button>

          {/* Auth Buttons */}
          {!isLogged ? (
            <div className='flex items-center gap-2 flex-nowrap'>
              <Link
                href='/login'
                className='px-3 py-2 rounded-md text-[var(--color-primary)] font-medium text-[11px] sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap'
              >
                {t('buttons.login')}
              </Link>
              <Link
                href='/signUp'
                className='px-3 py-2 rounded-md bg-[var(--color-primary)] text-white font-medium text-[11px] sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap'
              >
                {t('buttons.register')}
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className='flex items-center gap-2 cursor-pointer px-3 py-1 border border-gray-300 bg-white rounded-xl transition'
            >
              <span className='text-gray-700 font-medium'>{user?.name}</span>
            </button>
          )}

          {/* Dropdown Mobile */}
          {accountOpen && isLogged && (
            <div
              ref={dropdownRef}
              className='absolute top-16 right-3 w-44 bg-white shadow-lg border border-gray-200 rounded-md py-2 z-50'
            >
              <Link
                href='/requesterEdit'
                className='block px-4 py-2 text-gray-700 hover:bg-gray-50'
              >
                {t('dropdown.editProfile')}
              </Link>
              <button
                onClick={logout}
                className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50'
              >
                {t('dropdown.logout')}
              </button>
            </div>
          )}
        </div>
        {/* Barra inferior fija con iconos */}
        <nav className='fixed bottom-0 left-0 right-0 h-16 border-t border-gray-200 bg-white/95 backdrop-blur-sm flex justify-around items-center z-50'>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => (window.location.href = item.href)}
              className={`flex flex-col items-center text-[11px] px-1 py-1 ${
                currentPath === item.href
                  ? 'text-[var(--color-primary)]'
                  : 'text-gray-900 hover:text-[var(--color-primary)]'
              }`}
            >
              {item.icon}
              <span className='mt-1'>{item.name}</span>
            </button>
          ))}
        </nav>
        {/* Espaciadores para contenido */}
        <div className='h-16' /> {/* top */}
        <div className='h-16' /> {/* bottom */}
      </div>

      {/* Spacer Desktop */}
      <div className='hidden lg:block h-16' />
    </>
  );
}
