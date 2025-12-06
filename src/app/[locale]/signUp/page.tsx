'use client';
import { useState } from 'react';
import Link from 'next/link';
import RegistroGoogle from './registrar/registroServicios/registroGoogle';
import RegistroForm from './registrar/registroServicios/page';
import GithubButton from '@/Components/requester/botonRegistro/buttonGithub';
import DiscordButton from '@/Components/requester/botonRegistro/buttonDiscord';
import ReCaptchaForm from '@/Components/requester/botonRegistro/recaptcha';
import NotificationModal from '@/Components/Modal-notifications';
import { useTranslations } from 'next-intl';
export default function SignUp() {
  const t = useTranslations('SignUpRegister');
   const [captchaValid, setCaptchaValid] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info' as 'success' | 'error' | 'info' | 'warning',
    title: '',
    message: '',
  });

  const handleNotify = (notif: {
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
  }) => {
    setNotification({ isOpen: true, ...notif });
  };

  const handleCloseNotification = () => setNotification((prev) => ({ ...prev, isOpen: false }));

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={handleCloseNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        autoClose
        autoCloseDelay={3000}
      />

      <section className='flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-blue-50 animate-fadeInUp relative'>
        <div className='w-full max-w-sm bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-xl p-10 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] relative z-10'>
          <h1 className='text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary/80 to-primary/60 bg-clip-text text-transparent'>
            {t('title')}
          </h1>
          <p className='text-center text-gray-600 mb-8 text-sm'>{t('mode')}</p>
          <RegistroForm captchaValid={captchaValid} onNotify={handleNotify} />

          <div className='flex items-center my-6'>
            <div className='flex-1 h-px bg-gray-300' />
            <span className='px-3 text-gray-400 text-sm'>{t('separator')}</span>
            <div className='flex-1 h-px bg-gray-300' />
          </div>

          <div className='flex flex-col items-center space-y-3 mt-3'>
            <RegistroGoogle onNotify={handleNotify} captchaValid={captchaValid} />
            <GithubButton onNotify={handleNotify} captchaValid={captchaValid} />

            <DiscordButton onNotify={handleNotify} captchaValid={captchaValid} />
          </div>
          <div className='mt-5'>
            <ReCaptchaForm onVerified={(success) => setCaptchaValid(success)} />
          </div>

          <div className='flex items-start mt-5 text-sm text-gray-600'>
            <input
              type='checkbox'
              className='mt-1 mr-2 accent-blue-500 focus:ring-2 focus:ring-blue-300 rounded'
            />
            <p>
              {t('terms.text')}{' '}
              <Link
                href='signUp/registrar/Terminosycondiciones'
                className='text-blue-500 hover:text-blue-400 font-semibold hover:underline transition'
              >
                {t('terms.link')}
              </Link>
              .
            </p>
          </div>

          <p className='mt-6 text-center text-gray-700 text-sm'>
            {t('login.text')}{' '}
            <Link
              href='login'
              className='text-blue-500 hover:text-blue-400 font-semibold hover:underline transition'
            >
              {t('login.link')}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
