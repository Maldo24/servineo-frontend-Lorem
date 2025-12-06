// servineo-frontend/src/Components/payment/CentroPagos.tsx
'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Wallet, Building2, FileText, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import RecentEarningsModal from './RecentEarningsModal';
import { showToast } from 'nextjs-toast-notify';

// --- Constantes Mock ---
const MOCK_FIXER_ID = '690c1a08f32ebc5be9c5707c';
const MOCK_WALLET_ID = '6917ca234f50d0d44bff1173';

// --- Interfaz para los datos ---
interface FixerData {
  saldoActual: number;
  totalGanado: number;
  trabajosCompletados: number;
  fixerId?: string;
  isTestData?: boolean;

  lowBalanceAlert?: {
    type: 'none' | 'low' | 'critical';
  };

  lowBalanceInfo?: {
    balance: number;
    currency: string;
    lowBalanceThreshold: number;
    lastLowBalanceNotification?: string | Date;

    flags?: {
      needsLowAlert?: boolean;
      needsCriticalAlert?: boolean;
      cooldownUntil?: string | Date | null;
      updatedAt?: string | Date | null;
    };

    toast?: {
      shouldShow: boolean;
      level: 'low' | 'critical' | 'none';
      message: string;
    };
  };
}

const CentroDePagos = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fixerIdFromUrl = searchParams.get('fixerId');

  const [fixerData, setFixerData] = useState<FixerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEarningsModal, setShowEarningsModal] = useState(false);

  useEffect(() => {
    if (fixerIdFromUrl) {
      fetchFixerData(fixerIdFromUrl);
    } else {
      setError('No se especificó un ID de Fixer.');
      setLoading(false);
    }
  }, [fixerIdFromUrl]);

  useEffect(() => {
    const toastInfo = fixerData?.lowBalanceInfo?.toast;
    console.log('🎯 Toast info en front:', toastInfo);

    if (!toastInfo) return;

    const { level, message, shouldShow } = toastInfo;

    const baseOptions = {
      duration: 8000,
      position: 'top-center' as const,
      transition: 'bounceIn' as const,
      sound: false,
      progress: true,
    };

    if (shouldShow && level === 'critical') {
      showToast.error(
        message ||
          'Tu saldo está en negativo o en un estado crítico. Te recomendamos recargar tu billetera.',
        baseOptions,
      );
      return;
    }

    if (shouldShow && level === 'low') {
      showToast.warning(
        message || 'Tu saldo está bajo. Te recomendamos recargar tu billetera.',
        baseOptions,
      );
      return;
    }

    if (level === 'none') {
      showToast.success(
        message || 'Tu billetera está saludable. Puedes seguir recibiendo pagos sin problema.',
        baseOptions,
      );
    }
  }, [
    fixerData?.lowBalanceInfo?.toast?.shouldShow ?? null,
    fixerData?.lowBalanceInfo?.toast?.level ?? null,
  ]);

  const fetchFixerData = async (fixerId: string) => {
    setLoading(true);
    setError(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    try {
      console.log(`🔍 Intentando conectar a: ${BACKEND_URL}/api/fixer/payment-center/${fixerId}`);

      const response = await fetch(`${BACKEND_URL}/api/fixer/payment-center/${fixerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Datos recibidos:', result);

      if (result.success && result.data) {
        setFixerData(result.data);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (err: unknown) {
      console.error('❌ Error fetching fixer data:', err);
      setError(err.message || 'Error desconocido');

      console.log('⚠️ Usando datos de prueba');
      setFixerData({
        saldoActual: 13.0,
        totalGanado: 15420.0,
        trabajosCompletados: 23,
        fixerId: fixerId,
        isTestData: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='animate-spin text-blue-600 mx-auto mb-4' size={48} />
          <p className='text-gray-600'>Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error || !fixerData) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <div className='text-center bg-white p-8 rounded-lg shadow-md'>
          <AlertCircle className='text-red-500 mx-auto mb-4' size={48} />
          <h2 className='text-xl font-bold text-gray-800 mb-2'>Error al cargar</h2>
          <p className='text-gray-600'>{error || 'No se pudieron cargar los datos.'}</p>
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

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='bg-blue-600 text-white px-6 py-4 shadow-md'>
        <h1 className='text-xl font-bold'>Centro de Pagos</h1>
      </div>

      <div className='max-w-3xl mx-auto px-4'>
        <div className='flex justify-end pt-4'>
          <button
            onClick={() => setShowEarningsModal(true)}
            className="font-['Roboto'] inline-flex items-center justify-center px-5 py-2 rounded-lg bg-[#2c6ef7] text-white font-semibold shadow-sm transition-colors hover:bg-[#1f5ad6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2c6ef7]"
          >
            Mis Ganancias
          </button>
        </div>

        {fixerData?.isTestData && (
          <div className='mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='text-yellow-600' size={20} />
              <p className='text-sm text-yellow-800'>
                Mostrando datos de prueba. No se encontró información del fixer.
              </p>
            </div>
          </div>
        )}

        <div className='pt-6 pb-4'>
          <div className='bg-blue-600 rounded-2xl p-4 sm:p-6 shadow-xl text-white'>
            <div className='flex flex-col sm:flex-row items-center gap-4 mb-6'>
              <Wallet size={44} className='opacity-90 flex-shrink-0' />
              <div>
                <span className='text-sm opacity-90'>Saldo Actual</span>
                <h2 className='text-3xl sm:text-4xl font-bold'>
                  Bs. {fixerData?.saldoActual?.toFixed(2) || '0.00'}
                </h2>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='bg-[#759ae0] rounded-xl p-4'>
                <p className='text-xs text-white opacity-75 mb-1'>Total Ganado</p>
                <p className='text-xl font-bold text-white'>
                  Bs. {fixerData?.totalGanado?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className='bg-[#759ae0] rounded-xl p-4'>
                <p className='text-xs text-white opacity-75 mb-1'>Trabajos Completados</p>
                <p className='text-3xl font-bold text-white'>
                  {fixerData?.trabajosCompletados || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='pb-6'>
          <h3 className='text-base font-semibold text-gray-600 mb-3'>Acciones Rápidas</h3>

          <div>
            <button
              onClick={() => router.push(`/payment/FixerWallet?fixerId=${fixerIdFromUrl}`)}
              disabled={!fixerIdFromUrl}
              className='w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group disabled:opacity-50'
            >
              <div className='bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors'>
                <Wallet className='text-blue-600' size={28} />
              </div>
              <div className='flex-1 text-left'>
                <h4 className='font-bold text-gray-800 text-base'>Fixer Wallet</h4>
                <p className='text-sm text-gray-500'>Ver saldo, recargar y revisar movimientos</p>
              </div>
              <ChevronRight
                className='text-gray-400 group-hover:text-blue-600 transition-colors'
                size={24}
              />
            </button>

            <div className='h-4' />

            <button
              onClick={() => router.push(`/payment/cuenta-bancaria?fixerId=${fixerIdFromUrl}`)}
              disabled={!fixerIdFromUrl}
              className='w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group disabled:opacity-50'
            >
              <div className='bg-cyan-100 p-3 rounded-xl group-hover:bg-cyan-200 transition-colors'>
                <Building2 className='text-cyan-600' size={28} />
              </div>
              <div className='flex-1 text-left'>
                <h4 className='font-bold text-gray-800 text-base'>Mi cuenta bancaria</h4>
                <p className='text-sm text-gray-500'>Administración de la cuenta bancaria</p>
              </div>
              <ChevronRight
                className='text-gray-400 group-hover:text-cyan-600 transition-colors'
                size={24}
              />
            </button>

            <div className='h-4' />

            <button
              onClick={() => router.push('/payment/facturas')}
              className='w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group'
            >
              <div className='bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors'>
                <FileText className='text-blue-600' size={28} />
              </div>
              <div className='flex-1 text-left'>
                <h4 className='font-bold text-gray-800 text-base'>Mis Facturas</h4>
                <p className='text-sm text-gray-500'>Ver registro de facturas</p>
              </div>
              <ChevronRight
                className='text-gray-400 group-hover:text-blue-600 transition-colors'
                size={24}
              />
            </button>
          </div>
        </div>

        {error && !fixerData?.isTestData && (
          <div className='pb-6'>
            <button
              onClick={() => fetchFixerData(fixerIdFromUrl || '')}
              className='w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors'
            >
              Reintentar carga
            </button>
          </div>
        )}
      </div>

      {showEarningsModal && fixerIdFromUrl && (
        <RecentEarningsModal onClose={() => setShowEarningsModal(false)} fixerId={fixerIdFromUrl} />
      )}
    </div>
  );
};

export default CentroDePagos;
