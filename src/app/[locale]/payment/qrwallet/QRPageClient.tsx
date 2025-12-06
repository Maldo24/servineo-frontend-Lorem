'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BackButton from '../components/BackButton';

//tipos simples
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
type PaymentMethod = { qrImageUrl?: string; accountDisplay?: string };

// Lee la URL del backend de tu .env.local
//const BACKEND_URL_DEPLOYADO = process.env.BACKEND_URL;

export default function PaymentsPage() {
  const searchParams = useSearchParams();

  //estado que llamamos desde el backend
  const [intent, setIntent] = useState<Intent | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener trabajoId de la URL para mostrarlo
  const trabajoId = searchParams.get('trabajoId') || '—';
  const montoDemo = Number(searchParams.get('amount')) || 150;
  const currencyDemo = searchParams.get('currency') || 'BOB';

  //para la demo se usa valores fijos para recuperar el QR (igual que el original)
  const bookingId = 'TEST-BOOKING-1';
  const providerId = 'prov_123';
  const amount = 150; //monto en BOB
  const currency = 'BOB';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // [LOG B] payload que envías al backend
        const payload = { bookingId, providerId, amount, currency };
        console.log('→ POST /api/payments/intent payload =', payload);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId, providerId, amount, currency }),
        });

        // [LOG C] status de la respuesta
        console.log('← status', res.status);

        const data = await res.json();

        // [LOG D] cuerpo de la respuesta
        console.log('← body', data);

        if (!res.ok) throw new Error(data?.message || data?.error || 'Error al crear intent');
        setIntent(data.intent);
        setMethod(data.paymentMethod || null);
        if (data.error === 'NO_QR') setError('El proveedor no tiene QR configurado.');
      } catch (e: unknown) {
        setError(e.message || 'Error de red');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // [LOG A] — esto sale en la consola del navegador (DevTools > Console)
  //console.log("API_BASE =", BACKEND_URL_DEPLOYADO);

  // Helper para formatear moneda (lo usamos en subtotal/comisión/total)
  const money = (n: number) =>
    n.toLocaleString('es-BO', { style: 'currency', currency: currencyDemo });

  //agregado
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const toDriveThumb = (url: string) => {
    const m = url.match(/id=([^&]+)/);
    return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w512` : url;
  };

  const fallbackQR = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent('Servineo QR')}`;

  useEffect(() => {
    if (method?.qrImageUrl) {
      setImgSrc(method.qrImageUrl); // primero intentamos con uc?export=view
    }
  }, [method]);

  //fin agregado

  return (
    <div className='min-h-screen bg-white'>
      {/* Barra superior */}
      <header className='bg-[#2B6AE0]'>
        <div className='max-w-5xl px-6 py-6'>
          <h1 className='text-4xl md:text-5xl font-semibold text-white'>Recarga de Saldo</h1>
        </div>
      </header>

      <BackButton fallback='/payments' className='fixed bottom-4 right-4 z-50' />

      <main className='max-w-5xl mx-auto p-4 md:p-6'>
        {loading && <p>Cargando…</p>}
        {error && <p className='text-red-600 mb-3'>{error}</p>}

        {/* GRID RESPONSIVO */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* COLUMNA IZQUIERDA */}
          <section className='md:-ml-25'>
            <h2 className='text-3xl md:text-4xl font-semibold mb-3 text-black'></h2>

            <div className='my-2 min-h-2'>
              <hr className='border-t-2 border-[#2B6AE0]' />
            </div>

            <dl className='space-y-6 text-black'>
              {/* Destinatario */}
              <div className='flex flex-col md:flex-row md:items-center gap-1 min-h-12'>
                <dt className='text-xl md:text-2xl font-medium md:w-[160px]'>Destinatario:</dt>
                <dd className='text-xl md:text-2xl absolute left-[250px]'>
                  {method?.accountDisplay || '—'}
                </dd>
              </div>

              {/* Número de Transacción */}
              <div className='relative min-h-10'>
                <dt className='text-2xl font-medium inline-block w-[240px] text-left whitespace-nowrap'>
                  N° de Transacción:
                </dt>
                <dd className='text-2xl leading-tight absolute top-0 left-[250px]'>
                  {intent?.paymentReference || '—'}
                </dd>
              </div>

              {/* Total */}
              <div className='relative min-h-12'>
                <dt className='text-2xl font-semibold inline-block w-[160px] text-left'>Total:</dt>
                <dd className='text-2xl font-semibold leading-tight absolute top-0 left-[250px]'>
                  {money(montoDemo)}
                </dd>
              </div>

              <div className='my-2'>
                <hr className='border-t-2 border-[#2B6AE0]' />
              </div>

              <div className='my-9'>
                <hr className='border-t-2 border-[#2B6AE0]' />
              </div>

              {/* Estado */}
              <div className='relative min-h-8 mt-6'>
                <dt className='text-2xl font-medium inline-block w-[160px] text-left'>Estado:</dt>
                <dd className='text-2xl leading-tight absolute top-0 left-0 translate-x-[250px]'>
                  {intent?.status ? intent.status.toUpperCase() : '—'}
                </dd>
              </div>

              <div className='my-7'>
                <hr className='border-t-2 border-[#2B6AE0]' />
              </div>
            </dl>
          </section>

          {/* COLUMNA DERECHA */}
          <aside className='bg-[#759AE0] rounded-xl p-5 w-full md:w-[420px] md:ml-24 md:self-start'>
            <h3 className='text-xl md:text-2xl font-semibold text-gray-900 mb-4 text-center'>
              Escanea el código QR
            </h3>

            <div className='h-56 md:h-64 w-full rounded-lg bg-gray-200 flex items-center justify-center md:justify-self-end'>
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt='QR de pago'
                  className='max-h-full object-contain'
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
                  className='max-h-full object-contain'
                />
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
