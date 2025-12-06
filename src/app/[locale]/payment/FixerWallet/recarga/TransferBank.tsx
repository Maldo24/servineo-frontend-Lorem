'use client';
//pasar
import React from 'react';
import { useEffect, useState } from 'react';
import BackButton from '../../components/BackButton';
import { Copy } from 'lucide-react';

interface TransferBankProps {
  fixerId: string;
  onBack: () => void;
  servineoId: string; // agregas esta prop
  amount: number;
}

interface TransferData {
  transactionNumber: string;
  accountNumber: string;
  totalAmount: number;
  status: string;
  recipientName?: string; // destinatario
}

export default function TransferBank({ fixerId, servineoId, amount }: TransferBankProps) {
  const [data, setData] = useState<TransferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transferStatus, setTransferStatus] = useState<string | null>(null);

  // const BACKEND_URL_DEPLOYADO = process.env.BACKEND_URL;

  useEffect(() => {
    console.log('TransferBank useEffect triggered', { fixerId, servineoId, amount });

    async function fetchTransferData() {
      setLoading(true);
      setError(null);

      if (!fixerId || !amount || amount <= 0) {
        setError('Monto inválido para transferencia');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transferencia-bancaria/intent`,
          {
            //const res = await fetch('/api/transferencia-bancaria/intent'   , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fixerId, amount, servineoId }),
          },
        );

        console.log('Response status:', res.status);

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Error al recuperar datos');
        }

        const json = await res.json();
        const intent = json.intent;
        const method = json.paymentMethod;

        if (!intent || !method) throw new Error('Datos incompletos');

        setData({
          transactionNumber: intent.paymentReference,
          accountNumber: method.accountNumber,
          totalAmount: intent.amountExpected,
          status: intent.status,
          recipientName: method.accountDisplay,
        });

        setTransferStatus(intent.status); // <-- Guardar estado aquí
      } catch (err: unknown) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransferData();
  }, [fixerId, amount, servineoId]);

  //para copiar la cuenta bancaria
  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Número de cuenta copiado al portapapeles');
      })
      .catch(() => {
        alert('No se pudo copiar el número de cuenta');
      });
  };

  // Helper para formatear moneda
  const money = (n: number) => n.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' });

  if (loading) {
    return (
      <div className='min-h-screen bg-white p-6 flex items-center justify-center'>
        <p className='text-center text-gray-700'>Cargando información de transferencia...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white mt-16'>
      <header className='bg-[#2B6AE0]'>
        <div className='max-w-5xl px-6 py-6'>
          <h1 className='text-5xl font-semibold text-white '>Recarga por transferencia bancaria</h1>
        </div>
      </header>

      <BackButton fallback='/payments' className='fixed bottom-4 right-4 z-50' />

      <main className='max-w-5xl mx-auto p-6'>
        {/* Mostrar error si existe */}
        {error && <p className='text-red-600 mb-3 text-center font-semibold text-2xl'>{error}</p>}

        {/* Mostrar cargando */}
        {loading && (
          <p className='text-center text-2xl'>Cargando información de transferencia...</p>
        )}

        {/* Mostrar información aunque no haya datos (usar valores por defecto) */}
        {!loading && (
          <div className='flex flex-col items-center justify-center'>
            <section className='w-full max-w-4xl'>
              <h2 className='text-4xl font-semibold mb-6 text-black text-center'>
                Información de pago
              </h2>

              <div className='my-2'>
                <hr className='w-full max-w-5xl border-t-2 border-[#2B6AE0] mx-auto' />
              </div>

              <dl className='space-y-6 text-black'>
                {/* Destinatario */}
                <div className='flex flex-col md:flex-row items-start md:items-center min-h-8 px-6'>
                  <dt className='text-2xl font-medium w-44'>Destinatario:</dt>
                  <dd className='text-2xl leading-tight flex-grow text-right'>
                    {data?.recipientName || data?.transactionNumber
                      ? data.recipientName || 'Servineo.Cop'
                      : '—'}
                  </dd>
                </div>

                {/* Número de Transacción */}
                <div className='flex flex-col md:flex-row items-start md:items-center min-h-8 px-6'>
                  <dt className='text-2xl font-medium w-44 whitespace-nowrap'>
                    N° de Transacción:
                  </dt>
                  <dd className='text-2xl leading-tight flex-grow text-right'>
                    {data?.transactionNumber || 'XXXXXXXXXX'}
                  </dd>
                </div>

                {/* Número de cuenta */}
                <div className='flex flex-col md:flex-row items-start md:items-center min-h-8 px-6'>
                  <dt className='text-2xl font-medium w-44 whitespace-nowrap'>
                    Número de cuenta para la transferencia:
                  </dt>
                  <dd className='text-2xl leading-tight flex-grow text-right'>
                    {data?.accountNumber || 'XXXXXXXXXX'}
                  </dd>

                  <button
                    onClick={() => copyToClipboard(data?.accountNumber || '')}
                    aria-label='Copiar número de cuenta'
                    title='Copiar número de cuenta'
                    type='button'
                    className='ml-4 text-gray-600 hover:text-blue-600 transition-colors'
                  >
                    <Copy size={24} />
                  </button>
                </div>

                {/* Total */}
                <div className='flex items-center min-h-8 px-6'>
                  <dt className='text-2xl font-semibold w-44'>Total:</dt>
                  <dd className='text-2xl font-semibold leading-tight flex-grow text-right'>
                    {amount
                      ? money(amount)
                      : data?.totalAmount
                        ? money(data.totalAmount)
                        : 'XX,XXX.XX Bs.'}
                  </dd>
                </div>

                {/* Separador */}
                <div className='my-2'>
                  <hr className='w-full max-w-5xl border-t-2 border-[#2B6AE0] mx-auto' />
                </div>

                {/* Estado */}
                <div className='flex items-center min-h-8 px-6 mt-6'>
                  <dt className='text-2xl font-medium w-44'>Estado:</dt>
                  <dd className='text-2xl leading-tight flex-grow text-right'>
                    {transferStatus ? transferStatus.toUpperCase() : '—'}
                  </dd>
                </div>

                {/* Separador final */}
                <div className='my-7'>
                  <hr className='w-full max-w-5xl border-t-2 border-[#2B6AE0] mx-auto' />
                </div>
              </dl>
            </section>
          </div>
        )}

        {/* Botón Volver fijo abajo */}
        <div className='fixed bottom-4 right-4 z-50'>
          <button
            onClick={() => window.history.back()}
            className='bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors'
          >
            ← Volver
          </button>
        </div>
      </main>
    </div>
  );
}
