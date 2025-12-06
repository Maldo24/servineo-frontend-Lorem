// src/app/payment/pages/FixerWallet/historial/HistoryPageClient.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// --- Interfaces (SIN CAMBIOS) ---
interface Transaction {
  _id: string;
  type: string; // 'deposit' o 'commission'
  amount: number;
  description: string;
  method?: string;
  createdAt: string;
  jobId?: string;
  status?: string; // Status es opcional aquí
}

interface FilterSettings {
  fromDate: string;
  toDate: string;
  type: string[];
}

export default function FixerWalletHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [receivedFixerId, setReceivedFixerId] = useState<string | null>(null);

  // --- Estados de Filtros (SIN CAMBIOS) ---
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    fromDate: '',
    toDate: '',
    type: [],
  });

  // --- Estados de Datos (SIN CAMBIOS) ---
  const [walletData, setWalletData] = useState<{ balance: number } | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Carga de Datos Reales (SIN CAMBIOS) ---
  useEffect(() => {
    const fixerId = searchParams.get('fixerId');
    if (fixerId) {
      setReceivedFixerId(fixerId);
      fetchHistoryData(fixerId);
    } else {
      setError('No se proporcionó un ID de Fixer.');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchHistoryData = async (fixerId: string) => {
    setLoading(true);
    setError(null);
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    try {
      const res = await fetch(`${BACKEND_URL}/api/fixer/payment-center/${fixerId}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al cargar los datos');
      }

      const result = await res.json();
      if (result.success && result.data) {
        setWalletData({ balance: result.data.saldoActual });
        setAllTransactions(result.data.transactions || []);
        setFilteredTransactions(result.data.transactions || []);
      } else {
        throw new Error(result.error || 'No se pudieron cargar los datos.');
      }
    } catch (err: unknown) {
      setError(err.message || 'Un error inesperado ocurrió.');
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Filtro (SIN CAMBIOS) ---
  useEffect(() => {
    let tempTxs = [...allTransactions];

    if (filterSettings.type.length > 0) {
      tempTxs = tempTxs.filter((tx) => filterSettings.type.includes(tx.type));
    }
    // Usamos 'T00:00:00' para 'fromDate' para que la comparación sea en la zona local
    if (filterSettings.fromDate) {
      try {
        const from = new Date(filterSettings.fromDate + 'T00:00:00');
        tempTxs = tempTxs.filter((tx) => new Date(tx.createdAt) >= from);
      } catch (e) {
        console.error("Fecha 'desde' inválida:", filterSettings.fromDate);
      }
    }
    // Usamos 'T23:59:59' para 'toDate' para incluir el día completo
    if (filterSettings.toDate) {
      try {
        const to = new Date(filterSettings.toDate + 'T23:59:59');
        tempTxs = tempTxs.filter((tx) => new Date(tx.createdAt) <= to);
      } catch (e) {
        console.error("Fecha 'hasta' inválida:", filterSettings.toDate);
      }
    }

    setFilteredTransactions(tempTxs);
  }, [filterSettings, allTransactions]);

  // --- Funciones de helper (SIN CAMBIOS) ---
  const handleApplyFilter = (newFilters: FilterSettings) => {
    setFilterSettings(newFilters);
    const active =
      newFilters.fromDate !== '' || newFilters.toDate !== '' || newFilters.type.length > 0;
    setIsFiltered(active);
    setShowFilterModal(false);
  };
  const clearFilter = () => {
    setFilterSettings({ fromDate: '', toDate: '', type: [] });
    setIsFiltered(false);
  };
  const formatCurrency = (value: number) => {
    return `Bs. ${Math.abs(value).toFixed(2)}`;
  };

  // --- (Estados de Carga y Error SIN CAMBIOS) ---
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <Loader2 className='animate-spin text-blue-600' size={48} />
      </div>
    );
  }
  if (error) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        {/* ... (Error UI) ... */}
        <div className='text-center bg-white p-8 rounded-lg shadow-md max-w-sm'>
          <AlertCircle className='text-red-500 mx-auto mb-4' size={48} />
          <h2 className='text-xl font-bold text-gray-800 mb-2'>Error al cargar el Historial</h2>
          <p className='text-gray-600 mb-6'>{error}</p>
          <button
            onClick={() => router.back()}
            className='mt-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition-colors'
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // --- PANTALLA PRINCIPAL (SIN CAMBIOS) ---
  return (
    <>
      <div className='min-h-screen bg-gray-100'>
        {/* Header */}
        <div className='bg-blue-600 text-white px-6 py-4 flex items-center gap-4'>
          <button onClick={() => router.back()}>
            <ArrowLeft size={24} />
          </button>
          <h1 className='text-2xl font-bold'>Historial de Movimientos</h1>
        </div>

        <div className='max-w-3xl mx-auto px-4'>
          {/* Balance Card */}
          <div className='p-6'>
            <div className='bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm mb-1'>Saldo Actual</p>
                <p className='text-blue-600 text-3xl font-bold'>
                  Bs. {walletData?.balance?.toFixed(2) || '0.00'}
                </p>
              </div>
              <Wallet size={32} className='text-blue-600 opacity-70' />
            </div>
          </div>

          {/* Todos los movimientos */}
          <div className='px-6 pb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-gray-700 font-semibold text-lg'>Todos los Movimientos</h2>

              {isFiltered ? (
                <button onClick={clearFilter} className='text-red-500 font-semibold text-sm'>
                  Eliminar Filtro
                </button>
              ) : (
                <button
                  onClick={() => setShowFilterModal(true)}
                  className='text-blue-600 font-semibold text-sm'
                >
                  Añadir Filtro
                </button>
              )}
            </div>

            {/* --- LISTA FILTRADA --- */}
            <div className='space-y-3'>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className='bg-white rounded-xl p-4 shadow-sm flex items-center gap-4'
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {tx.amount > 0 ? (
                        <TrendingUp className='text-green-600' size={20} />
                      ) : (
                        <TrendingDown className='text-red-600' size={20} />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-gray-900 truncate'>{tx.description}</p>
                      <p className='text-sm text-gray-500'>
                        {new Date(tx.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <p
                      className={`font-bold text-lg whitespace-nowrap ${
                        tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : ''}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className='bg-white rounded-xl p-4 shadow-sm text-center text-gray-500 py-10'>
                  <p>No se encontraron movimientos que coincidan con su filtro.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE FILTRO (Aquí están las correcciones) --- */}
      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilter}
          currentFilters={filterSettings}
        />
      )}
    </>
  );
}

