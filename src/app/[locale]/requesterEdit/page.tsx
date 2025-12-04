'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/usoAutentificacion';
import AccountLoginSettings from './linkAccounts/page';
import RequesterEditForm from '@/Components/requester/request/RequesterEditForm';
import ChangePasswordForm from '@/Components/requester/request/ChangePasswordForm';
//import { obtenerDatosUsuarioLogueado } from '../redux/services/editNumber';
//import CloseSessionPage from '@/app/requesterEdit/closeSession/page';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

/*
interface RequesterDataState {
  requesterId: string
  phone: string
  direction: string
  coordinates: [number, number]
}
*/
/*
const INITIAL_DATA: RequesterDataState = {
  requesterId: '',
  phone: '',
  direction: '',
  coordinates: [0, 0],
}
*/
export default function ConfiguracionPage() {
  const t = useTranslations('ConfiguracionPage');
  const { user } = useAuth();
  const router = useRouter();
  //const [menuOpen, setMenuOpen] = useState(false);

  const [seccionActiva, setSeccionActiva] = useState('inicio');

  // 🆕 Estados para HU5 (Editar Perfil)
  //const [profileData, setProfileData] = useState<RequesterDataState>(INITIAL_DATA)
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.loadProfile');
      setProfileError(message);
      //setProfileData(INITIAL_DATA)
    } finally {
      setProfileLoading(false);
    }
  }, [user, t]);

  //Cargar datos cuando se activa la sección de perfil
  useEffect(() => {
    if (seccionActiva === 'perfil') {
      loadProfileData();
    }
  }, [seccionActiva, loadProfileData]);

  //Callbacks para HU8 (Cambiar Contraseña)
  const handlePasswordCancel = () => {
    setSeccionActiva('inicio'); // Volver al inicio
  };

  const handlePasswordSaved = () => {
    //setPasswordChanging(false)
    setTimeout(() => {
      setSeccionActiva('inicio'); // Volver al inicio después de cambiar
    }, 1500);
  };

  // Función para renderizar el contenido según la sección
  const renderContenido = () => {
    switch (seccionActiva) {
      case 'perfil':
        if (profileLoading) {
          return (
            <div className='flex items-center justify-center h-64'>
              <p className='text-blue-600 text-lg animate-pulse'>{t('loading.profile')}</p>
            </div>
          );
        }

        if (profileError) {
          return (
            <div className='max-w-md mx-auto text-center'>
              <h2 className='text-xl font-semibold text-red-600 mb-4'>{t('errors.loadTitle')}</h2>
              <p className='text-gray-600 mb-6'>
                {t('errors.loadMessage', { error: profileError })}
              </p>
              <button
                onClick={loadProfileData}
                className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300'
              >
                {t('buttons.retry')}
              </button>
            </div>
          );
        }

        return (
          <div className='max-w-4xl w-full'>
            <h2 className='text-2xl font-bold text-center mb-8 text-gray-800'>
              {t('sections.editProfile')}
            </h2>
            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-200'>
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
            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-200'>
              <ChangePasswordForm onCancel={handlePasswordCancel} onSaved={handlePasswordSaved} />
            </div>
          </div>
        );

      case 'seguridad':
        return (
          <div className='max-w-4xl w-full'>
            <h2 className='text-xl font-semibold text-center mb-2'>{t('sections.security')}</h2>
            <p className='text-sm text-center text-gray-600 mb-8'>
              {t('sections.securityDescription')}
            </p>

            <div className='flex justify-center gap-6'>
              {/* Cambiar contraseña - Ahora interno */}
              <button
                onClick={() => setSeccionActiva('password')}
                className='flex items-center gap-3 px-6 py-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out bg-white text-gray-800 cursor-pointer min-w-[220px]'
              >
                <div className='p-2 rounded-md bg-blue-50'>
                  <Image
                    src='/icons/edit-pass.png'
                    alt={t('security.changePassword')}
                    width={32}
                    height={32}
                    className='w-8 h-8 object-contain text-blue-600'
                  />
                </div>
                <span className='font-medium'>{t('security.changePassword')}</span>
              </button>

              {/* Dispositivos vinculados */}
              <button
                onClick={() => router.push('/requesterEdit/dispositivosVinculados/')}
                className='flex items-center gap-3 px-6 py-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out bg-white text-gray-800 cursor-pointer min-w-[220px]'
              >
                <div className='p-2 rounded-md bg-blue-50'>
                  <Image
                    src='/icons/logins.png'
                    alt={t('security.linkedDevices')}
                    width={24}
                    height={24}
                    className='w-6 h-6 object-contain text-blue-600'
                  />
                </div>
                <span className='font-medium'>{t('security.linkedDevices')}</span>
              </button>

              {/* 🆕 Authenticator (nuevo botón) */}
              <button
                onClick={() => router.push('/requesterEdit/Seguridad/Authenticator/')}
                className='flex items-center gap-3 px-6 py-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out bg-white text-gray-800 cursor-pointer min-w-[220px]'
              >
                <div className='p-2 rounded-md bg-blue-50'>
                  <Image
                    src='/icons/appauth.png'
                    alt='Authenticator'
                    width={24}
                    height={24}
                    className='w-6 h-6 object-contain text-blue-600'
                  />
                </div>
                <span className='font-medium'>Authenticator</span>
              </button>
            </div>
          </div>
        );

      case 'cuentas':
        return <AccountLoginSettings token={localStorage.getItem('servineo_token') ?? ''} />;

      default: // 'inicio'
        return (
          <div className='flex flex-col items-center justify-top flex-1 mt-10'>
            {safeUser ? (
              <>
                <div className='mb-4'>
                  {safeUser.url_photo ? (
                    <Image
                      src={safeUser.url_photo}
                      alt={t('welcome.profilePhoto')}
                      width={112}
                      height={112}
                      className='w-28 h-28 rounded-full border-4 border-blue-100 object-cover mb-4 shadow-sm'
                    />
                  ) : (
                    <div className='w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-semibold text-blue-700 mb-4 shadow-sm border-4 border-blue-200'>
                      {getInitials(safeUser.name ?? safeUser.email ?? '')}
                    </div>
                  )}
                </div>
                <h2 className='text-2xl font-semibold mb-2 text-gray-800'>
                  {t('welcome.title', { name: safeUser.name ?? t('welcome.defaultName') })}{' '}
                  <span className='text-blue-600'>{safeUser.name ?? 'Usuario'}</span>
                </h2>
                <p className='text-gray-600 max-w-md text-center'>{t('welcome.description')}</p>
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
      {/* Header - igual */}

      <div className='flex flex-1'>
        {/* Sidebar actualizado */}
        <aside className='w-64 bg-white p-6 flex flex-col justify-between relative shadow-md'>
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
              {/* Editar Perfil - Ahora interno */}
              <button
                onClick={() => setSeccionActiva('perfil')}
                className={`cursor-pointer flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all duration-300 ease-out ${
                  seccionActiva === 'perfil'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'hover:bg-blue-50 hover:text-blue-600 hover:font-semibold'
                }`}
              >
                <Image
                  src='/icons/edit-config.png'
                  alt={t('navigation.editProfile')}
                  width={24}
                  height={24}
                  className='w-6 h-6'
                />
                {t('navigation.editProfile')}
              </button>

              {/* Seguridad - Estado interno */}
              <button
                onClick={() => setSeccionActiva('seguridad')}
                className={`cursor-pointer flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all duration-300 ease-out ${
                  seccionActiva === 'seguridad' || seccionActiva === 'password'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'hover:bg-blue-50 hover:text-blue-600 hover:font-semibold'
                }`}
              >
                <Image
                  src='/icons/seguridad-config.png'
                  alt={t('navigation.security')}
                  width={28}
                  height={28}
                  className='w-7 h-7'
                />
                {t('navigation.security')}
              </button>

              {/* Cuentas vinculadas - Estado interno */}
              <button
                onClick={() => setSeccionActiva('cuentas')}
                className={`cursor-pointer flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all duration-300 ease-out ${
                  seccionActiva === 'cuentas'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'hover:bg-blue-50 hover:text-blue-600 hover:font-semibold'
                }`}
              >
                <Image
                  src='/icons/cuentas.png'
                  alt={t('navigation.linkedAccounts')}
                  width={28}
                  height={28}
                  className='w-7 h-7'
                />
                {t('navigation.linkedAccounts')}
              </button>
            </nav>
          </div>
        </aside>

        {/* Contenido dinámico */}
        <main className='flex-1 flex flex-col items-center text-center p-8 relative'>
          {renderContenido()}
        </main>
      </div>
    </div>
  );
}
