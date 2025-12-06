// src/Components/payment/InvoiceList.tsx
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight,
  Search,
  Loader2,
  ArrowLeft,
  ArrowDownUp,
  Calendar,
  FileText,
  Users,
} from 'lucide-react';

// === FUNCIÓN DE UTILIDAD: Obtiene el ID del usuario desde localStorage ===
const getRequesterId = () => {
  // Es vital chequear window !== 'undefined' para Next.js (lado del cliente)
  const userJson = typeof window !== 'undefined' ? localStorage.getItem('servineo_user') : null;

  if (userJson) {
    try {
      const userData = JSON.parse(userJson);
      return userData.id; // Retorna el ID
    } catch (e) {
      console.error('Error al parsear datos de usuario:', e);
      return null;
    }
  }
  return null;
};
// =======================================================================

export interface BackendInvoice {
  id: string;
  transactionId: string;
  requesterName: string;
  date: string;
  total: number;
  currency: string;
  status: string;
  requesterId: string;
}

export interface Invoice {
  _id: string;
  requesterId: string;
  'Company Name': string;
  'Tax ID': string;
  'Requester Name': string;
  'Job Type': string;
  'Transaction ID': string;
  Date: string;
  'Payment Method': string;
  Status: string;
  Subtotal: number;
  Commission: number;
  IVA: number;
  Total: number;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const fetchInvoices = async (): Promise<Invoice[]> => {
  // === MODIFICACIÓN CLAVE: Obtener el ID y agregarlo a la URL ===
  const requesterId = getRequesterId();
  if (!requesterId) {
    console.warn('Usuario no autenticado. No se puede cargar facturas.');
    // Devolvemos vacío si no hay ID, previniendo la llamada al backend
    return [];
  }

  try {
    // La URL ahora incluye el ID como Query Parameter (requesterId=...)
    const urlWithId = `${API_URL}/api/v1/invoices?requesterId=${requesterId}`;
    const response = await fetch(urlWithId);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}. Response: ${errorBody}`);
    }
    const { data: backendData } = await response.json();

    return (backendData as BackendInvoice[]).map((item) => ({
      _id: item.id,
      'Transaction ID': item.transactionId,
      'Company Name': item.requesterName || 'N/A',
      Date: item.date,
      Total: item.total,
      Status: item.status,
      requesterId: item.requesterId || item.id,
      'Tax ID': 'N/A',
      'Requester Name': item.requesterName || 'N/A',
      'Job Type': 'Pago General',
      'Payment Method': 'Desconocido',
      Subtotal: item.total || 0,
      Commission: 0,
      IVA: 0,
    }));
  } catch (error) {
    console.error('Error al obtener facturas desde el backend:', error);
    return [];
  }
};

const InvoiceList = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date(0) : date;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchInvoices();
      const sorted = [...data].sort(
        (a, b) => parseDate(b.Date).getTime() - parseDate(a.Date).getTime(),
      );
      setInvoices(sorted);
      setLoading(false);
    };
    loadData();
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  }, []);

  const formatDate = (isoDate: string) => {
    const date = parseDate(isoDate);
    if (date.getTime() === 0) return 'Fecha Inválida';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const searchedInvoices = invoices.filter((invoice) => {
    const query = searchQuery.toLowerCase();
    return (
      (invoice['Company Name'] || '').toLowerCase().includes(query) ||
      (invoice['Job Type'] || '').toLowerCase().includes(query) ||
      (invoice['Transaction ID'] || '').includes(query)
    );
  });

  const finalFilteredInvoices = [...searchedInvoices].sort((a, b) => {
    const dateA = parseDate(a.Date).getTime();
    const dateB = parseDate(b.Date).getTime();
    return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const handleInvoiceClick = (invoiceId: string) => router.push(`/detalleFactura/${invoiceId}`);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center font-sans'>
        <Loader2 className='animate-spin text-indigo-600 mx-auto' size={48} />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 font-sans pt-16 sm:pt-20 pb-8 px-4 sm:px-6'>
      <div className='max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8'>
        <div className='flex justify-between items-center mb-6 border-b pb-4'>
          <h1 className='text-3xl font-extrabold text-gray-800 truncate'>Facturación Reciente</h1>
          <button
            onClick={() => router.back()}
            className='flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105'
            title='Volver a la página anterior'
          >
            <ArrowLeft className='w-5 h-5 mr-1' />
            Volver
          </button>
        </div>

        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0'>
            <div className='relative flex-grow'>
              <input
                type='text'
                placeholder='Buscar cliente, servicio o ID...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-inner text-sm'
              />
              <Search
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
              />
            </div>

            <button
              onClick={toggleSortDirection}
              className={`flex items-center justify-center font-bold text-sm px-4 rounded-xl transition-all duration-300 flex-shrink-0 shadow-md ${
                sortDirection === 'desc'
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  : 'bg-white border border-indigo-500 text-indigo-600 hover:bg-indigo-50'
              }`}
              title={`Ordenar por fecha: ${
                sortDirection === 'desc' ? 'Más recientes primero' : 'Más antiguas primero'
              }`}
            >
              <ArrowDownUp
                className={`w-4 h-4 mr-2 transition-transform ${
                  sortDirection === 'desc' ? 'rotate-180' : 'rotate-0'
                }`}
              />
              Fecha
            </button>
          </div>
        </div>

        <div className='space-y-4'>
          {finalFilteredInvoices.length > 0 ? (
            finalFilteredInvoices.map((invoice) => (
              <button
                key={invoice._id}
                onClick={() => handleInvoiceClick(invoice._id)}
                className='w-full text-left bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300'
              >
                <div className='flex flex-col md:flex-row md:items-start gap-4 md:gap-6'>
                  <div className='flex-1 min-w-0 p-4 border-b md:border-b-0 md:border-r border-dashed border-gray-200'>
                    <div className='flex items-center mb-1'>
                      <Users className='w-5 h-5 text-indigo-500 mr-2' />
                      <h4 className='font-bold text-lg text-gray-800 truncate'>
                        {invoice['Company Name']}
                      </h4>
                    </div>
                    <p className='text-sm text-gray-600 mb-2 ml-7 leading-tight break-words'>
                      {invoice['Job Type']}
                    </p>
                    <div className='flex items-center text-xs text-gray-700 mt-2 gap-4 ml-7'>
                      <span className='flex items-center'>
                        <Calendar className='w-3 h-3 mr-1 text-gray-500' />
                        {formatDate(invoice.Date)}
                      </span>
                      <span className='flex items-center'>
                        <FileText className='w-3 h-3 mr-1 text-gray-500' />
                        ID: {invoice['Transaction ID']}
                      </span>
                    </div>
                  </div>

                  <div className='flex justify-between md:flex-col md:items-end gap-2 md:gap-4 p-4 w-full md:w-auto'>
                    <div className='text-right flex flex-col items-center md:items-end'>
                      <div className='flex items-center bg-emerald-100 text-emerald-700 font-extrabold py-2 px-4 rounded-full shadow-inner transform scale-95'>
                        <span className='text-xl'>
                          {(invoice.Total ?? 0).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <span className='text-xs text-emerald-600 font-semibold mt-1'>Bs.</span>
                    </div>
                    <ChevronRight className='text-indigo-400 w-6 h-6 md:mt-2' />
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className='text-center text-gray-500 py-10'>
              No se encontraron facturas con esa búsqueda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
