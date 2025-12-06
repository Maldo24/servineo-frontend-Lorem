//src/Components/payment/RecentEarningsModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Filter, Loader2, AlertCircle } from 'lucide-react';
import EarningsFilterModal from './EarningsFilterModal';

type Props = {
  onClose: () => void;
  fixerId?: string;
};

export default function RecentEarningsModal({ onClose, fixerId: propFixerId }: Props) {
  const [fixerId, setFixerId] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<{ label: string; value: number }[]>([]);
  const [currentTotal, setCurrentTotal] = useState(0);

  useEffect(() => {
    console.log('🔍 Intentando obtener fixerId...');

    if (propFixerId) {
      console.log('✅ fixerId obtenido de props:', propFixerId);
      setFixerId(propFixerId);
      return;
    }

    if (typeof window !== 'undefined') {
      try {
        const reduxState = (window as unknown).__REDUX_DEVTOOLS_EXTENSION__?.store?.getState?.();
        if (reduxState?.fixer?.id || reduxState?.fixer?._id) {
          const id = reduxState.fixer.id || reduxState.fixer._id;
          console.log('✅ fixerId obtenido de Redux:', id);
          setFixerId(id);
          return;
        }

        if (reduxState?.user?.id || reduxState?.user?._id) {
          const id = reduxState.user.id || reduxState.user._id;
          console.log('✅ fixerId obtenido de Redux user:', id);
          setFixerId(id);
          return;
        }

        const possibleKeys = ['user', 'fixer', 'auth', 'userData'];
        for (const key of possibleKeys) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const data = JSON.parse(stored);
              const id = data.id || data._id || data.fixerId || data.userId;
              if (id) {
                console.log(`✅ fixerId obtenido de localStorage.${key}:`, id);
                setFixerId(id);
                return;
              }
            } catch (e) {
              // Continuar
            }
          }
        }

        console.error('❌ No se encontró fixerId en ningún lugar');
        setError('No se pudo obtener tu ID de usuario');
        setLoading(false);
      } catch (error) {
        console.error('❌ Error al obtener fixerId:', error);
        setError('Error al obtener información de usuario');
        setLoading(false);
      }
    }
  }, [propFixerId]);

  const getDefaultDates = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 6);

    return {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0],
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDates());

  const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    return `${day} ${month}`;
  };

  const fetchEarnings = async (from: string, to: string) => {
    setLoading(true);
    setError(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    try {
      const url = `${BACKEND_URL}/api/lab/earnings/${fixerId}?fromDate=${from}&toDate=${to}`;
      console.log('📊 Cargando ganancias desde:', url);

      const res = await fetch(url);

      if (!res.ok) {
        let errorMessage = 'Error al cargar ganancias';
        try {
          const errData = await res.json();
          errorMessage = errData.error || errData.message || errorMessage;
        } catch (parseError) {
          // Ignorar
        }
        throw new Error(errorMessage);
      }

      const result = await res.json();
      console.log('📦 Datos recibidos:', result);

      if (result.success && result.data) {
        const transformedData = result.data.earningsByDay.map((item: unknown) => ({
          label: formatDateLabel(item.date),
          value: item.total,
        }));

        console.log('✅ Datos transformados:', transformedData);

        setCurrentData(transformedData);
        setCurrentTotal(result.data.totalEarnings);
      } else {
        throw new Error('Estructura de datos incorrecta del servidor');
      }
    } catch (err: unknown) {
      console.error('❌ Error:', err);
      setError(err.message || 'Error inesperado al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fixerId) {
      fetchEarnings(dateRange.from, dateRange.to);
    }
  }, [fixerId]);

  if (!fixerId) {
    return (
      <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
        <div className='bg-white rounded-2xl shadow-2xl w-[90%] max-w-3xl p-8'>
          <div className='text-center'>
            <AlertCircle className='text-red-500 mx-auto mb-4' size={48} />
            <h3 className='text-xl font-bold text-gray-800 mb-2'>Sesión no encontrada</h3>
            <p className='text-gray-600 mb-4'>
              No pudimos obtener tu información de usuario. Por favor, inicia sesión nuevamente.
            </p>
            <button
              onClick={onClose}
              className='px-6 py-2 bg-[#2c6ef7] hover:bg-[#1f5ad6] text-white font-semibold rounded-lg transition-colors'
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleApplyFilter = async (from: string, to: string) => {
    setDateRange({ from, to });
    await fetchEarnings(from, to);
    setShowFilterModal(false);
  };

  const limitedData = currentData.slice(0, 7);
  const maxVal = Math.max(...limitedData.map((d) => d.value), 1);

  const calculateYAxis = (max: number) => {
    let step: number;

    if (max <= 10) {
      step = 2;
    } else if (max <= 25) {
      step = 5;
    } else if (max <= 50) {
      step = 10;
    } else if (max <= 100) {
      step = 20;
    } else if (max <= 250) {
      step = 50;
    } else if (max <= 500) {
      step = 100;
    } else if (max <= 1000) {
      step = 200;
    } else {
      step = 500;
    }

    const maxTick = Math.ceil(max / step) * step;

    const ticks = [];
    for (let i = 0; i <= maxTick; i += step) {
      ticks.push(i);
    }

    console.log('📐 Eje Y:', { max, step, maxTick, ticks });

    return { step, maxTick, ticks };
  };

  const { maxTick, ticks: yTicks } = calculateYAxis(maxVal);
  const isEmpty = !limitedData.length || limitedData.every((d) => d.value === 0);

  if (loading) {
    return (
      <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
        <div className='bg-white rounded-2xl shadow-2xl w-[90%] max-w-3xl p-12'>
          <div className='flex flex-col items-center justify-center'>
            <Loader2 className='animate-spin text-[#2c6ef7] mb-4' size={48} />
            <p className='text-lg text-gray-600'>Cargando tus ganancias...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
        <div className='bg-white rounded-2xl shadow-2xl w-[90%] max-w-3xl p-8'>
          <div className='text-center'>
            <AlertCircle className='text-red-500 mx-auto mb-4' size={48} />
            <h3 className='text-xl font-bold text-gray-800 mb-2'>Error al cargar ganancias</h3>
            <p className='text-gray-600 mb-4'>{error}</p>
            <div className='flex gap-3 justify-center'>
              <button
                onClick={() => fetchEarnings(dateRange.from, dateRange.to)}
                className='px-6 py-2 bg-[#2c6ef7] hover:bg-[#1f5ad6] text-white font-semibold rounded-lg transition-colors'
              >
                Reintentar
              </button>
              <button
                onClick={onClose}
                className='px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors'
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
        <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-3xl p-6 relative font-['Roboto']">
          <div className='flex justify-between items-start mb-4'>
            <h2 className='text-2xl sm:text-3xl font-semibold text-gray-700'>
              Tus Ingresos Recientes
            </h2>

            <div className='flex items-center gap-3'>
              <div className='bg-[#2c6ef7] text-white px-4 py-2 rounded-md text-lg font-semibold'>
                Ganancias: {currentTotal}
              </div>

              <button
                onClick={() => setShowFilterModal(true)}
                className='flex items-center gap-2 px-5 py-2 bg-[#2c6ef7] hover:bg-[#1f5ad6] text-white font-semibold rounded-md shadow-sm transition-colors'
              >
                <Filter size={18} />
                Filtros
              </button>
            </div>
          </div>

          {isEmpty ? (
            <div className='bg-[#f3f5fb] border border-[#d6dcf2] rounded-xl p-10 text-center shadow-inner'>
              <p className='text-xl sm:text-2xl font-semibold text-[#2c6ef7] mb-10'>
                Aun no tienes transacciones completadas en este período
              </p>
              <div className='flex justify-center gap-3'>
                <button
                  onClick={() => setShowFilterModal(true)}
                  className='px-8 py-3 bg-[#2c6ef7] hover:bg-[#1f5ad6] text-white font-semibold rounded-lg shadow-sm transition-colors'
                >
                  Cambiar Fechas
                </button>
                <button
                  onClick={onClose}
                  className='px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm transition-colors'
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <div className='relative bg-white border border-gray-200 rounded-lg p-6'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-sm font-semibold text-gray-700'>
                Ganancias (Bs)
              </div>
              <div className='ml-12'>
                <div className='relative' style={{ height: '352px' }}>
                  {/* Contenedor del gráfico */}
                  <div
                    className='absolute left-0 right-0'
                    style={{ top: 0, bottom: '32px', transform: 'translateY(-15px)' }}
                  >
                    {/* Líneas del eje Y */}
                    {yTicks.map((tick) => {
                      const bottomPct = (tick / maxTick) * 100;
                      return (
                        <div
                          key={tick}
                          className='absolute left-0 right-0 flex items-center'
                          style={{ bottom: `${bottomPct}%` }}
                        >
                          <span className='text-sm font-medium text-gray-600 w-12 -ml-14 text-right'>
                            {tick}
                          </span>
                          <div className='flex-1 border-t border-gray-300' />
                        </div>
                      );
                    })}

                    {/* Barras */}
                    <div
                      className='absolute inset-0 flex items-end justify-around gap-4'
                      style={{ transform: 'translateY(-10px)' }}
                    >
                      {limitedData.map((item, index) => {
                        const heightPx = (item.value / maxTick) * 100;
                        console.log(
                          `📊 ${item.label}: ${item.value}Bs / ${maxTick} = ${heightPx.toFixed(1)}%`,
                        );

                        return (
                          <div
                            key={index}
                            className='flex items-end group relative'
                            style={{ width: '80px', height: '100%' }}
                          >
                            <div className='absolute bottom-full mb-3 hidden group-hover:block bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap z-10 shadow-lg'>
                              <p className='font-bold text-base'>Bs. {item.value.toFixed(2)}</p>
                              <p className='text-xs opacity-80'>{item.label}</p>
                            </div>

                            <div
                              className='w-full bg-gradient-to-t from-[#2c6ef7] to-[#4d8aff] rounded-t-lg transition-all hover:from-[#1f5ad6] hover:to-[#3d7aef] shadow-md hover:shadow-lg cursor-pointer'
                              style={{
                                height: `${heightPx}%`,
                                minHeight: heightPx > 0 ? '3px' : '0',
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Etiquetas de fechas */}
                  <div
                    className='absolute left-0 right-0 flex justify-around gap-4'
                    style={{ bottom: '-8px', height: '32px', paddingTop: '8px' }}
                  >
                    {limitedData.map((item, index) => (
                      <div
                        key={`label-${index}`}
                        style={{ width: '80px' }}
                        className='flex justify-center'
                      >
                        <span className='text-sm font-bold text-gray-800'>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='flex justify-center mt-6'>
            <button
              onClick={onClose}
              className='px-8 py-3 bg-[#2c6ef7] hover:bg-[#1f5ad6] text-white font-semibold rounded-lg shadow-sm transition-colors'
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>

      {showFilterModal && (
        <EarningsFilterModal
          currentFrom={dateRange.from}
          currentTo={dateRange.to}
          onApply={handleApplyFilter}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </>
  );
}
