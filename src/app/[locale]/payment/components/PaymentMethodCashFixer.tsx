'use client';

import React, { useEffect, useMemo, useState } from 'react';

// typescript: Definir props para el componente
interface PaymentMethodCashFixerProps {
  trabajo: { id: string; monto?: number } | null;
  onClose: (paymentCompleted?: boolean) => void;
  onBack: (opts?: { refresh?: boolean }) => void;
}

export default function PaymentMethodCashFixer({
  trabajo,
  onClose,
  onBack,
}: PaymentMethodCashFixerProps) {
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [loading, setLoading] = useState(true);
  const [patching, setPatching] = useState(false);
  const [mainMessage, setMainMessage] = useState<{
    type: 'error' | 'warning' | 'success' | 'info';
    text: string;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Intentos/bloqueo
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [unlockAtISO, setUnlockAtISO] = useState<string | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [wasLocked, setWasLocked] = useState(false);

  // Estados de código
  const [codeExpired, setCodeExpired] = useState(false);
  const [codeExpiresAt, setCodeExpiresAt] = useState<string | null>(null);

  // Summary
  const [summary, setSummary] = useState<{
    id: string;
    code?: string | null;
    status: 'paid' | 'pending' | 'failed';
    amount: { total: number; currency: string };
  } | null>(null);

  // Countdown para desbloqueo
  const msLeft = useMemo(() => {
    if (!unlockAtISO) return 0;
    const unlockMs = new Date(unlockAtISO).getTime();
    return Math.max(0, unlockMs - now);
  }, [unlockAtISO, now]);

  // Countdown para expiración del código
  const msUntilExpiration = useMemo(() => {
    if (!codeExpiresAt) return 0;
    const expiresMs = new Date(codeExpiresAt).getTime();
    return Math.max(0, expiresMs - now);
  }, [codeExpiresAt, now]);

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

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setMainMessage(null);
      }, 5000);
    }

    if (locked) {
      setWasLocked(true);
    }
  }, [locked, unlockAtISO, wasLocked]);

  // Manejar cambio en el input del código
  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Solo permitir letras y números, máximo 6 caracteres
    const filtered = value.replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setCodigoIngresado(filtered);
  };

  // GET summary
  async function fetchSummary() {
    if (!trabajo?.id) {
      setMainMessage({ type: 'error', text: 'No hay paymentId para consultar.' });
      setLoading(false);
      return;
    }

    setMainMessage(null);
    setRemainingAttempts(null);
    setUnlockAtISO(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/lab/payments/${trabajo.id}/summary`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('📦 [FIXER] Backend response completo:', data);

      const d = data?.data ?? data;
      console.log('📋 [FIXER] Data parseada:', d);

      const total =
        typeof d?.total === 'number'
          ? d.total
          : typeof d?.amount?.total === 'number'
            ? d.amount.total
            : NaN;

      // Detectar código expirado
      const backendExpired = d?.codeExpired === true;
      const manualExpired = d?.codeExpiresAt && new Date(d.codeExpiresAt) < new Date();
      const isExpired = backendExpired || manualExpired;

      console.log('⏰ [FIXER] Verificación expiración en fetchSummary:', {
        backendExpired,
        codeExpiresAt: d?.codeExpiresAt,
        codeExpiresAtParsed: d?.codeExpiresAt
          ? new Date(d.codeExpiresAt).toLocaleString('es-BO')
          : null,
        now: new Date().toLocaleString('es-BO'),
        nowISO: new Date().toISOString(),
        manualExpired,
        isExpired,
      });

      // Actualizar estado de expiración
      if (isExpired && !codeExpired) {
        console.log('🔴 [FIXER] CÓDIGO EXPIRADO detectado en fetchSummary');
        setCodeExpired(true);
        setMainMessage({
          type: 'warning',
          text: '⏱️ El código ha expirado. Solicite al cliente que genere un nuevo código desde su vista para continuar con el pago.',
        });
      } else if (!isExpired && codeExpired) {
        console.log('✅ [FIXER] Código renovado, limpiando estado de expiración');
        setCodeExpired(false);
        setMainMessage(null);
      }

      // Actualizar codeExpiresAt
      if (d?.codeExpiresAt) {
        setCodeExpiresAt(d.codeExpiresAt);
      }

      setSummary({
        id: String(d?.id ?? d?._id ?? trabajo.id),
        code: d?.code ?? null,
        status: (d?.status ?? 'pending') as 'paid' | 'pending' | 'failed',
        amount: {
          total,
          currency: d?.amount?.currency ?? d?.currency ?? 'BOB',
        },
      });
    } catch (e: unknown | null) {
      console.error('❌ [FIXER] Error en fetchSummary:', e);
      setMainMessage({ type: 'error', text: e.message || 'No se pudo cargar el resumen' });
    } finally {
      setLoading(false);
    }
  }

  // Cargar summary al montar
  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trabajo?.id]);

  // Verificación automática de expiración cada segundo
  useEffect(() => {
    if (!codeExpiresAt || codeExpired) return;

    const checkExpiration = () => {
      const expiresMs = new Date(codeExpiresAt).getTime();
      const nowMs = Date.now();

      const secondsLeft = (expiresMs - nowMs) / 1000;

      console.log('⏰ [FIXER] Verificando expiración (auto-check):', {
        expiresAt: new Date(expiresMs).toLocaleString('es-BO'),
        expiresAtISO: new Date(expiresMs).toISOString(),
        now: new Date(nowMs).toLocaleString('es-BO'),
        nowISO: new Date(nowMs).toISOString(),
        secondsLeft: secondsLeft.toFixed(2),
        expired: nowMs >= expiresMs,
      });

      if (nowMs >= expiresMs && !codeExpired) {
        console.log('🔴 [FIXER] CÓDIGO EXPIRADO detectado por auto-check');
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

    const provided = codigoIngresado.trim();
    if (!provided) {
      setMainMessage({ type: 'error', text: 'Por favor, ingrese el código de 6 caracteres.' });
      return;
    }

    if (provided.length !== 6) {
      setMainMessage({ type: 'error', text: 'El código debe tener exactamente 6 caracteres.' });
      return;
    }

    setMainMessage(null);
    setRemainingAttempts(null);
    setUnlockAtISO(null);
    setPatching(true);

    try {
      const res = await fetch(`/api/lab/payments/${summary.id}/confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: provided }),
      });

      const responseData = await res.json();

      // ✅ Código correcto - Mostrar modal de éxito
      if (res.ok) {
        console.log('✅ [FIXER] Pago confirmado exitosamente');
        setShowSuccessModal(true);
        await fetchSummary();
        setCodigoIngresado('');
        return;
      }

      // ❌ Manejo de errores según código de estado

      // 429 - Bloqueado por demasiados intentos
      if (res.status === 429) {
        if (responseData.unlocksAt) {
          setUnlockAtISO(responseData.unlocksAt);
        } else if (responseData.waitMinutes) {
          const unlockDate = new Date(Date.now() + responseData.waitMinutes * 60000);
          setUnlockAtISO(unlockDate.toISOString());
        }

        const errorMsg =
          '🔒 Has superado el número máximo de intentos (3). La cuenta está bloqueada temporalmente por 10 minutos.';
        setMainMessage({ type: 'error', text: errorMsg });
        return;
      }

      // 401 - Código inválido con intentos restantes
      if (res.status === 401) {
        const attempts = responseData.remainingAttempts;
        if (typeof attempts === 'number') {
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

      // 410 - Código expirado
      if (res.status === 410) {
        setCodeExpired(true);
        setMainMessage({
          type: 'warning',
          text: '⏱️ El código ha expirado. Solicite al cliente que genere un nuevo código.',
        });
        return;
      }

      // 400 - Bad Request
      if (res.status === 400) {
        setMainMessage({ type: 'error', text: responseData.error || 'Solicitud inválida' });
        return;
      }

      // 404 - No encontrado
      if (res.status === 404) {
        setMainMessage({ type: 'error', text: 'Pago no encontrado' });
        return;
      }

      // 409 - Conflicto (ya procesado)
      if (res.status === 409) {
        setMainMessage({ type: 'error', text: 'El pago ya fue procesado' });
        return;
      }

      // Otros errores
      setMainMessage({
        type: 'error',
        text: responseData.error || responseData.message || `Error ${res.status}`,
      });
    } catch (e: unknown | null) {
      setMainMessage({ type: 'error', text: e.message || 'Error al confirmar el pago' });
    } finally {
      setPatching(false);
    }
  };

  const handleVolver = () => {
    onBack({ refresh: true });
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose(true);
  };

  // Modal de éxito
  if (showSuccessModal) {
    return (
      <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
        <div className='bg-black rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center'>
          <div className='mb-4'>
            {/* Éxito: #16A34A */}
            <div className='inline-flex items-center justify-center w-16 h-16 bg-[#16A34A] rounded-full mb-4'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
          </div>
          <h2 className='text-2xl font-bold text-white mb-2'>✓ Código correcto! Pago confirmado</h2>
          {/* Primary (Main Blue): #2B31E0 */}
          <button
            onClick={handleCloseSuccessModal}
            className='mt-6 px-8 py-3 bg-[#2B31E0] hover:bg-[#2B6AE0] text-white text-lg font-semibold rounded transition-colors w-full'
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Overlay>
        <Box>
          <div className='flex flex-col items-center'>
            {/* Primary (Main Blue): #2B31E0 */}
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B31E0] mb-4'></div>
            {/* Texto principal (oscuro): #111827 */}
            <p className='text-[#111827]'>Cargando datos del pago…</p>
          </div>
        </Box>
      </Overlay>
    );
  }

  if (mainMessage && !summary) {
    return (
      <Overlay>
        <Box>
          {/* Error: #EF4444 */}
          <div className='text-[#EF4444] font-medium text-lg mb-2'>Error</div>
          {/* Texto principal (oscuro): #111827 */}
          <div className='text-[#111827] text-sm mb-4'>{mainMessage.text}</div>
          <div className='flex justify-end gap-3'>
            <button
              onClick={handleVolver}
              // Neutros: #E5E7EB, #D1D5DB
              className='px-4 py-2 rounded-md border border-[#D1D5DB] hover:bg-[#E5E7EB]'
            >
              Volver
            </button>
            {/* CTA Secundario: Accent (Turquesa brillante) #2BDDE0 */}
            <button
              onClick={() => onClose()}
              className='px-4 py-2 rounded-md bg-[#2BDDE0] text-[#111827] hover:bg-[#5E2BE0]'
            >
              Cerrar
            </button>
          </div>
        </Box>
      </Overlay>
    );
  }

  if (!summary) return null;

  return (
    <Overlay>
      {/* Fondo claro (principal): #F9FAFB */}
      <div className='bg-[#F9FAFB] w-full max-w-2xl mx-4 rounded-lg shadow-xl '>
        {/* Primary (Main Blue): #2B31E0, Texto: #F9FAFB */}
        <div className='bg-[#2B31E0] text-[#F9FAFB] px-6 py-4 flex items-center justify-between rounded-t-lg '>
          <h1 className='text-xl font-semibold '>Método de pago Efectivo — Vista FIXER</h1>
          <button
            onClick={() => onClose()}
            className='hover:bg-[#2B6AE0] px-3 py-1 rounded text-xl transition-colors'
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className='px-8 py-12'>
          {/* Texto principal (oscuro): #111827 */}
          <div className='text-center mb-12'>
            <h2 className='text-2xl font-bold text-[#111827]'>Confirmación del pago recibido</h2>
          </div>

          {/* Mensaje principal unificado */}
          {mainMessage && (
            <div className='mb-6 max-w-xl mx-auto'>
              {/* Aplicando colores de estado del estándar */}
              <div
                className={`border-l-4 p-4 rounded ${
                  mainMessage.type === 'error'
                    ? 'bg-red-50 border-[#EF4444]'
                    : mainMessage.type === 'warning'
                      ? 'bg-amber-50 border-[#F59E0B]'
                      : mainMessage.type === 'success'
                        ? 'bg-green-50 border-[#16A34A]'
                        : 'bg-blue-50 border-[#759AE0]' // Highlight para 'info'
                }`}
              >
                <div className='flex items-start'>
                  <div className='flex-shrink-0'>
                    <svg
                      className={`h-5 w-5 mt-0.5 ${
                        mainMessage.type === 'error'
                          ? 'text-[#EF4444]'
                          : mainMessage.type === 'warning'
                            ? 'text-[#F59E0B]'
                            : mainMessage.type === 'success'
                              ? 'text-[#16A34A]'
                              : 'text-[#759AE0]' // Highlight para 'info'
                      }`}
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      {mainMessage.type === 'success' ? (
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      ) : mainMessage.type === 'error' ? (
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
                        mainMessage.type === 'error'
                          ? 'text-red-800'
                          : mainMessage.type === 'warning'
                            ? 'text-amber-800'
                            : mainMessage.type === 'success'
                              ? 'text-green-800'
                              : 'text-blue-800'
                      }`}
                    >
                      {mainMessage.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contador de bloqueo */}
          {locked && (
            <div className='mb-6 max-w-xl mx-auto'>
              {/* Error: #EF4444 */}
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

          {/* Info de tiempo restante hasta expiración */}
          {!codeExpired && codeExpiresAt && msUntilExpiration > 0 && (
            <div className='mb-6 max-w-xl mx-auto'>
              {/* Highlight: #759AE0 */}
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

          <div className='space-y-6 max-w-xl mx-auto'>
            {/* Código (editable) */}
            <RowInput
              label='Código de Trabajo'
              value={codigoIngresado}
              onChange={handleCodigoChange}
              placeholder='CODIGO'
              disabled={locked || patching || codeExpired}
              maxLength={6}
            />

            {/* Monto */}
            <ReadOnly
              label='Monto a Cobrar'
              value={`${summary.amount.total} ${summary.amount.currency}`}
            />

            {/* Estado */}
            <ReadOnly
              label='Estado'
              value={
                summary.status === 'paid'
                  ? 'CONFIRMADO'
                  : summary.status === 'failed'
                    ? 'ERROR'
                    : 'PENDIENTE'
              }
            />
          </div>

          {/* Botones */}
          <div className='flex justify-center gap-6 mt-12'>
            <button
              onClick={handleContinuar}
              disabled={!codigoIngresado || patching || locked || codeExpired}
              className={`px-12 py-3 text-lg font-semibold rounded-md transition-colors ${
                !codigoIngresado || patching || locked || codeExpired
                  ? // Neutros (deshabilitado): #D1D5DB, #64748B
                    'bg-[#D1D5DB] text-[#64748B] cursor-not-allowed'
                  : // Primary (Main Blue): #2B31E0, Hover: #2B6AE0, Texto: #F9FAFB
                    'bg-[#2B31E0] hover:bg-[#2B6AE0] text-[#F9FAFB]'
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
              onClick={handleVolver}
              disabled={patching}
              // CTA Secundario: Accent (Turquesa brillante) #2BDDE0
              className='px-12 py-3 bg-[#2BDDE0] text-[#111827] text-lg font-semibold rounded-md hover:bg-[#5E2BE0] transition-colors disabled:opacity-60'
            >
              Volver
            </button>
          </div>

          {/* Hint */}
          <div className='mt-6 text-center text-sm text-gray-500'>
            {/* Neutro: #64748B */}
            ID pago: <span className='font-mono text-[#64748B]'>{summary.id}</span>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

/* ---------- helpers UI ---------- */

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    // Overlay semitransparente
    <div className='fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50'>
      {children}
    </div>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return (
    // Fondo claro (principal): #F9FAFB
    <div className='bg-[#F9FAFB] rounded-lg shadow-xl px-8 py-6 max-w-md'>{children}</div>
  );
}

// typescript: Definir props para RowInput
interface RowInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

function RowInput(props: RowInputProps) {
  const { label, value, onChange, placeholder, disabled, maxLength } = props;
  return (
    <div className='flex items-center gap-6'>
      {/* Texto principal (oscuro): #111827 */}
      <label className='text-lg font-semibold text-[#111827] w-48 text-left'>{label}</label>
      <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        // Highlight: #759AE0, Neutros: #E5E7EB
        className='flex-1 px-4 py-3 bg-white disabled:bg-[#E5E7EB] border-2 border-[#759AE0] rounded-md text-[#111827] text-lg focus:outline-none focus:ring-2 focus:ring-[#759AE0] disabled:cursor-not-allowed uppercase'
      />
    </div>
  );
}

// typescript: Definir props para ReadOnly
interface ReadOnlyProps {
  label: string;
  value: string;
}

function ReadOnly({ label, value }: ReadOnlyProps) {
  return (
    <div className='flex items-center gap-6'>
      {/* Texto principal (oscuro): #111827 */}
      <label className='text-lg font-semibold text-[#111827] w-48 text-left'>{label}</label>
      {/* Neutros: #E5E7EB, #D1D5DB, #111827 */}
      <input
        type='text'
        value={value}
        readOnly
        className='flex-1 px-4 py-3 bg-[#E5E7EB] border border-[#D1D5DB] rounded-md text-[#111827] text-lg'
      />
    </div>
  );
}
