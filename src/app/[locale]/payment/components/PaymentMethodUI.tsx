'use client';

import { useEffect, useState, useMemo } from 'react';
import PaymentMethodCashFixer from './PaymentMethodCashFixer';

// 1. ACTUALIZAR INTERFAZ DE PROPS
interface PaymentMethodUIProps {
  paymentId: string | null;
  jobId: string; // <-- AÑADIDO
  requesterId: string; // <-- AÑADIDO
  fixerId: string; // <-- AÑADIDO
  onClose: (paymentCompleted?: boolean) => void;
}

// 2. APLICAR LAS PROPS ACTUALIZADAS
export default function PaymentMethodUI({
  paymentId,
  jobId, // <-- AÑADIDO
  requesterId, // <-- AÑADIDO
  fixerId, // <-- AÑADIDO
  onClose,
}: PaymentMethodUIProps) {
  const [showFixerView, setShowFixerView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [now, setNow] = useState<number>(Date.now());

  const [summary, setSummary] = useState<{
    id: string;
    code?: string | null;
    codeExpired?: boolean;
    status: 'paid' | 'pending' | 'failed';
    codeExpiresAt?: string | null;
    amount: { total: number; currency: string };
  } | null>(null);

  // Actualizar 'now' cada segundo para countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-ocultar notificación después de 10 segundos (solo si NO está expirado)
  useEffect(() => {
    if (showNotification && !summary?.codeExpired) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showNotification, summary?.codeExpired]);

  // Función para cargar summary (reutilizable)
  const loadSummary = async () => {
    if (!paymentId) {
      setErr('No hay paymentId para consultar.');
      setLoading(false);
      return;
    }
    setErr(null);
    setLoading(true);

    try {
      const timestamp = new Date().getTime();
      // --- Usamos la ruta relativa para el fetch (asumiendo rewrites) ---
      const res = await fetch(`/api/lab/payments/${paymentId}/summary?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('📦 [REQUESTER] Backend response:', data);

      const d = data?.data ?? data;

      const total =
        typeof d?.total === 'number'
          ? d.total
          : typeof d?.amount?.total === 'number'
            ? d.amount.total
            : NaN;

      // Detectar expiración (backend o manual)
      const backendExpired = d?.codeExpired === true;
      const manualExpired = d?.codeExpiresAt && new Date(d.codeExpiresAt) < new Date();
      const isExpired = backendExpired || manualExpired;

      console.log('⏰ [REQUESTER] Verificación expiración:', {
        backendExpired,
        manualExpired,
        isExpired,
        codeExpiresAt: d?.codeExpiresAt,
      });

      const uiSummary = {
        id: String(d?.id ?? d?._id ?? paymentId),
        code: d?.code ?? null,
        codeExpired: isExpired,
        status: (d?.status ?? 'pending') as 'paid' | 'pending' | 'failed',
        codeExpiresAt: d?.codeExpiresAt ?? null,
        amount: {
          total,
          currency: d?.amount?.currency ?? d?.currency ?? 'BOB',
        },
      };

      setSummary(uiSummary);

      // Si está expirado, mostrar notificación
      if (isExpired) {
        setShowNotification(true);
      }
    } catch (e: unknown) {
      // Tipado de 'e' como unknown
      console.error('❌ [REQUESTER] Error:', e);
      setErr(e.message || 'No se pudo cargar el resumen');
    } finally {
      setLoading(false);
    }
  };

  // GET summary al montar
  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  // Verificación automática de expiración cada segundo
  useEffect(() => {
    if (!summary?.codeExpiresAt || summary.codeExpired) return;

    const checkExpiration = () => {
      const expiresMs = new Date(summary.codeExpiresAt!).getTime();
      const nowMs = Date.now();

      console.log('⏰ [REQUESTER] Auto-check expiración:', {
        expiresAt: new Date(expiresMs).toLocaleString('es-BO'),
        now: new Date(nowMs).toLocaleString('es-BO'),
        secondsLeft: ((expiresMs - nowMs) / 1000).toFixed(2),
        expired: nowMs >= expiresMs,
      });

      if (nowMs >= expiresMs && !summary.codeExpired) {
        console.log('🔴 [REQUESTER] CÓDIGO EXPIRADO detectado');
        setSummary((prev) => (prev ? { ...prev, codeExpired: true } : null));
        setShowNotification(true);
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [summary?.codeExpiresAt, summary?.codeExpired]);

  // Calcular tiempo restante
  const expiryInfo = useMemo(() => {
    if (!summary?.codeExpiresAt) return null;

    const expiry = new Date(summary.codeExpiresAt);
    const diffMs = expiry.getTime() - now;

    if (diffMs <= 0 || summary.codeExpired) {
      return { expired: true, hoursLeft: 0, minutesLeft: 0, secondsLeft: 0 };
    }

    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((diffMs % (1000 * 60)) / 1000);

    return { expired: false, hoursLeft, minutesLeft, secondsLeft };
  }, [summary?.codeExpiresAt, summary?.codeExpired, now]);

  // --- 3. ACTUALIZAR handleRegenerateCode ---
  // --- ACTUALIZAR handleRegenerateCode en PaymentMethodUI.tsx ---
  const handleRegenerateCode = async () => {
    if (!jobId) {
      setErr('No hay jobId disponible para regenerar el código');
      return;
    }

    setErr(null);
    setRegenerating(true);

    try {
      console.log(`🔄 [REQUESTER] Regenerando código para jobId: ${jobId}`);

      // Usar la nueva ruta que recibe jobId como parámetro
      const res = await fetch(`/api/lab/payments/regenerate-code/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await res.json();
      console.log('📦 [REQUESTER] Respuesta de regeneración:', responseData);

      if (!res.ok) {
        throw new Error(responseData.error || 'Error al regenerar el código');
      }

      console.log('✅ [REQUESTER] Código regenerado exitosamente');
      console.log('🆕 Nuevo código:', responseData.data?.code);
      console.log('⏰ Nueva expiración:', responseData.data?.expiresAt);

      // Recargar summary para obtener el nuevo código y fecha de expiración
      await loadSummary();

      // Mostrar notificación de éxito
      setShowNotification(true);
    } catch (e: unknown) {
      console.error('❌ [REQUESTER] Error regenerando código:', e);
      setErr(e.message || 'Error al regenerar el código');
    } finally {
      setRegenerating(false);
    }
  };

  // --- (El resto de tu código: handleContinuar, handleVolver, y todo el JSX/return) ---
  // --- (No necesita cambios) ---
  const handleContinuar = () => {
    // Solo cierra si no está expirado
    if (!isExpired) {
      onClose(true); // Asume que "Continuar" significa que el pago se completó
    }
  };

  const handleVolver = async (opts?: { refresh?: boolean }) => {
    setShowFixerView(false);
    if (opts?.refresh) {
      await loadSummary();
    }
  };

  // Vista del proveedor (FIXER)
  if (showFixerView && summary) {
    return (
      <PaymentMethodCashFixer
        trabajo={{
          id: summary.id,
          monto: summary.amount.total,
        }}
        onClose={onClose}
        onBack={handleVolver}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className='fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50'>
        <div className='bg-[#F9FAFB] rounded-lg shadow-xl px-8 py-6'>
          <div className='flex flex-col items-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B31E0] mb-4'></div>
            <p className='text-[#111827]'>Cargando resumen…</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (err && !summary) {
    return (
      <div className='fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50'>
        <div className='bg-[#F9FAFB] rounded-lg shadow-xl px-8 py-6 space-y-3 max-w-md'>
          <div className='text-[#EF4444] font-medium text-lg'>Error</div>
          <div className='text-[#111827] text-sm'>{err}</div>
          <div className='flex justify-end'>
            <button
              onClick={() => onClose()}
              className='px-4 py-2 rounded-md bg-[#2BDDE0] text-[#111827] hover:bg-[#5E2BE0]'
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const isExpired = expiryInfo?.expired || summary.codeExpired;

  // Vista inicial (REQUESTER)
  return (
    // Incrementado el z-index para que esté sobre el modal anterior si es necesario
    <div className='fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-[1200]'>
      <div className='bg-[#F9FAFB] w-full max-w-2xl mx-4 rounded-lg shadow-xl'>
        {/* Header */}
        <div className='bg-[#2B31E0] text-[#F9FAFB] px-6 py-4 flex items-center justify-between rounded-t-lg'>
          <h1 className='text-xl font-semibold'>Método de pago Efectivo — Vista REQUESTER</h1>
          <button
            onClick={() => onClose()}
            className='hover:bg-[#2B6AE0] px-3 py-1 rounded text-xl transition-colors'
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className='px-8 py-12'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-[#111827]'>Muestra este código al proveedor</h2>
            <h2 className='text-2xl font-bold text-[#111827]'>para confirmar tu pago</h2>
          </div>

          {/* Notificación de vigencia o expiración */}
          {expiryInfo && showNotification && (
            <div className='max-w-xl mx-auto mb-8 relative'>
              {isExpired ? (
                // Código expirado
                <div className='bg-red-50 border-l-4 border-[#EF4444] p-4 rounded shadow-lg'>
                  <button
                    onClick={() => setShowNotification(false)}
                    className='absolute top-2 right-2 text-[#EF4444] hover:text-red-700 font-bold text-xl'
                  >
                    ×
                  </button>
                  <div className='flex items-start'>
                    <div className='flex-shrink-0'>
                      <svg
                        className='h-5 w-5 text-[#EF4444] mt-0.5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='ml-3 flex-1 pr-6'>
                      <p className='text-sm font-medium text-red-800 mb-2'>
                        ⚠️ Este código ha <strong>expirado</strong>
                      </p>
                      <p className='text-xs text-red-700 mb-3'>
                        Por favor, genera un nuevo código para continuar con tu pago.
                      </p>
                      <button
                        onClick={handleRegenerateCode}
                        disabled={regenerating}
                        className='bg-[#EF4444] hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors'
                      >
                        {regenerating ? 'Regenerando...' : '🔄 Generar Nuevo Código'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Código vigente
                <div className='bg-blue-50 border-l-4 border-[#759AE0] p-4 rounded shadow-lg'>
                  <button
                    onClick={() => setShowNotification(false)}
                    className='absolute top-2 right-2 text-[#759AE0] hover:text-blue-700 font-bold text-xl'
                  >
                    ×
                  </button>
                  <div className='flex items-start'>
                    <div className='flex-shrink-0'>
                      <svg
                        className='h-5 w-5 text-[#759AE0] mt-0.5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='ml-3 flex-1 pr-6'>
                      <p className='text-sm font-medium text-blue-800 mb-1'>
                        ⏰ Tiempo restante de validez
                      </p>
                      <p className='text-lg font-bold text-blue-900'>
                        {expiryInfo.hoursLeft}h {expiryInfo.minutesLeft}m {expiryInfo.secondsLeft}s
                      </p>
                      {summary.codeExpiresAt && (
                        <p className='text-xs text-blue-700 mt-1'>
                          Expira:{' '}
                          {new Date(summary.codeExpiresAt).toLocaleString('es-BO', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Campos del pago */}
          <div className='space-y-6 max-w-xl mx-auto'>
            <LabeledReadOnly
              label='Código de Trabajo'
              value={isExpired ? 'EXPIRADO' : (summary.code ?? '—')}
              highlight={!isExpired}
              expired={isExpired}
            />
            <LabeledReadOnly
              label='Monto a Pagar'
              value={
                Number.isFinite(summary.amount.total)
                  ? `${summary.amount.total} ${summary.amount.currency}`
                  : '—'
              }
            />
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
                className='flex-1 px-4 py-3 rounded-md text-lg bg-[#E5E7EB] border border-[#D1D5DB] text-[#111827] text-center uppercase font-semibold'
              />
            </div>
          </div>

          {/* Mensajes de error */}
          {err && (
            <div className='mt-6 max-w-xl mx-auto'>
              <div className='bg-red-50 border border-red-200 rounded p-3'>
                <p className='text-[#EF4444] font-medium text-sm'>{err}</p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className='flex justify-center gap-6 mt-12'>
            <button
              onClick={handleContinuar}
              disabled={isExpired}
              className={`px-12 py-3 text-lg font-semibold rounded-md transition-colors ${
                isExpired
                  ? 'bg-[#D1D5DB] text-[#64748B] cursor-not-allowed'
                  : 'bg-[#2B31E0] hover:bg-[#2B6AE0] text-[#F9FAFB]'
              }`}
            >
              {isExpired ? 'Código Expirado' : 'Continuar'}
            </button>
            <button
              onClick={() => onClose()}
              className='px-12 py-3 bg-[#2BDDE0] text-[#111827] text-lg font-semibold rounded-md hover:bg-[#5E2BE0] transition-colors'
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers UI ---------------- */

interface LabeledReadOnlyProps {
  label: string;
  value: string;
  highlight?: boolean;
  expired?: boolean;
}

function LabeledReadOnly({
  label,
  value,
  highlight = false,
  expired = false,
}: LabeledReadOnlyProps) {
  return (
    <div className='flex items-center gap-6'>
      <label className='text-lg font-semibold text-[#111827] w-48 text-left'>{label}</label>
      <input
        type='text'
        value={value}
        readOnly
        className={`flex-1 px-4 py-3 rounded-md text-lg ${
          expired
            ? 'bg-red-50 border-2 border-[#EF4444] text-[#EF4444] font-bold text-center line-through'
            : highlight
              ? 'bg-blue-50 border-2 border-[#759AE0] text-blue-900 font-bold text-center tracking-widest'
              : 'bg-[#E5E7EB] border border-[#D1D5DB] text-[#111827]'
        }`}
      />
    </div>
  );
}
