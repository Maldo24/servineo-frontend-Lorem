'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Componentes modales
import AuthenticatorQrModal from '../../../../../Components/requester/Authenticator/AuthenticatorQrModal';
import VerifyTokenModal from '../../../../../Components/requester/Authenticator/VerifyTokenModal';
import RecoveryModal from '../../../../../Components/requester/Authenticator/RecoveryModal';
import ConfirmDisableModal from '../../../../../Components/requester/Authenticator/ConfirmDisableModal';

// Servicio 2FA
import { generateQr, verifyToken, disable2fa } from '../../../../redux/services/twofactor';

export default function AuthenticatorPage() {
  const router = useRouter();

  // Modales
  const [qrOpen, setQrOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [disableModalOpen, setDisableModalOpen] = useState(false);

  // Datos y estados
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  // Estado local que marca si el usuario ya configuró 2FA
  const [configured, setConfigured] = useState<boolean>(false);
  const [configuredAt, setConfiguredAt] = useState<string | null>(null);

  useEffect(() => {
    const flag = localStorage.getItem('servineo_twofactor_configured');
    const dateStr = localStorage.getItem('servineo_twofactor_configured_at');
    if (flag === 'true') {
      setConfigured(true);
      if (dateStr) setConfiguredAt(dateStr);
    }
  }, []);

  // Paso 1: Generar QR
  const handleConfigure = async () => {
    setLoading(true);
    setQrDataUrl(null);
    setQrOpen(true);
    try {
      const data = await generateQr();
      setQrDataUrl(data.qrDataUrl ?? null);
    } catch (err) {
      console.error('Error al generar QR', err);
      const errorMessage = err instanceof Error ? err.message : 'Error generando QR. Reintenta.';
      alert(errorMessage);
      setQrOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Regenerar QR
  const handleRegenerateQr = async () => {
    setRegenLoading(true);
    try {
      const data = await generateQr();
      setQrDataUrl(data.qrDataUrl ?? null);
    } catch (err) {
      console.error('Error al regenerar QR', err);
      const errorMessage =
        err instanceof Error ? err.message : 'No se pudo regenerar el código. Intenta de nuevo.';
      alert(errorMessage);
    } finally {
      setRegenLoading(false);
    }
  };

  const handleNextFromQr = () => {
    setQrOpen(false);
    setVerifyOpen(true);
  };

  // Paso 2: Verificar código de 6 dígitos
  const handleVerify = async (token: string) => {
    setLoading(true);
    try {
      const res = await verifyToken(token);
      setRecoveryCodes(res.recoveryCodes || []);
      setVerifyOpen(false);
      setRecoveryOpen(true);

      setConfigured(true);
      const now = new Date().toISOString().slice(0, 10);
      setConfiguredAt(now);
      localStorage.setItem('servineo_twofactor_configured', 'true');
      localStorage.setItem('servineo_twofactor_configured_at', now);
    } finally {
      setLoading(false);
    }
  };

  // Confirmar códigos de recuperación
  const handleRecoveryConfirm = () => {
    setRecoveryOpen(false);
    setRecoveryCodes(null);
  };

  // Desactivar 2FA
  const handleDisableConfirm = async () => {
    setDisableLoading(true);
    try {
      await disable2fa();
      localStorage.removeItem('servineo_twofactor_configured');
      localStorage.removeItem('servineo_twofactor_configured_at');
      setConfigured(false);
      setConfiguredAt(null);
      setRecoveryCodes(null);
    } catch (err) {
      console.error('Error desactivando 2FA', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al desactivar 2FA';
      alert(errorMessage);
    } finally {
      setDisableLoading(false);
    }
  };

  return (
    <div className='min-h-[70vh]'>
      <div className='max-w-6xl mx-auto px-6'>
        {/* Back + Title */}
        <div className='flex items-center gap-4 py-6'>
          <button
            onClick={() => router.back()}
            aria-label='Volver'
            className='p-2 rounded-full hover:bg-gray-100'
          >
            <svg
              className='w-6 h-6 text-gray-700'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          <div>
            <h1 className='text-xl font-semibold'>Aplicación authenticator</h1>
            <p className='text-sm text-gray-600'>
              En vez de esperar a que lleguen mensajes de texto, puedes obtener códigos de
              verificación desde una aplicación de autenticación.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className='mt-6 bg-white p-8 rounded border border-gray-100 shadow-sm'>
          <div className='text-center max-w-3xl mx-auto'>
            {/* Texto de descarga (solo si no está configurado) */}
            {!configured && (
              <p className='text-sm text-gray-700 mb-6'>
                Primero, descarga Google Authenticator desde{' '}
                <a
                  href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={(e) => e.stopPropagation()}
                  className='text-blue-600 underline hover:text-blue-800'
                >
                  Google Play Store
                </a>{' '}
                o desde{' '}
                <a
                  href='https://apps.apple.com/es/app/google-authenticator/id388497605'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={(e) => e.stopPropagation()}
                  className='text-blue-600 underline hover:text-blue-800'
                >
                  App Store
                </a>
                .
              </p>
            )}

            {/* Card de estado activo o botón configurar */}
            {configured ? (
              <div className='max-w-2xl w-full mx-auto p-4 md:p-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 flex items-center justify-between gap-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01]'>
                <div className='flex items-center gap-4'>
                  {/* Icono QR */}
                  <div className='w-14 h-14 flex items-center justify-center rounded-2xl bg-white border border-gray-200 shadow-sm'>
                    <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center border border-gray-300'>
                      <svg
                        className='w-6 h-6 text-gray-700'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                      >
                        <rect x='3' y='3' width='7' height='7' strokeWidth='1.5' />
                        <rect x='14' y='3' width='7' height='7' strokeWidth='1.5' />
                        <rect x='3' y='14' width='7' height='7' strokeWidth='1.5' />
                        <path
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          d='M14 14h3v3M17 17h4M17 14h4M14 17h3'
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Texto */}
                  <div className='flex-1 text-left space-y-1'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className='font-semibold text-gray-900'>
                        Autenticación en dos pasos
                      </span>
                      <span className='inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200'>
                        Activa
                      </span>
                    </div>
                    <p className='text-xs text-gray-600'>
                      Aplicación: <span className='font-medium'>Google Authenticator</span>
                    </p>
                    <p className='text-[11px] text-gray-500 font-semibold'>
                      Agregada el: <span className='font-semibold'>{configuredAt ?? '-'}</span>
                    </p>
                  </div>
                </div>

                {/* Botón papelera */}
                <button
                  title='Desactivar autenticación en dos pasos'
                  onClick={() => setDisableModalOpen(true)}
                  className='inline-flex items-center justify-center w-10 h-10 rounded-full border border-red-200 bg-white text-red-600 shadow-sm transition-all duration-200 hover:bg-red-50 hover:border-red-300 hover:shadow-md hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer'
                >
                  <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                    <path
                      strokeWidth='1.7'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4 6h16M10 11v6M14 11v6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2'
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className='flex justify-center'>
                <button
                  onClick={handleConfigure}
                  className='inline-flex items-center gap-2 px-5 py-2 rounded-md border border-indigo-200 hover:border-indigo-300 bg-white text-gray-800 shadow-sm hover:shadow-md transition-all'
                  disabled={loading}
                >
                  <span className='w-5 h-5 inline-flex items-center justify-center text-indigo-600'>
                    <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                      <path
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 8v4l2 2'
                      />
                      <circle cx='12' cy='12' r='10' strokeWidth='1.5' />
                    </svg>
                  </span>
                  <span className='text-sm font-medium'>Configurar autenticador</span>
                </button>
              </div>
            )}

            {/* Recovery codes (si acaban de generarse) */}
            {recoveryCodes && recoveryCodes.length > 0 && !recoveryOpen && (
              <div className='mt-6 max-w-3xl mx-auto transition-opacity duration-300'>
                <div className='p-4 border rounded bg-yellow-50'>
                  <h3 className='font-semibold mb-2'>Códigos de recuperación (guárdalos ahora)</h3>
                  <p className='text-sm text-gray-600 mb-2'>
                    Se muestran una sola vez. Úsalos si pierdes acceso a tu app de autenticación.
                  </p>
                  <ul className='list-disc ml-6'>
                    {recoveryCodes.map((c) => (
                      <li key={c} className='font-mono'>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modales */}
        <AuthenticatorQrModal
          open={qrOpen}
          onClose={() => setQrOpen(false)}
          qrDataUrl={qrDataUrl}
          onNext={handleNextFromQr}
          loading={loading}
          onRegenerate={handleRegenerateQr}
          regenerating={regenLoading}
        />

        <VerifyTokenModal
          open={verifyOpen}
          onClose={() => setVerifyOpen(false)}
          onVerify={handleVerify}
          loading={loading}
        />

        <RecoveryModal
          open={recoveryOpen}
          codes={recoveryCodes}
          onClose={() => setRecoveryOpen(false)}
          onConfirm={handleRecoveryConfirm}
        />

        <ConfirmDisableModal
          open={disableModalOpen}
          onCancel={() => setDisableModalOpen(false)}
          onConfirm={handleDisableConfirm}
          onFinish={() => setRecoveryCodes(null)}
          loading={disableLoading}
        />
      </div>
    </div>
  );
}
