'use client';
// app/payment/Pagos-Fisico/page.tsx
// Página principal de gestión de trabajos y pagos

import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Trabajo } from '../../../../utils/types';
import { getFixerId, fetchAllFixerJobs } from '../../../../utils/paymentapi';
import PaymentMethodCashFixer from '../../../../Components/payment/PaymentMethodCashFixer';

export default function TrabajosYPagos() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrabajo, setSelectedTrabajo] = useState<Trabajo | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [fixerId, setFixerId] = useState('');

  // Obtener Fixer ID al montar
  useEffect(() => {
    const id = getFixerId();
    setFixerId(id);
  }, []);

  // Cargar trabajos cuando tenemos el fixerId
  useEffect(() => {
    if (fixerId) {
      fetchTrabajos();
    }
  }, [fixerId]);

  // Función para cargar trabajos
  const fetchTrabajos = async () => {
    if (!fixerId || fixerId.trim() === '') {
      console.error('❌ No hay fixerId disponible');
      setError('No se pudo obtener el Fixer ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    console.log('📋 Cargando trabajos para fixerId:', fixerId);

    try {
      const trabajosData = await fetchAllFixerJobs(fixerId);

      console.log('🎯 Trabajos cargados:', trabajosData);
      setTrabajos(trabajosData);

      if (trabajosData.length === 0) {
        setError('No se encontraron trabajos para este fixer.');
      }
    } catch (err: unknown) {
      console.error('❌ Error completo:', err);
      const errorMessage = err.message || 'Error al cargar trabajos';
      setError(errorMessage);

      // Trabajos de ejemplo en caso de error
      setTrabajos([
        {
          jobId: 'ERR-001',
          titulo: 'Pago Ejemplo 1',
          descripcion: 'Error al cargar, mostrando ejemplo',
          totalPagar: 100.0,
          paymentStatus: 'pending',
          fecha: '2025-11-10',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de pago
  const handleOpenPayment = (trabajo: Trabajo) => {
    console.log('💳 Abriendo modal para:', trabajo);
    setSelectedTrabajo(trabajo);
    setShowPaymentModal(true);
  };

  // Cerrar modal de pago
  const handleClosePayment = (completed?: boolean) => {
    console.log('🔒 Cerrando modal. Completado:', completed);
    setShowPaymentModal(false);
    setSelectedTrabajo(null);
    if (completed) fetchTrabajos();
  };

  // Calcular estadísticas
  const totalTrabajos = trabajos.length;
  const trabajosPagados = trabajos.filter((t) => t.paymentStatus === 'paid').length;
  const trabajosPendientes = trabajos.filter((t) => t.paymentStatus === 'pending').length;

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='animate-spin text-blue-600 mx-auto mb-4' size={48} />
          <p className='text-gray-600'>Cargando trabajos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <div className='bg-blue-600 text-white px-6 py-4 shadow-md'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-2xl font-bold'>Gestión de Trabajos y Pagos</h1>
          <p className='text-blue-200 text-sm mt-1'>Fixer ID: {fixerId}</p>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-4 py-6'>
        {/* Alert de error */}
        {error && (
          <div className='mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded'>
            <p className='text-yellow-800'>{error}</p>
          </div>
        )}

        {/* Cards de estadísticas */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          {/* Total */}
          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-100 p-3 rounded-lg'>
                <Briefcase className='text-blue-600' size={24} />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total</p>
                <p className='text-2xl font-bold'>{totalTrabajos}</p>
              </div>
            </div>
          </div>

          {/* Pagados */}
          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-green-100 p-3 rounded-lg'>
                <CheckCircle className='text-green-600' size={24} />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Pagados</p>
                <p className='text-2xl font-bold'>{trabajosPagados}</p>
              </div>
            </div>
          </div>

          {/* Pendientes */}
          <div className='bg-white rounded-lg shadow p-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-yellow-100 p-3 rounded-lg'>
                <Clock className='text-yellow-600' size={24} />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Pendientes</p>
                <p className='text-2xl font-bold'>{trabajosPendientes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de trabajos */}
        <div className='bg-white rounded-lg shadow'>
          <div className='px-6 py-4 border-b'>
            <h2 className='text-xl font-semibold'>Lista de Trabajos</h2>
          </div>

          <div className='divide-y'>
            {trabajos.length === 0 ? (
              <div className='px-6 py-12 text-center text-gray-500'>
                <AlertCircle className='mx-auto mb-3' size={48} />
                <p>No hay trabajos registrados</p>
              </div>
            ) : (
              trabajos.map((trabajo) => (
                <div key={trabajo.jobId} className='px-6 py-5 hover:bg-gray-50 transition-colors'>
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                    {/* Información del trabajo */}
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-lg font-semibold'>{trabajo.titulo}</h3>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            trabajo.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : trabajo.paymentStatus === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {trabajo.paymentStatus === 'paid' ? (
                            <>
                              <CheckCircle size={16} />
                              Pagado
                            </>
                          ) : trabajo.paymentStatus === 'failed' ? (
                            <>
                              <AlertCircle size={16} />
                              Error
                            </>
                          ) : (
                            <>
                              <Clock size={16} />
                              Pendiente
                            </>
                          )}
                        </span>
                      </div>

                      <p className='text-sm text-gray-600 mb-2'>{trabajo.descripcion}</p>

                      <div className='flex items-center gap-2 text-sm text-gray-500'>
                        <span className='font-mono bg-gray-100 px-2 py-1 rounded'>
                          {trabajo.jobId}
                        </span>
                        <span>•</span>
                        <span>{trabajo.fecha}</span>
                      </div>
                    </div>

                    {/* Monto y acciones */}
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                      <div className='flex items-center gap-2'>
                        <DollarSign className='text-gray-400' size={20} />
                        <span className='text-2xl font-bold'>
                          Bs. {trabajo.totalPagar.toFixed(2)}
                        </span>
                      </div>

                      {trabajo.paymentStatus === 'pending' ? (
                        <button
                          onClick={() => handleOpenPayment(trabajo)}
                          className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all'
                        >
                          💰 Confirmar Pago
                        </button>
                      ) : trabajo.paymentStatus === 'paid' ? (
                        <button
                          disabled
                          className='px-6 py-2.5 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed'
                        >
                          ✓ Pagado
                        </button>
                      ) : (
                        <button
                          disabled
                          className='px-6 py-2.5 bg-red-200 text-red-500 font-semibold rounded-lg cursor-not-allowed'
                        >
                          ✕ Error
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de pago */}
      {showPaymentModal && selectedTrabajo && (
        <PaymentMethodCashFixer
          trabajo={selectedTrabajo}
          onClose={handleClosePayment}
          onBack={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
