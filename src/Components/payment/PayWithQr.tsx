'use client';

import { useEffect, useState } from 'react';
import BackButton from './BackButton';

// Tipos
type PaymentStatus = 'pending' | 'under_review' | 'confirmed' | 'rejected' | 'expired';

type Intent = {
  _id: string;
  bookingId: string;
  providerId: string;
  amountExpected: number;
  currency: string;
  paymentReference: string;
  status: PaymentStatus;
  deadlineAt?: string;
  createdAt?: string;
};

type PaymentMethod = {
  qrImageUrl?: string;
  accountDisplay?: string;
};

// URL del backend
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:8000';

export default function PayWithQr() {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);

  // error “duro” (cuando de verdad no se puede generar el pago)
  const [error, setError] = useState<string | null>(null);
  // aviso de negocio (por ejemplo: NO_QR)
  const [warning, setWarning] = useState<string | null>(null);

  // Para la demo usamos valores fijos (los mismos que ya está pasando el modal)
  const bookingId = 'TEST-BOOKING-1';
  const providerId = 'DEMO-PROVIDER';
  const amount = 215; // BOB
  const currency = 'BOB';

  // Helper para formatear moneda
  const money = (n: number) => n.toLocaleString('es-BO', { style: 'currency', currency });

  // Estado para la imagen del QR
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const toDriveThumb = (url: string) => {
    const m = url.match(/id=([^&]+)/);
    return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w512` : url;
  };

  const fallbackQR = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
    'Servineo QR',
  )}`;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        setWarning(null);

        const payload = { bookingId, providerId, amount, currency };
        console.log('→ POST /api/payments/intent payload =', payload);
        console.log('BACKEND_URL =', BACKEND_URL);

        const res = await fetch(`${BACKEND_URL}/api/payments/intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log('← status', res.status);
        console.log('← body', data);

        if (!res.ok) {
          // Respuesta 5xx / 4xx -> error duro
          const msg = data?.message || data?.error || `Error HTTP ${res.status}`;
          throw new Error(msg);
        }

        // Éxito -> limpiamos error duro
        setError(null);
        setIntent(data.intent || null);
        setMethod(data.paymentMethod || null);

        // Si el backend mandara un código de negocio
        if (data.error === 'NO_QR') {
          setWarning('El proveedor no tiene QR configurado.');
        } else {
          setWarning(null);
        }
      } catch (e: unknown) {
        console.error('❌ Error creando intent:', e);
        setError(
          e?.message === 'SERVER_ERROR'
            ? 'Ocurrió un problema al generar el pago. Intenta nuevamente.'
            : e?.message || 'Error al conectar con el servidor.',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Actualizar imagen del QR cuando llegue el método
  useEffect(() => {
    if (method?.qrImageUrl) {
      setImgSrc(method.qrImageUrl);
    } else {
      setImgSrc(null);
    }
  }, [method]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p>Cargando…</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Barra superior */}
      <header className='bg-[#2B6AE0]'>
        <div className='max-w-5xl px-6 py-6'>
          <h1 className='text-5xl font-semibold text-white'>Pagos con QR</h1>
        </div>
      </header>

      <BackButton fallback='/payment' className='fixed bottom-4 right-4 z-50' />

      <main className='max-w-5xl mx-auto p-6'>
        {/* Mensajes */}
        {warning && <p className='text-center text-red-500 font-semibold mb-3'>{warning}</p>}

        {/* Solo mostramos el error “duro” si NO tenemos intent */}
        {error && !intent && <p className='text-center text-red-500 font-semibold mb-3'>{error}</p>}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
          {/* COLUMNA IZQUIERDA: Información de pago */}
          <section className='md:-ml-35'>
            <h2 className='text-4xl font-semibold mb-3 text-black'>Información de pago</h2>

            <div className='my-2'>
              <hr className='w-150 border-t-2 border-[#2B6AE0]' />
            </div>

            <dl className='space-y-6 text-black'>
              {/* Destinatario */}
              <div className='relative min-h-8'>
                <dt className='text-2xl font-medium inline-block w-[200px] text-left'>
                  Destinatario:
                </dt>
                <dd className='text-2xl leading-tight absolute top-0.5 left-[280px]'>
                  {method?.accountDisplay || '—'}
                </dd>
              </div>

              {/* Número de Transacción */}
              <div className='relative min-h-8'>
                <dt className='text-2xl font-medium inline-block w-[220px] text-left'>
                  Nro de Transacción:
                </dt>
                <dd className='text-2xl leading-tight absolute top-0.5 left-[280px]'>
                  {intent?.paymentReference || '—'}
                </dd>
              </div>

              {/* Subtotal */}
              <div className='relative min-h-8'>
                <dt className='text-2xl font-medium inline-block w-[200px] text-left'>
                  Sub Total:
                </dt>
                <dd className='text-2xl leading-tight absolute top-0 left-[280px]'>
                  {intent ? money(Math.round(intent.amountExpected * 0.97)) : '—'}
                </dd>
              </div>

              {/* Comisión */}
              <div className='relative min-h-8'>
                <dt className='text-2xl font-medium inline-block w-[160px] text-left'>Comisión:</dt>
                <dd className='text-2xl leading-tight absolute top-0 left-[280px]'>
                  {intent ? money(Math.round(intent.amountExpected * 0.03)) : '—'}
                </dd>
              </div>

              {/* Total */}
              <div className='relative min-h-8'>
                <dt className='text-2xl font-semibold inline-block w-[160px] text-left'>Total:</dt>
                <dd className='text-2xl font-semibold leading-tight absolute top-0 left-[280px]'>
                  {intent ? money(intent.amountExpected) : '—'}
                </dd>
              </div>

              <div className='my-5'>
                <hr className='w-150 border-t-2 border-[#2B6AE0]' />
              </div>

              {/* Estado */}
              <div className='relative min-h-8'>
                <dt className='text-2xl font-medium inline-block w-[160px] text-left'>Estado:</dt>
                <dd className='text-2xl leading-tight absolute top-0 left-0 translate-x-[280px]'>
                  {intent?.status ? intent.status.toUpperCase() : '—'}
                </dd>
              </div>

              <div className='my-6'>
                <hr className='w-150 border-t-2 border-[#2B6AE0]' />
              </div>
            </dl>
          </section>

          {/* COLUMNA DERECHA: QR */}
          <aside className='bg-[#759AE0] rounded-xl p-5 md:justify-self-end w-full md:w-[420px] md:ml-16 md:self-center'>
            <h3 className='text-2xl font-semibold text-gray-900 mb-4 text-center'>
              Escanea el código QR
            </h3>

            <div className='h-64 w-full rounded-lg bg-gray-200 flex items-center justify-center'>
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt='QR de pago'
                  className='max-h-60 object-contain'
                  referrerPolicy='no-referrer'
                  onError={() => {
                    if (imgSrc.includes('drive.google.com') && !imgSrc.includes('/thumbnail')) {
                      setImgSrc(toDriveThumb(imgSrc));
                    } else {
                      setImgSrc(fallbackQR);
                    }
                  }}
                />
              ) : (
                <img
                  src={fallbackQR}
                  alt='QR de pago (fallback)'
                  className='max-h-60 object-contain'
                />
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
