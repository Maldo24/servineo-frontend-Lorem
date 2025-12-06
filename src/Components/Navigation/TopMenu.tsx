'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Wrench, UserCircle, ClipboardList, HelpCircle, Calendar, Wallet, Briefcase } from 'lucide-react';
import { useGetUserByIdQuery } from '@/app/redux/services/userApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/app/redux/slice/userSlice';
import { resetFilters } from '@/app/redux/slice/jobOfert';
import { IUser } from '@/types/user';
import NotificationSystem from '@/app/components/NotificationSystem';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface RootState {
  user: { user: IUser | null };
}

export default function TopMenu() {
  const t = useTranslations();
  const locale = useLocale();

  const localeDefault = (es: string, en: string) => (locale === 'es' ? es : en);

  const resolveT = (key: string, fallbackKey?: string, fallbackText?: string) => {
    try {
      if (fallbackKey) return t(fallbackKey);
    } catch {}
    return fallbackText ?? localeDefault('Iniciar Sesión', 'Log in');
  };
  
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector((state: RootState) => state.user.user);

  // UI state
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '',
  );
  const [isLogged, setIsLogged] = useState<boolean>(() =>
    typeof window !== 'undefined' ? Boolean(localStorage.getItem('servineo_token')) : false,
  );

  // Refs
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // NAV items
  const navItems =
    user?.role === 'fixer'
      ? [
          { name: 'Servicios', href: '/servicios', icon: <Wrench className='h-5 w-5' /> },
          {
            name: 'Ofertas de trabajo',
            href: '/job-offer-list',
            icon: <ClipboardList className='h-5 w-5' />,
          },
          {
            name: 'Agenda',
            href: '/agenda',
            icon: <Calendar className='h-5 w-5' />,
          },
          {
            name: 'Ayuda',
            href: '/ask-for-help/centro_de_ayuda',
            icon: <HelpCircle className='h-5 w-5' />,
          },
        ]
      : [
          { name: 'Servicios', href: '/servicios', icon: <Wrench className='h-5 w-5' /> },
          {
            name: 'Ofertas de trabajo',
            href: '/job-offer-list',
            icon: <ClipboardList className='h-5 w-5' />,
          },
          {
            name: 'Ayuda',
            href: '/ask-for-help/centro_de_ayuda',
            icon: <HelpCircle className='h-5 w-5' />,
          },
        ];

  /* ---------- Helpers ---------- */

  const getPhoto = (u?: IUser | null): string => {
    if (!u) return '/es/img/icon.png';
    const sources: (string | undefined)[] = [u.photo, u.picture, u.url_photo];
    const valid = sources.find((src) => typeof src === 'string' && src.trim().length > 0);
    return valid ?? '/es/img/icon.png';
  };

  const userPhoto = getPhoto(user);

  const goToCentroDePagos = () => {
    const id = user?._id || user?.id || userId;
    if (id) {
      router.push(`/payment/centro-de-pagos?fixerId=${id}`);
      setProfileMenuOpen(false);
      setAccountOpen(false);
    } else {
      console.error('No se encontró el ID del fixer para ir al Centro de Pagos');
    }
  };

  const goToMisTrabajos = () => {
    router.push('/payment/trabajos');
    setProfileMenuOpen(false);
    setAccountOpen(false);
  };

  const goToConfirmarPagos = () => {
    router.push('/payment/Pagos-Fisico');
    setProfileMenuOpen(false);
    setAccountOpen(false);
  };

  /* ---------- Effects ---------- */

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') setCurrentPath(window.location.pathname);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem('servineo_user');
      const token = localStorage.getItem('servineo_token');

      if (raw && raw !== 'undefined') {
        const parsed: IUser = JSON.parse(raw);

        const normalized: IUser = {
          ...parsed,
          photo: parsed.photo || parsed.picture || parsed.url_photo || '',
          picture: parsed.picture || parsed.photo || parsed.url_photo || '',
          url_photo: parsed.url_photo || parsed.photo || parsed.picture || '',
        };

        dispatch(setUser(normalized));
        setIsLogged(Boolean(token));
        setUserId(normalized._id || normalized.id || null);
      } else {
        dispatch(setUser(null));
        setIsLogged(false);
        setUserId(null);
      }
    } catch {
      localStorage.removeItem('servineo_user');
      dispatch(setUser(null));
      setIsLogged(false);
    }
  }, [dispatch]);

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem('servineo_user');
        const token = localStorage.getItem('servineo_token');

        if (raw && raw !== 'undefined') {
          const parsed: IUser = JSON.parse(raw);

          const normalized: IUser = {
            ...parsed,
            photo: parsed.photo || parsed.picture || parsed.url_photo,
            picture: parsed.picture || parsed.photo || parsed.url_photo,
            url_photo: parsed.url_photo || parsed.photo || parsed.picture,
          };

          dispatch(setUser(normalized));
          setIsLogged(Boolean(token));
          setUserId(normalized._id || normalized.id || null);
        } else {
          dispatch(setUser(null));
          setIsLogged(false);
          setUserId(null);
        }
      } catch {
        dispatch(setUser(null));
        setIsLogged(false);
        setUserId(null);
      }
    };

    window.addEventListener('storage', sync);
    window.addEventListener('servineo_user_updated', sync);

    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('servineo_user_updated', sync);
    };
  }, [dispatch]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const logoutOnIdle = () => {
      try {
        const raw = localStorage.getItem('servineo_user');
        const email = raw ? (JSON.parse(raw)?.email ?? '') : '';
        if (email) sessionStorage.setItem('prefill_email', email);
      } catch {}
      localStorage.removeItem('servineo_token');
      localStorage.removeItem('servineo_user');
      dispatch(setUser(null));
      sessionStorage.setItem('session_expired', '1');
      const emailParam = sessionStorage.getItem('prefill_email')
        ? `&email=${encodeURIComponent(sessionStorage.getItem('prefill_email') || '')}`
        : '';
      router.push(`/login?expired=1${emailParam}`);
    };

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(logoutOnIdle, 15 * 60 * 1000);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;
    events.forEach((ev) => window.addEventListener(ev, resetTimer));

    resetTimer();
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [dispatch, router]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        profileMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !profileButtonRef.current?.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, [profileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user data by ID
  const { data: fetchedUser } = useGetUserByIdQuery(userId ?? skipToken);

  useEffect(() => {
    if (fetchedUser) {
      dispatch(setUser(fetchedUser as IUser));
      setIsLogged(true);
    }
  }, [fetchedUser, dispatch]);

  // Logout function with job offers cleanup
  const logout = () => {
    localStorage.removeItem('servineo_token');
    localStorage.removeItem('servineo_user');
    
    // Limpiar estado y persistencia de job offers al cerrar sesión
    try {
      dispatch(resetFilters());
    } catch (e) {
      // no bloquear logout si falla el dispatch
      console.error('Error resetting job offers state on logout', e);
    }
    
    try {
      // Eliminar query string para evitar que se restaure search/page desde la URL
      const path = window.location.pathname;
      window.history.replaceState(null, '', path);
    } catch (e) {
      // ignore
    }
    
    window.location.reload();
  };

  const handleLogoClick = () => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const doLogout = () => {
    try {
      const raw = localStorage.getItem('servineo_user');
      const email = raw ? (JSON.parse(raw)?.email ?? '') : '';
      if (email) sessionStorage.setItem('prefill_email', email);
    } catch {}
    
    // Usar la función logout que incluye limpieza de filtros
    logout();
  };

  /* ---------- Render ---------- */
  return (
    <>
      {/* DESKTOP HEADER */}
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-white'
        } border-b border-gray-100`}
        role='banner'
      >
        <div className='w-full max-w-8xl mx-auto px-4 flex justify-between items-center h-20'>
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
          <div className='flex items-center gap-8'>
            <NotificationSystem
              userId={userId || undefined}
              userName={user?.name}
              isAuthenticated={isLogged}
              userRole={user?.role as 'fixer' | 'requester'}

            />

            {isLogged ? (
              <div className='relative'>
                <button
                  ref={profileButtonRef}
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  className='flex items-center gap-2 cursor-pointer ml-[-20px] px-3 py-1 border border-gray-300 bg-white rounded-xl transition'
                >
                  <img
                    src={userPhoto}
                    alt={user?.name ?? 'Usuario'}
                    className='w-10 h-10 rounded-full object-cover border'
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/es/img/icon.png';
                    }}
                  />
                  <span className='font-medium text-gray-700 hover:text-primary'>
                    {user?.name ?? fetchedUser?.name ?? 'Usuario'}
                  </span>
                </button>

                {profileMenuOpen && (
                  <div
                    ref={dropdownRef}
                    className={`profileMenu ${profileMenuOpen ? 'show' : ''}`}
                    role='dialog'
                    aria-label='Menu de usuario'
                  >
                    <div className='menuHeader'>
                      <strong>Mi cuenta</strong>
                      <button
                        className='closeBtn'
                        onClick={() => setProfileMenuOpen(false)}
                        aria-label='Cerrar menu'
                      >
                        ✕
                      </button>
                    </div>

                    <img className='profilePreview' src={userPhoto} alt={user?.name ?? 'Usuario'} />

                    <div className='menuLabel'>
                      {user?.name ?? fetchedUser?.name ?? 'Sin nombre'}
                    </div>
                    <div className='menuLabel'>
                      {user?.email ?? fetchedUser?.email ?? 'Sin email'}
                    </div>
                    <div className='menuLabel'>
                      {user?.telefono ?? fetchedUser?.telefono ?? 'Sin teléfono'}
                    </div>

                    <hr style={{ margin: '8px 0', opacity: 0.3 }} />

                    {user?.role === 'fixer' ? (
                      <>
                        <Link
                          href='/fixer/dashboard'
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => setProfileMenuOpen(false)}
                          className='flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity'
                        >
                          <UserCircle className='h-4 w-4' />
                          Perfil de Fixer
                        </Link>

                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={goToCentroDePagos}
                          className='menuItem w-full text-left'
                        >
                          <Wallet className='h-4 w-4 inline mr-2' />
                          Centro de Pagos
                        </button>

                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={goToConfirmarPagos}
                          className='menuItem w-full text-left'
                        >
                          <ClipboardList className='h-4 w-4 inline mr-2' />
                          Confirmar Pagos
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileMenuOpen(false);
                            router.push('/requesterEdit/perfil');
                          }}
                          className='menuItem'
                        >
                          Editar perfil
                        </button>

                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={goToMisTrabajos}
                          className='menuItem w-full text-left'
                        >
                          <Briefcase className='h-4 w-4 inline mr-2' />
                          Mis Trabajos
                        </button>

                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileMenuOpen(false);
                            router.push('/become-fixer');
                          }}
                          className='menuItem'
                        >
                          Convertirse en Fixer
                        </button>
                      </>
                    )}

                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        doLogout();
                      }}
                      className={`menuItem logoutBtn`}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href='/login'
                  className='text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors'
                >
                  {resolveT('buttons.login', 'navigation.login', 'Iniciar Sesión')}
                </Link>
                <Link
                  href='/signUp'
                  className='bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors'
                >
                  {resolveT('buttons.register', 'navigation.register', 'Regístrate')}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE/TABLET HEADER */}
      <div className='lg:hidden'>
        <div className='flex items-center justify-between px-3 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50'>
          <button onClick={handleLogoClick} className='flex items-center gap-2 min-w-0'>
            <div className='relative overflow-hidden rounded-full shadow-md shrink-0'>
              <Image src='/es/img/icon.png' alt='Servineo' width={32} height={32} />
            </div>
            <span className='text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] truncate max-w-[130px]'>
              Servineo
            </span>
          </button>

          {/* Auth Buttons */}
          <div className='flex items-center gap-2 flex-nowrap'>
            <NotificationSystem 
              userId={userId || undefined}
              userName={user?.name}
              isAuthenticated={isLogged}
              userRole={user?.role as 'fixer' | 'requester'}
            />
            {!isLogged ? (
              <>
                <Link
                  href='/login'
                  className='px-3 py-2 rounded-md text-[var(--color-primary)] font-medium text-[11px] sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap'
                >
                  Iniciar sesión
                </Link>
                <Link
                  href='/signUp'
                  className='px-3 py-2 rounded-md bg-[var(--color-primary)] text-white font-medium text-[11px] sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap'
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className='flex items-center gap-2 cursor-pointer px-3 py-1 border border-gray-300 bg-white rounded-xl transition'
              >
                <span className='text-gray-700 font-medium'>{user?.name}</span>
              </button>
            )}
          </div>
        </div>

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

        <div className='h-16' />
        <div className='h-16' />
      </div>

      <div className='hidden lg:block h-20' />
    </>
  );
}