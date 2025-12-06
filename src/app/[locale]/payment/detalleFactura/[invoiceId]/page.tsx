'use client';

import React, { useEffect, useState } from 'react';
import InvoiceDetail, { InvoiceDetailData } from '../../../../../Components/payment/InvoiceDetail';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Función auxiliar para obtener el ID del usuario
const getRequesterId = () => {
  const userJson = typeof window !== 'undefined' ? localStorage.getItem('servineo_user') : null;
  if (userJson) {
    try {
      const userData = JSON.parse(userJson);
      return userData.id;
    } catch (e) {
      console.error('Error al parsear datos de usuario:', e);
      return null;
    }
  }
  return null;
};

const InvoiceDetailPage: React.FC = () => {
  const params = useParams();
  const invoiceId = params?.invoiceId as string;
  const [invoiceData, setInvoiceData] = useState<InvoiceDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. NUEVO ESTADO: Controla si la descarga está prohibida por el Backend
  const [isDownloadForbidden, setIsDownloadForbidden] = useState(false);

  useEffect(() => {
    if (!invoiceId) return;

    const requesterId = getRequesterId();

    if (!requesterId) {
      console.error('No se encontró el ID del usuario. Acceso denegado.');
      setLoading(false);
      return;
    }

    const fetchInvoice = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/v1/invoices/${invoiceId}?requesterId=${requesterId}`,
        );

        // 🔑 2. MANEJO DE RESPUESTA 403 (PROHIBIDO) DESDE EL BACKEND
        if (res.status === 403) {
          console.warn('Descarga Única: Acceso a datos denegado por el servidor.');
          setIsDownloadForbidden(true); // Se establece el estado de prohibición
          setLoading(false);
          // Salimos de la función sin intentar parsear JSON ni establecer invoiceData
          return;
        }

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const { data } = await res.json();
        setInvoiceData(data);
      } catch (err) {
        console.error('Error de red al consultar backend:', err);
        setInvoiceData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <main className='min-h-screen flex justify-center items-center'>
        <p className='text-gray-500'>Cargando factura...</p>
      </main>
    );
  }

  // Si la descarga está prohibida, seguimos y renderizamos InvoiceDetail para mostrar la advertencia
  // Si no hay datos Y NO está prohibida, mostramos 404/Error.
  if (!invoiceData && !isDownloadForbidden) {
    return (
      <main className='min-h-screen flex flex-col justify-center items-center text-center bg-gray-50 p-4 sm:p-8'>
        <h1 className='text-5xl font-bold text-red-600 mb-4'>404</h1>
        <p className='text-xl font-semibold text-gray-800'>
          Factura no encontrada o Acceso Denegado
        </p>
        <p className='mt-2 text-gray-600'>ID: {invoiceId}</p>
        <button
          onClick={() => window.history.back()}
          className='mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition'
        >
          Volver
        </button>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50 p-4 sm:p-8'>
      <InvoiceDetail
        // 🔑 3. PASAR EL ESTADO AL COMPONENTE HIJO
        invoice={invoiceData!} // Usamos ! porque si isDownloadForbidden es true, no hay datos de factura
        isDownloadForbidden={isDownloadForbidden}
      />
    </main>
  );
};

export default InvoiceDetailPage;