// ===================================================================
// --- Componente del Modal de Filtro (CORREGIDO) ---
// ===================================================================
// Componente del Modal de Filtro - VALIDACION MIENTRAS ESCRIBE
interface FilterModalProps {
  onClose: () => void;
  onApply: (settings: FilterSettings) => void;
  currentFilters: FilterSettings;
}

function FilterModal({ onClose, onApply, currentFilters }: FilterModalProps) {
  // Convertir YYYY-MM-DD a MM/DD/YYYY para mostrar
  const formatToDisplay = (isoDate: string): string => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${month}/${day}/${year}`;
  };

  // Convertir MM/DD/YYYY a YYYY-MM-DD para guardar
  const formatToISO = (displayDate: string): string => {
    if (!displayDate || displayDate.length !== 10) return '';
    const parts = displayDate.split('/');
    if (parts.length !== 3) return '';
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const [fromDateDisplay, setFromDateDisplay] = useState(formatToDisplay(currentFilters.fromDate));
  const [toDateDisplay, setToDateDisplay] = useState(formatToDisplay(currentFilters.toDate));
  const [selectedTypes, setSelectedTypes] = useState<string[]>(currentFilters.type);
  const [dateError, setDateError] = useState<string | null>(null);

  const isValidDate = (month: number, day: number, year: number): boolean => {
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;

    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() + 1 === month && d.getDate() === day;
  };

  const validateDateString = (dateStr: string, fieldName: string): string | null => {
    if (!dateStr) return null;

    if (dateStr.length !== 10) {
      return `La fecha "${fieldName}" esta incompleta. Use formato MM/DD/YYYY`;
    }

    const parts = dateStr.split('/');
    if (parts.length !== 3) {
      return `La fecha "${fieldName}" tiene formato incorrecto`;
    }

    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return `La fecha "${fieldName}" contiene valores no numericos`;
    }

    if (!isValidDate(month, day, year)) {
      if (month === 2 && day > 29) {
        return `Fecha invalida: Febrero solo tiene hasta 29 dias`;
      } else if ([4, 6, 9, 11].includes(month) && day > 30) {
        return `Fecha invalida: Este mes solo tiene 30 dias`;
      } else if (day > 31) {
        return `Fecha invalida: Ningun mes tiene mas de 31 dias`;
      } else if (month < 1 || month > 12) {
        return `Fecha invalida: El mes debe estar entre 01 y 12`;
      }
      return `La fecha "${fieldName}" no existe en el calendario`;
    }

    return null;
  };

  const handleTextInput = (value: string, setter: (val: string) => void, fieldName: string) => {
    // Permitir solo numeros y /
    let cleaned = value.replace(/[^\d/]/g, '');

    // Auto-agregar / despues de MM y DD
    if (cleaned.length === 2 && !cleaned.includes('/')) {
      cleaned = cleaned + '/';
    } else if (cleaned.length === 5 && cleaned.split('/').length === 2) {
      cleaned = cleaned + '/';
    }

    // Limitar a 10 caracteres
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }

    setter(cleaned);

    // Validar si esta completo
    if (cleaned.length === 10) {
      const error = validateDateString(cleaned, fieldName);
      console.log(`Validando ${cleaned}: ${error || 'VALIDA'}`);
      setDateError(error);
    } else {
      setDateError(null);
    }
  };

  const handleDatePickerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    pickerSetter: (val: boolean) => void,
  ) => {
    const isoDate = e.target.value;
    if (isoDate) {
      const displayDate = formatToDisplay(isoDate);
      setter(displayDate);
      pickerSetter(false);
      setDateError(null);
    }
  };

  const handleSubmit = () => {
    const fromError = validateDateString(fromDateDisplay, 'Desde');
    if (fromError) {
      setDateError(fromError);
      return;
    }

    const toError = validateDateString(toDateDisplay, 'Hasta');
    if (toError) {
      setDateError(toError);
      return;
    }

    const fromISO = formatToISO(fromDateDisplay);
    const toISO = formatToISO(toDateDisplay);

    if (fromISO && toISO) {
      const fromDateObj = new Date(fromISO + 'T00:00:00');
      const toDateObj = new Date(toISO + 'T00:00:00');

      if (fromDateObj > toDateObj) {
        setDateError("La fecha 'Desde' no puede ser posterior a 'Hasta'");
        return;
      }
    }

    if (!fromDateDisplay && !toDateDisplay && selectedTypes.length === 0) {
      setDateError('Selecciona al menos un criterio de filtro');
      return;
    }

    setDateError(null);
    onApply({
      fromDate: fromISO,
      toDate: toISO,
      type: selectedTypes,
    });
  };

  const handleTypeChange = (value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  };

  const hasError = (dateDisplay: string): boolean => {
    return dateDisplay.length === 10 && validateDateString(dateDisplay, '') !== null;
  };

  return (
    <div className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4'>
      <div className='bg-white w-full max-w-md rounded-2xl shadow-xl relative overflow-hidden'>
        <div className='bg-blue-600 text-white px-6 py-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold'>Añadir Filtro</h2>
          <button onClick={onClose} className='text-white hover:text-gray-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
        </div>

        <div className='p-6'>
          <h2 className='text-xl font-bold text-center text-gray-800 mb-6'>
            Seleccione los campos para que se añada un filtro
          </h2>

          <div className='space-y-5'>
            {/* Campo Desde */}
            <div className='flex items-center gap-4'>
              <label className='w-16 font-semibold text-gray-700'>Desde</label>
              <div className='relative flex-1'>
                <input
                  type='text'
                  placeholder='MM/DD/YYYY'
                  value={fromDateDisplay}
                  onChange={(e) => handleTextInput(e.target.value, setFromDateDisplay, 'Desde')}
                  maxLength={10}
                  className={`w-full p-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    hasError(fromDateDisplay)
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <input
                  type='date'
                  onChange={(e) => {
                    if (e.target.value) {
                      const displayDate = formatToDisplay(e.target.value);
                      setFromDateDisplay(displayDate);
                      setDateError(null);
                    }
                  }}
                  className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 w-8 h-8 cursor-pointer'
                  title='Abrir calendario'
                />
                <Calendar
                  size={20}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    hasError(fromDateDisplay) ? 'text-red-400' : 'text-gray-400'
                  }`}
                />
              </div>
            </div>

            {/* Campo Hasta */}
            <div className='flex items-center gap-4'>
              <label className='w-16 font-semibold text-gray-700'>Hasta</label>
              <div className='relative flex-1'>
                <input
                  type='text'
                  placeholder='MM/DD/YYYY'
                  value={toDateDisplay}
                  onChange={(e) => handleTextInput(e.target.value, setToDateDisplay, 'Hasta')}
                  onFocus={() => setShowToPicker(false)}
                  maxLength={10}
                  className={`w-full p-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    hasError(toDateDisplay)
                      ? 'border-red-500 bg-red-50 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <input
                  type='date'
                  onChange={(e) => {
                    if (e.target.value) {
                      const displayDate = formatToDisplay(e.target.value);
                      setToDateDisplay(displayDate);
                      setDateError(null);
                    }
                  }}
                  className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 w-8 h-8 cursor-pointer'
                  title='Abrir calendario'
                />
                <Calendar
                  size={20}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    hasError(toDateDisplay) ? 'text-red-400' : 'text-gray-400'
                  }`}
                />
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <label className='w-16 font-semibold text-gray-700 pt-2'>Incluir</label>
              <div className='flex-1 flex flex-col gap-2 pt-2'>
                <label className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded'>
                  <input
                    type='checkbox'
                    value='deposit'
                    checked={selectedTypes.includes('deposit')}
                    onChange={() => handleTypeChange('deposit')}
                    className='w-5 h-5 accent-blue-600'
                  />
                  <span className='font-medium text-gray-700'>Recargas</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded'>
                  <input
                    type='checkbox'
                    value='commission'
                    checked={selectedTypes.includes('commission')}
                    onChange={() => handleTypeChange('commission')}
                    className='w-5 h-5 accent-blue-600'
                  />
                  <span className='font-medium text-gray-700'>Comisiones</span>
                </label>
              </div>
            </div>

            {dateError && (
              <div className='bg-red-50 border-2 border-red-400 rounded-lg p-4 flex gap-3'>
                <AlertCircle className='text-red-600 flex-shrink-0' size={24} />
                <div>
                  <p className='text-red-800 font-bold text-sm'>¡Error!</p>
                  <p className='text-red-700 text-sm'>{dateError}</p>
                </div>
              </div>
            )}

            <div className='flex gap-4 pt-4'>
              <button
                onClick={handleSubmit}
                disabled={!!dateError}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white ${
                  dateError ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Añadir Filtro
              </button>
              <button
                onClick={onClose}
                className='flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200'
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
