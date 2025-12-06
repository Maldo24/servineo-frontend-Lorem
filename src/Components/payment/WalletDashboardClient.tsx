// src/app/payment/pages/FixerWallet/WalletDashboardClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Wallet, TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react';

// --- Interfaces para los datos ---
interface WalletData {
  balance: number;
  currency: string;
}

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  jobId?: string;
  createdAt: string;
}

export default function FixerWalletDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [receivedFixerId, setReceivedFixerId] = useState<string | null>(null);

  // --- Estados para datos reales ---
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Lee el fixerId de la URL
    const fixerId = searchParams.get('fixerId');
    if (fixerId) {
      setReceivedFixerId(fixerId);
      console.log('Fixer ID Recibido en Wallet:', fixerId);
      fetchWalletData(fixerId);
    } else {
      console.warn('No se recibió fixerId en la URL.');
      setError('No se proporcionó un ID de Fixer.');
      setLoading(false);
    }
  }, [searchParams]);

  // --- FUNCIÓN DE FETCH CORREGIDA ---
  const fetchWalletData = async (fixerId: string) => {
    setLoading(true);
    setError(null);

    // 🟢 CORRECCIÓN: Usar variable de entorno para que funcione en Vercel y Render
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    try {
      console.log(`📡 Conectando a: ${BACKEND_URL}/api/fixer/payment-center/${fixerId}`);

      // 🟢 Usamos la URL dinámica
      const res = await fetch(`${BACKEND_URL}/api/fixer/payment-center/${fixerId}`);

      if (!res.ok) {
        // Intentamos leer el error JSON, si falla devolvemos un objeto vacío
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${res.status}: No se pudo conectar al servidor`);
      }

      const result = await res.json();

      if (result.success && result.data) {
        // Establece el saldo de la wallet
        setWalletData({
          balance: result.data.saldoActual,
          currency: 'BOB',
        });

        // Cargar transacciones
        setTransactions(result.data.transactions?.slice(0, 3) || []);
      } else {
        throw new Error(result.error || 'No se pudieron cargar los datos.');
      }
    } catch (err: unknown) {
      console.error('Error fetching wallet data:', err);
      setError(err.message || 'Un error inesperado ocurrió.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `Bs. ${Math.abs(value).toFixed(2)}`;
  };

  // --- ESTADO DE CARGA ---
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <Loader2 className='animate-spin text-blue-600' size={48} />
      </div>
    );
  }

  // --- ESTADO DE ERROR ---
  if (error) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <div className='text-center bg-white p-8 rounded-lg shadow-md max-w-sm'>
          <AlertCircle className='text-red-500 mx-auto mb-4' size={48} />
          <h2 className='text-xl font-bold text-gray-800 mb-2'>Error al cargar la Billetera</h2>
          <p className='text-gray-600 mb-6 text-sm'>{error}</p>
          <button
            onClick={() => router.push('/')}
            className='mt-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition-colors'
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // --- PANTALLA PRINCIPAL (con datos) ---
  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <div className='bg-blue-600 text-white px-6 py-4'>
        <h1 className='text-2xl font-bold'>Fixer Wallet</h1>
      </div>

      {/* --- Contenedor principal --- */}
      <div className='max-w-3xl mx-auto px-4'>
        {/* Balance Card */}
        <div className='pt-6 pb-4'>
          <div className='bg-blue-600 rounded-2xl p-6 text-white shadow-lg'>
            <div className='flex items-center gap-2 mb-2'>
              <Wallet size={20} />
              <span className='text-sm opacity-90'>Saldo Actual</span>
            </div>
            <div className='text-5xl font-bold mb-6'>
              Bs. {walletData?.balance?.toFixed(2) || '0.00'}
            </div>

            <Link
              href={`/payment/FixerWallet/recarga?fixerId=${receivedFixerId}`}
              className='w-full block text-center bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors'
            >
              Recargar Saldo
            </Link>
          </div>
        </div>

        {/* Movimientos Recientes */}
        <div className='pb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-gray-600 font-semibold text-lg'>Movimientos Recientes</h2>

            <Link
              href={`/payment/historial?fixerId=${receivedFixerId}`}
              className='text-blue-600 font-semibold'
            >
              Ver todo
            </Link>
          </div>

          <div className='space-y-3'>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div
                  key={tx._id}
                  className='bg-white rounded-xl p-4 shadow-sm flex items-center gap-4'
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {tx.amount > 0 ? (
                      <TrendingUp className='text-green-600' size={24} />
                    ) : (
                      <TrendingDown className='text-red-600' size={24} />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='font-semibold text-gray-900'>{tx.description}</p>
                    <p className='text-sm text-gray-500'>
                      {new Date(tx.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div
                    className={`font-bold text-lg ${
                      tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div className='bg-white rounded-xl p-4 shadow-sm text-center text-gray-500'>
                <p>No se encontraron movimientos recientes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
