'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  UserPen,
  ShieldCheck,
  KeyRound,
  Smartphone,
  ScanFace,
  Layers,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/usoAutentificacion';
import AccountLoginSettings from './linkAccounts/page';
import DispositivosVinculados from './dispositivosVinculados/dispositivosVinculados';
import RequesterEditForm from '@/Components/requester/request/RequesterEditForm';
import ChangePasswordForm from '@/Components/requester/request/ChangePasswordForm';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function ConfiguracionPage() {
  const t = useTranslations('ConfiguracionPage');
  const { user } = useAuth();
  const router = useRouter();

  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  type SafeUser = { name?: string; email?: string; url_photo?: string };
  const safeUser = (user as SafeUser) ?? null;

  function getInitials(name: string) {
    const clean = (name || '').trim();
    if (!clean) return 'U';
    const parts = clean.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  const loadProfileData = useCallback(async () => {
    if (!user) return;

    setProfileLoading(true);
    setProfileError(null);

    try {
      // fetch datos si necesitas
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.loadProfile');
      setProfileError(message);
    } finally {
      setProfileLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    if (seccionActiva === 'perfil') {
      loadProfileData();
    }
  }, [seccionActiva, loadProfileData]);

  const handlePasswordCancel = () => setSeccionActiva('inicio');
  const handlePasswordSaved = () => setTimeout(() => setSeccionActiva('inicio'), 1500);

  const closeMobile = () => setMobileOpen(false);

  const renderContenido = () => {
    switch (seccionActiva) {
      case 'perfil':
        return (
          <div className='max-w-4xl w-full'>
            <h2 className='text-2xl font-bold text-center mb-8 text-gray-800'>
              {t('sections.editProfile')}
            </h2>
            <div className='bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200'>
              <RequesterEditForm />
            </div>
          </div>
        );

      case 'password':
        return (
          <div className='max-w-2xl w-full'>
            <h2 className='text-2xl font-bold text-center mb-8 text-gray-800'>
              {t('sections.changePassword')}
            </h2>
            <div className='bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200'>
              <ChangePasswordForm onCancel={handlePasswordCancel} onSaved={handlePasswordSaved} />
            </div>
          </div>
        );

      case 'dispositivos':
        return (
          <div className='max-w-4xl w-full'>
            <h2 className='text-xl font-semibold text-center mb-4'>Dispositivos Vinculados</h2>
            <DispositivosVinculados />
          </div>
        );

      case 'seguridad':
        return (
          <div className='max-w-4xl w-full'>
            <h2 className='text-xl font-semibold text-center mb-2'>{t('sections.security')}</h2>
            <p className='text-sm text-center text-gray-600 mb-8'>
              {t('sections.securityDescription')}
            </p>

            {/* responsive cards: column on xs, row wrap on sm+ */}
            <div className='flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center items-stretch'>
              <div className='w-full sm:w-auto'>
                <button
                  onClick={() => setSeccionActiva('password')}
                  className='flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-transform duration-200 bg-white cursor-pointer w-full min-w-[220px]'
                >
                  <KeyRound className='w-7 h-7 text-blue-600 flex-shrink-0' />
                  <span className='font-medium text-left'>{t('security.changePassword')}</span>
                </button>
              </div>

              <div className='w-full sm:w-auto'>
                <button
                  onClick={() => setSeccionActiva('dispositivos')}
                  className='flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-transform duration-200 bg-white cursor-pointer w-full min-w-[220px]'
                >
                  <Smartphone className='w-6 h-6 text-blue-600 flex-shrink-0' />
                  <span className='font-medium text-left'>{t('security.linkedDevices')}</span>
                </button>
              </div>

              <div className='w-full sm:w-auto'>
                <button
                  onClick={() => router.push('/requesterEdit/Seguridad/Authenticator/')}
                  className='flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-transform duration-200 bg-white cursor-pointer w-full min-w-[220px]'
                >
                  <ScanFace className='w-6 h-6 text-blue-600 flex-shrink-0' />
                  <span className='font-medium text-left'>Authenticator</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'cuentas':
        return <AccountLoginSettings token={localStorage.getItem('servineo_token') ?? ''} />;

      default:
        return (
          <div className='flex flex-col items-center justify-top flex-1 mt-6 sm:mt-10 px-4 sm:px-0'>
            {safeUser ? (
              <>
                <div className='mb-4'>
                  {safeUser.url_photo ? (
                    <Image
                      src={safeUser.url_photo}
                      alt={t('welcome.profilePhoto')}
                      width={112}
                      height={112}
                      className='w-24 sm:w-28 h-24 sm:h-28 rounded-full border-4 border-blue-100 object-cover mb-4 shadow-sm'
                    />
                  ) : (
                    <div className='w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-semibold text-blue-700 mb-4 shadow-sm border-4 border-blue-200'>
                      {getInitials(safeUser.name ?? safeUser.email ?? '')}
                    </div>
                  )}
                </div>
                <h2 className='text-xl sm:text-2xl font-semibold mb-2 text-gray-800'>
                  {t('welcome.title', { name: safeUser.name ?? t('welcome.defaultName') })}
                  <span className='text-blue-600'> {safeUser.name ?? 'Usuario'}</span>
                </h2>
                <p className='text-gray-600 max-w-md text-center mt-2 px-2'>
                  {t('welcome.description')}
                </p>
              </>
            ) : (
              <p className='text-gray-600'>{t('welcome.loginRequired')}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className='font-sans flex flex-col min-h-screen bg-gray-50 text-gray-800'>
      {/* mobile top bar - photo and user name removed as requested */}
      <header className='md:hidden flex items-center justify-between px-4 py-3 bg-white shadow-sm sticky top-0 z-30'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => router.back()}
            className='flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600'
            aria-label='Volver'
          >
            <ArrowLeft className='w-4 h-4' />
          </button>

          {/* Only keep the small "Configuración" label (no photo, no user name) */}
          <div className='text-sm'>
            <div className='text-xs text-gray-500'>Configuración</div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => setMobileOpen(true)}
            className='p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600'
            aria-label='Abrir menú'
          >
            <Menu className='w-5 h-5' />
          </button>
        </div>
      </header>

      <div className='flex flex-1'>
        {/* desktop sidebar */}
        <aside className='hidden md:flex md:w-64 lg:w-56 bg-white p-6 flex-col justify-between relative shadow-md'>
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                <button
                  onClick={() => router.back()}
                  className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600'
                >
                  <ArrowLeft className='w-4 h-4' />
                </button>
                {t('title')}
              </h2>
            </div>

            <nav className='space-y-2'>
              <button
                onClick={() => setSeccionActiva('perfil')}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  seccionActiva === 'perfil'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <UserPen className='w-6 h-6 text-blue-600' />
                {t('navigation.editProfile')}
              </button>

              <button
                onClick={() => setSeccionActiva('seguridad')}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  seccionActiva === 'seguridad' || seccionActiva === 'password'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <ShieldCheck className='w-7 h-7 text-blue-600' />
                {t('navigation.security')}
              </button>

              <button
                onClick={() => setSeccionActiva('cuentas')}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  seccionActiva === 'cuentas'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Layers className='w-7 h-7 text-blue-600' />
                {t('navigation.linkedAccounts')}
              </button>
            </nav>
          </div>
        </aside>

        {/* mobile drawer */}
        {mobileOpen && (
          <div className='fixed inset-0 z-50 md:hidden'>
            <div className='absolute inset-0 bg-black/40' onClick={closeMobile} />
            <div className='absolute left-0 top-0 bottom-0 w-72 bg-white p-4 shadow-lg overflow-auto'>
              <div className='flex items-center justify-between mb-4'>
                <div className='text-lg font-semibold'>{t('title')}</div>
                <button
                  onClick={closeMobile}
                  className='p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600'
                  aria-label='Cerrar'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>

              <nav className='space-y-2'>
                <button
                  onClick={() => {
                    setSeccionActiva('perfil');
                    closeMobile();
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    seccionActiva === 'perfil'
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'hover:bg-blue-50'
                  }`}
                >
                  <UserPen className='w-5 h-5 text-blue-600' />
                  <span> {t('navigation.editProfile')} </span>
                </button>

                <button
                  onClick={() => {
                    setSeccionActiva('seguridad');
                    closeMobile();
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    seccionActiva === 'seguridad' || seccionActiva === 'password'
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'hover:bg-blue-50'
                  }`}
                >
                  <ShieldCheck className='w-5 h-5 text-blue-600' />
                  <span> {t('navigation.security')} </span>
                </button>

                <button
                  onClick={() => {
                    setSeccionActiva('cuentas');
                    closeMobile();
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    seccionActiva === 'cuentas'
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'hover:bg-blue-50'
                  }`}
                >
                  <Layers className='w-5 h-5 text-blue-600' />
                  <span> {t('navigation.linkedAccounts')} </span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* main content */}
        <main className='flex-1 flex flex-col items-center text-center p-4 md:p-8 relative'>
          <div className='w-full max-w-screen-lg'>{renderContenido()}</div>
        </main>
      </div>
    </div>
  );
}
