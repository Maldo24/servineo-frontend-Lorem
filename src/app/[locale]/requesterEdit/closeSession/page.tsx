'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDevices } from '@/app/lib/hooks/useDevices';
import { Button } from '../buttonCS';
//import { Card, CardContent } from "../cardCS";
import { ArrowLeft, Laptop, Monitor, Smartphone, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CloseSessionPage() {
  const t = useTranslations('CloseSessionPage');
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { sessions, loading, error, currentDeviceId, fetchSessions, closeAllOtherSessions } =
    useDevices(userId);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || localStorage.getItem('user_id');
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchSessions();
      const interval = setInterval(() => fetchSessions(), 30000);
      return () => clearInterval(interval);
    }
  }, [userId, fetchSessions]);

  const handleCloseAllSessions = async () => {
    const result = await closeAllOtherSessions();
    setShowConfirmation(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    const type = deviceType.toLowerCase();
    if (type.includes('mobile') || type.includes('android'))
      return <Smartphone size={24} className='text-gray-700' />;
    if (type.includes('tablet') || type.includes('ipad'))
      return <Monitor size={24} className='text-gray-700' />;
    return <Laptop size={24} className='text-gray-700' />;
  };

  const activeSessions = sessions.filter((s) => s.isActive);
  const otherSessions = activeSessions.filter((s) => s.deviceId !== currentDeviceId);

  /*  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Sesión no detectada
          </h2>
          <p className="text-gray-500">
            Por favor, inicia sesión para ver tus dispositivos activos.
          </p>
        </div>
      </div>
    );
  }*/

  if (loading && activeSessions.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-md p-8 mx-auto my-10'>
      <button
        onClick={() => router.push('/requesterEdit/')}
        className='flex items-center text-gray-600 hover:text-gray-800 mb-6'
      >
        <ArrowLeft className='w-5 h-5 mr-2' /> Volver
      </button>

      <h1 className='text-2xl font-semibold text-gray-900 mb-3 text-center'>{t('title')}</h1>
      <p className='text-gray-600 mb-8 text-center'>{t('description')}</p>

      {successMessage && (
        <div className='mb-6 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-center'>
          <AlertCircle className='w-5 h-5 inline mr-2 text-green-600' />
          {successMessage}
        </div>
      )}

      {error && (
        <div className='mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center'>
          <AlertCircle className='w-5 h-5 inline mr-2 text-red-600' />
          {error}
        </div>
      )}

      {activeSessions.length >= 3 && (
        <div className='mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 text-center'>
          <AlertCircle className='w-5 h-5 inline mr-2 text-yellow-600' />
          {t('warnings.deviceLimit')}
        </div>
      )}

      <div className='bg-blue-50 border-l-4 border-blue-400 rounded-xl p-4 mb-8'>
        <p className='text-blue-800 text-sm'>
          <strong>{t('important')}:</strong> {t('warnings.closeSessionsWarning')}
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
        <div className='bg-gray-50 border border-gray-200 rounded-xl p-4 text-center'>
          <p className='text-sm text-gray-500'>{t('stats.activeSessions')}</p>
          <p className='text-2xl font-semibold text-gray-900'>{activeSessions.length}</p>
        </div>
        <div className='bg-gray-50 border border-gray-200 rounded-xl p-4 text-center'>
          <p className='text-sm text-gray-500'>{t('stats.otherDevices')}</p>
          <p className='text-2xl font-semibold text-gray-900'>{otherSessions.length}</p>
        </div>
        <div className='bg-gray-50 border border-gray-200 rounded-xl p-4 text-center'>
          <p className='text-sm text-gray-500'>{t('stats.currentDevice')}</p>
          <p className='text-2xl font-semibold text-green-600'>✓</p>
        </div>
      </div>

      {otherSessions.length > 0 && (
        <Button
          onClick={() => setShowConfirmation(true)}
          disabled={loading}
          className='w-full bg-red-500 text-white hover:bg-red-600 font-medium rounded-xl py-3 mb-8'
        >
          {loading ? t('buttons.closingSessions') : t('buttons.closeOtherSessions')}
        </Button>
      )}

      {otherSessions.length === 0 && activeSessions.length > 0 && (
        <div className='bg-gray-50 border border-gray-200 rounded-xl p-4 text-center mb-8'>
          <p className='text-gray-600'>{t('noOtherSessions')}</p>
        </div>
      )}

      <section>
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>
          {t('activeSessions.title', { count: activeSessions.length })}
        </h2>

        {activeSessions.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>{t('activeSessions.noDevices')}</div>
        ) : (
          <div className='space-y-3'>
            {activeSessions.map((session) => (
              <div
                key={session._id}
                className={`flex items-center justify-between border rounded-2xl px-4 py-3 shadow-sm transition ${
                  session.deviceId === currentDeviceId
                    ? 'bg-green-50 border-green-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center gap-3'>
                  {getDeviceIcon(session.deviceType)}
                  <div>
                    <p className='text-sm font-semibold text-gray-800 flex items-center gap-2'>
                      {session.deviceName}
                      {session.deviceId === currentDeviceId && (
                        <span className='text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full'>
                          {t('activeSessions.thisDevice')}
                        </span>
                      )}
                    </p>
                    <p className='text-xs text-gray-600'>
                      {session.browser} • {session.deviceType}
                    </p>
                    <p className='text-xs text-gray-500'>IP: {session.ipAddress}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showConfirmation && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
          <div className='bg-white border border-gray-200 rounded-2xl shadow-lg p-6 w-80 text-center'>
            <h2 className='text-lg font-semibold text-gray-900 mb-2'>{t('confirmation.title')}</h2>
            <p className='text-gray-600 mb-4 text-sm'>
              {t('confirmation.message', {
                count: otherSessions.length,
                sessions:
                  otherSessions.length === 1
                    ? t('confirmation.sessionSingular')
                    : t('confirmation.sessionPlural'),
              })}
            </p>
            <div className='flex justify-around'>
              <Button
                onClick={() => setShowConfirmation(false)}
                className='bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg'
                disabled={loading}
              >
                {t('confirmation.cancel')}
              </Button>
              <Button
                onClick={handleCloseAllSessions}
                className='bg-red-500 text-white hover:bg-red-600 rounded-lg'
                disabled={loading}
              >
                {loading ? t('confirmation.closing') : t('confirmation.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
