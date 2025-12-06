'use client';
// src/Components/payment/PaymentMethodCashFixer.tsx
// Modal principal para confirmación de pagos en efectivo

import React, { useState, useEffect, useMemo } from 'react';
import { PaymentMethodCashFixerProps, Message, PaymentSummary } from '../../utils/types';
import {
  fetchPaymentSummary,
  confirmPayment,
  isValidObjectId,
  formatTime,
  formatTimeWithHours,
} from '../../utils/paymentapi';
import PaymentSuccessModal from './PaymentSuccessModal';

export default function PaymentMethodCashFixer({
  trabajo,
  onClose,
  onBack,
}: PaymentMethodCashFixerProps) {
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [loading, setLoading] = useState(true);
  const [patching, setPatching] = useState(false);
  const [mainMessage, setMainMessage] = useState<Message | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);

  // Intentos y bloqueo
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [unlockAtISO, setUnlockAtISO] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [wasLocked, setWasLocked] = useState(false);

  // Expiración de Código
  const [codeExpired, setCodeExpired] = useState(false);
  const [codeExpiresAt, setCodeExpiresAt] = useState<string | null>(null);

  // Cálculo de tiempo restante para desbloqueo
  const msLeft = useMemo(() => {
    if (!unlockAtISO) return 0;
    const unlockMs = new Date(unlockAtISO).getTime();
    return Math.max(0, unlockMs - now);
  }, [unlockAtISO, now]);

  // Cálculo de tiempo hasta expiración
  const msUntilExpiration = useMemo(() => {
    if (!codeExpiresAt) return 0;
    const expiresMs = new Date(codeExpiresAt).getTime();
    return Math.max(0, expiresMs - now);
  }, [codeExpiresAt, now]);

  // Timer para actualizar tiempo actual
  useEffect(() => {
    if (!unlockAtISO && !codeExpiresAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [unlockAtISO, codeExpiresAt]);

  const minutesLeft = Math.floor(msLeft / 60000);
  const secondsLeft = Math.floor((msLeft % 60000) / 1000);

  const hoursUntilExpiration = Math.floor(msUntilExpiration / 3600000);
  const minutesUntilExpiration = Math.floor((msUntilExpiration % 3600000) / 60000);
  const secondsUntilExpiration = Math.floor((msUntilExpiration % 60000) / 1000);

  const locked = !!unlockAtISO && msLeft > 0;

  // Detectar cuando se desbloquea
  useEffect(() => {
    if (wasLocked && !locked && unlockAtISO) {
      console.log('🔓 Cuenta desbloqueada');
      setMainMessage({
        type: 'success',
        text: '🔓 El periodo de bloqueo de 10 minutos ha finalizado. Ya puedes intentar nuevamente.',
      });
      setUnlockAtISO(null);
      setTimeout(() => setMainMessage(null), 5000);
    }
    if (locked) setWasLocked(true);
  }, [locked, unlockAtISO, wasLocked]);

  // Manejo de cambio de código
  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    const filtered = value.replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setCodigoIngresado(filtered);
  };

  // Cargar resumen del pago
  async function loadSummary() {
    if (!trabajo?.jobId) {
      setMainMessage({ type: 'error', text: 'No hay paymentId para consultar.' });
      setLoading(false);
      return;
    }

    setMainMessage(null);
    setRemainingAttempts(null);
    setUnlockAtISO(null);
    setLoading(true);
    console.log('🔍 Cargando summary para:', trabajo.jobId);

    try {
      const isObjectId = isValidObjectId(trabajo.jobId);

      if (isObjectId) {
        const data = await fetchPaymentSummary(trabajo.jobId);

        // Verificar expiración
        if (data.codeExpired && !codeExpired) {
          console.log('🔴 CÓDIGO EXPIRADO detectado');
          setCodeExpired(true);
          setMainMessage({
            type: 'warning',
            text: '⏱️ El código ha expirado. Solicite al cliente que genere un nuevo código desde su vista para continuar con el pago.',
          });
        } else if (!data.codeExpired && codeExpired) {
          console.log('✅ Código renovado');
          setCodeExpired(false);
          setMainMessage(null);
        }

        if (data.codeExpiresAt) {
          setCodeExpiresAt(data.codeExpiresAt);
        }

        setSummary(data);
      } else {
        // Simulación para IDs no válidos
        await new Promise((r) => setTimeout(r, 500));
        setSummary({
          id: trabajo.jobId,
          code: null,
          status: trabajo.paymentStatus || 'pending',
          amount: { total: trabajo.totalPagar || 0, currency: 'BOB' },
        });
      }
    } catch (e: unknown) {
      console.error('❌ Error:', e);
      setMainMessage({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, [trabajo?.jobId]);

  // Verificación automática de expiración
  useEffect(() => {
    if (!codeExpiresAt || codeExpired) return;

    const checkExpiration = () => {
      const expiresMs = new Date(codeExpiresAt).getTime();
      const nowMs = Date.now();

      if (nowMs >= expiresMs && !codeExpired) {
        console.log('🔴 CÓDIGO EXPIRADO detectado por auto-check');
        setCodeExpired(true);
        setMainMessage({
          type: 'warning',
          text: '⏱️ El código ha expirado. Solicite al cliente que genere un nuevo código desde su vista para continuar con el pago.',
        });
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [codeExpiresAt, codeExpired]);

  // Confirmar pago
  const handleContinuar = async () => {
    if (!summary) return;

    const code = codigoIngresado.trim();
    if (!code) {
      setMainMessage({ type: 'error', text: 'Por favor, ingrese el código de 6 caracteres.' });
      return;
    }
    if (code.length !== 6) {
      setMainMessage({ type: 'error', text: 'El código debe tener exactamente 6 caracteres.' });
      return;
    }

    setMainMessage(null);
    setRemainingAttempts(null);
    setUnlockAtISO(null);
    setPatching(true);

    try {
      const isObjectId = isValidObjectId(summary.id);

      if (isObjectId) {
        const { res, resp } = await confirmPayment(summary.id, code);

        if (res.ok) {
          console.log('✅ Pago confirmado exitosamente');
          setShowSuccessModal(true);
          await loadSummary();
          setCodigoIngresado('');
          return;
        }

        // Manejo de errores específicos
        if (res.status === 429) {
          if (resp.unlocksAt) setUnlockAtISO(String(resp.unlocksAt));
          else if (resp.waitMinutes) {
            const unlockDate = new Date(Date.now() + Number(resp.waitMinutes) * 60000);
            setUnlockAtISO(unlockDate.toISOString());
          }
          setMainMessage({
            type: 'error',
            text: '🔒 Has superado el número máximo de intentos (3). La cuenta está bloqueada temporalmente por 10 minutos.',
          });
          return;
        }

        if (res.status === 401) {
          const attempts = Number(resp.remainingAttempts);
          if (!Number.isNaN(attempts)) {
            setRemainingAttempts(attempts);
            setMainMessage({
              type: 'error',
              text: `❌ Código inválido. Te quedan ${attempts} intento${attempts !== 1 ? 's' : ''}.`,
            });
          } else {
            setMainMessage({ type: 'error', text: '❌ Código inválido.' });
          }
          return;
        }

        if (res.status === 410) {
          setCodeExpired(true);
          setMainMessage({
            type: 'warning',
            text: '⏱️ El código ha expirado. Solicite al cliente que genere un nuevo código.',
          });
          return;
        }

        if (res.status === 404) {
          setMainMessage({ type: 'error', text: 'Pago no encontrado' });
          return;
        }

        if (res.status === 409) {
          setMainMessage({ type: 'error', text: 'El pago ya fue procesado' });
          return;
        }

        setMainMessage({ type: 'error', text: resp?.error || `Error ${res.status}` });
      } else {
        // Simulación
        await new Promise((r) => setTimeout(r, 1000));
        setShowSuccessModal(true);
        setCodigoIngresado('');
      }
    } catch (e: unknown) {
      setMainMessage({ type: 'error', text: e.message });
    } finally {
      setPatching(false);
    }
  };

  // Renderizado condicional: Modal de éxito
  if (showSuccessModal) {
    return (
      <PaymentSuccessModal
        onClose={() => {
          setShowSuccessModal(false);
          onClose(true);
        }}
      />
    );
  }

  // Renderizado condicional: Loading
  if (loading) {
    return (
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        <div className='bg-[#F9FAFB] rounded-lg shadow-xl px-8 py-6'>
          <div className='flex flex-col items-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B31E0] mb-4'></div>
            <p className='text-[#111827]'>Cargando datos del pago…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  // Componente de mensaje (alerta)
  const MessageAlert = ({ message }: { message: Message }) => (
    <div className='mb-6 max-w-xl mx-auto'>
      <div
        className={`border-l-4 p-4 rounded ${
          message.type === 'error'
            ? 'bg-red-50 border-[#EF4444]'
            : message.type === 'warning'
              ? 'bg-amber-50 border-[#F59E0B]'
              : message.type === 'success'
                ? 'bg-green-50 border-[#16A34A]'
                : 'bg-blue-50 border-[#759AE0]'
        }`}
      >
        <div className='flex items-start'>
          <div className='flex-shrink-0'>
            <svg
              className={`h-5 w-5 mt-0.5 ${
                message.type === 'error'
                  ? 'text-[#EF4444]'
                  : message.type === 'warning'
                    ? 'text-[#F59E0B]'
                    : message.type === 'success'
                      ? 'text-[#16A34A]'
                      : 'text-[#759AE0]'
              }`}
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              {message.type === 'success' ? (
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              ) : message.type === 'error' ? (
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              ) : (
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              )}
            </svg>
          </div>
          <div className='ml-3 flex-1'>
            <p
              className={`text-sm font-medium ${
                message.type === 'error'
                  ? 'text-red-800'
                  : message.type === 'warning'
                    ? 'text-amber-800'
                    : message.type === 'success'
                      ? 'text-green-800'
                      : 'text-blue-800'
              }`}
            >
              {message.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizado principal
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-[#F9FAFB] w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='bg-[#2B31E0] text-[#F9FAFB] px-6 py-4 flex items-center justify-between rounded-t-lg'>
          <h1 className='text-xl font-semibold'>Método de pago Efectivo — Vista FIXER</h1>
          <button
            onClick={() => onClose()}
            className='hover:bg-[#2B6AE0] px-3 py-1 rounded text-xl transition-colors'
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className='px-8 py-12'>
          <h2 className='text-2xl font-bold text-[#111827] text-center mb-12'>
            Confirmación del pago recibido
          </h2>

          {/* Mensajes */}
          {mainMessage && <MessageAlert message={mainMessage} />}

          {/* Bloqueo temporal */}
          {locked && (
            <div className='mb-6 max-w-xl mx-auto'>
              <div className='bg-red-50 border border-[#EF4444] rounded p-3'>
                <p className='text-red-700 text-sm font-medium text-center'>
                  🔒 Cuenta bloqueada. Intenta en:{' '}
                  <b className='text-lg'>
                    {minutesLeft > 0 ? `${minutesLeft}m ` : ''}
                    {secondsLeft}s
                  </b>
                </p>
              </div>
            </div>
          )}

          {/* Temporizador de expiración */}
          {!codeExpired && codeExpiresAt && msUntilExpiration > 0 && (
            <div className='mb-6 max-w-xl mx-auto'>
              <div className='bg-blue-50 border border-[#759AE0] rounded p-3'>
                <p className='text-blue-700 text-sm text-center'>
                  ⏰ Código válido por:{' '}
                  <b>
                    {hoursUntilExpiration > 0 && `${hoursUntilExpiration}h `}
                    {minutesUntilExpiration}m {secondsUntilExpiration}s
                  </b>
                </p>
              </div>
            </div>
          )}

          {/* Formulario */}
          <div className='space-y-6 max-w-xl mx-auto'>
            <div className='flex items-center gap-6'>
              <label className='text-lg font-semibold text-[#111827] w-48 text-left'>
                Código de Trabajo
              </label>
              <input
                type='text'
                value={codigoIngresado}
                onChange={handleCodigoChange}
                placeholder='CODIGO'
                disabled={patching || locked || codeExpired}
                maxLength={6}
                className='flex-1 px-4 py-3 bg-white disabled:bg-[#E5E7EB] border-2 border-[#759AE0] rounded-md text-[#111827] text-lg focus:outline-none focus:ring-2 focus:ring-[#759AE0] disabled:cursor-not-allowed uppercase'
              />
            </div>

            <div className='flex items-center gap-6'>
              <label className='text-lg font-semibold text-[#111827] w-48 text-left'>
                Monto a Cobrar
              </label>
              <input
                type='text'
                value={`${summary.amount.total.toFixed(2)} ${summary.amount.currency}`}
                readOnly
                className='flex-1 px-4 py-3 bg-[#E5E7EB] border border-[#D1D5DB] rounded-md text-[#111827] text-lg'
              />
            </div>

            <div className='flex items-center gap-6'>
              <label className='text-lg font-semibold text-[#111827] w-48 text-left'>Estado</label>
              <input
                type='text'
                value={
                  summary.status === 'paid'
                    ? 'CONFIRMADO'
                    : summary.status === 'failed'
                      ? 'ERROR'
                      : 'PENDIENTE'
                }
                readOnly
                className='flex-1 px-4 py-3 bg-[#E5E7EB] border border-[#D1D5DB] rounded-md text-[#111827] text-lg'
              />
            </div>
          </div>

          {/* Botones */}
          <div className='flex justify-center gap-6 mt-12'>
            <button
              onClick={handleContinuar}
              disabled={!codigoIngresado || patching || locked || codeExpired}
              className={`px-12 py-3 text-lg font-semibold rounded-md transition-colors ${
                !codigoIngresado || patching || locked || codeExpired
                  ? 'bg-[#D1D5DB] text-[#64748B] cursor-not-allowed'
                  : 'bg-[#2B31E0] hover:bg-[#2B6AE0] text-[#F9FAFB]'
              }`}
            >
              {patching
                ? 'Confirmando…'
                : locked
                  ? 'Bloqueado'
                  : codeExpired
                    ? 'Código Expirado'
                    : 'Confirmar Pago Recibido'}
            </button>
            <button
              onClick={() => onBack({ refresh: true })}
              disabled={patching}
              className='px-12 py-3 bg-[#2BDDE0] text-[#111827] text-lg font-semibold rounded-md hover:bg-[#5E2BE0] transition-colors disabled:opacity-60'
            >
              Volver
            </button>
          </div>

          {/* ID del pago */}
          <div className='mt-6 text-center text-sm text-gray-500'>
            ID pago: <span className='font-mono text-[#64748B]'>{summary.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
