// src/Components/payment/InvoiceDetail.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface InvoiceDetailData {
  id: string;
  transactionId?: string; // Aseguramos que transactionId esté aquí
  requesterName: string;
  clientName?: string;
  clientAddress?: string;
  clientVAT?: string;
  service: string;
  date: string;
  totalAmount: number;
  taxRate?: number;
  taxAmount?: number;
  items: InvoiceItem[];
}

interface InvoiceDetailProps {
  invoice: InvoiceDetailData;
  onBack?: () => void;
  isDownloadForbidden?: boolean;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  invoice,
  onBack,
  isDownloadForbidden = false,
}) => {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Generar QR
  useEffect(() => {
    const generateQr = async () => {
      if (!invoice || !invoice.id) return;
      const qrValue = `Factura ID: ${invoice.id} | Cliente: ${invoice.requesterName} | Total: Bs. ${invoice.totalAmount ?? 0}`;
      const dataUrl = await QRCode.toDataURL(qrValue, { width: 120, margin: 1 });
      setQrDataUrl(dataUrl);
    };
    generateQr();
  }, [invoice]);

  if (!invoice) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-red-500 font-bold'>Factura no encontrada.</p>
      </div>
    );
  }

  const calculatedSubtotal = invoice.items.reduce((sum, item) => sum + (item.subtotal ?? 0), 0);

  const handleDownloadPDF = async () => {
    if (isDownloadForbidden) return;

    setDownloading(true);
    try {
      const doc = new jsPDF();
      let y = 15;
      const marginX = 15;

      // 1. ENCABEZADO Y TÍTULO
      doc.setFontSize(22);
      doc.setTextColor(63, 81, 181);
      doc.text('FACTURA COMERCIAL', marginX, y);
      y += 10;

      // 2. NÚMERO DE FACTURA Y FECHA (En dos columnas)
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);

      doc.text(`Factura No.`, marginX, y);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${invoice.id}`, marginX, y + 4);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha de Emisión:`, 150, y);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${invoice.date}`, 150, y + 4);

      y += 12;
      doc.line(marginX, y, 210 - marginX, y);
      y += 8;

      // 3. DATOS DEL CLIENTE
      doc.setFontSize(14);
      doc.setTextColor(63, 81, 181);
      doc.text('Datos del Cliente', marginX, y);
      y += 6;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      doc.setFont('helvetica', 'bold');
      doc.text(`Cliente: ${invoice.clientName || invoice.requesterName}`, marginX, y);
      y += 5;

      if (invoice.clientAddress) {
        doc.setFont('helvetica', 'normal');
        doc.text(`Dirección: ${invoice.clientAddress}`, marginX, y);
        y += 5;
      }

      if (invoice.clientVAT) {
        doc.setFont('helvetica', 'normal');
        doc.text(`RUC/VAT: ${invoice.clientVAT}`, marginX, y);
        y += 5;
      }

      doc.setFont('helvetica', 'normal');
      doc.text(`Concepto: ${invoice.service}`, marginX, y);
      y += 8;

      // 4. TABLA DE ÍTEMS
      doc.setFontSize(14);
      doc.setTextColor(63, 81, 181);
      doc.text('Detalle de Cargos', marginX, y);
      y += 5;

      // Encabezados de Columna (manual)
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Descripción', 18, y + 2);
      doc.text('Cant.', 110, y + 2);
      doc.text('P. Unit. (Bs.)', 135, y + 2);
      doc.text('Total (Bs.)', 170, y + 2);
      doc.line(15, y + 4, 210 - marginX, y + 4);
      y += 8;

      // Ítems
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      invoice.items.forEach((item) => {
        doc.text(item.description, 18, y);
        doc.text((item.quantity ?? 0).toString(), 110, y, { align: 'right' });
        doc.text((item.unitPrice ?? 0).toFixed(2), 135, y, { align: 'right' });
        doc.text((item.subtotal ?? 0).toFixed(2), 170, y, { align: 'right' });
        y += 6;
      });

      y += 5;
      doc.line(15, y, 210 - marginX, y);
      y += 5;

      // 5. TOTALES (Alineados a la derecha)
      const totalX = 175;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(`Subtotal:`, 140, y);
      doc.text(`${calculatedSubtotal.toFixed(2)}`, totalX, y, { align: 'right' });
      y += 5;

      doc.text(`Impuestos (${((invoice.taxRate ?? 0) * 100).toFixed(0)}%):`, 140, y);
      doc.text(`${(invoice.taxAmount ?? 0).toFixed(2)}`, totalX, y, { align: 'right' });
      y += 8;

      doc.setTextColor(63, 81, 181);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL:`, 140, y);
      doc.text(`Bs. ${(invoice.totalAmount ?? 0).toFixed(2)}`, totalX, y, { align: 'right' });

      // 6. QR Code (Si está disponible)
      if (qrDataUrl) {
        doc.addImage(qrDataUrl, 'PNG', 25, 250, 40, 40);
      }

      doc.save(`Factura_${invoice.id}.pdf`);
    } catch (err) {
      console.error('Error generando PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8 font-sans'>
      <div className='max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden'>
        {/* Header (Botón Volver, Título, Botón Descargar) */}
        <div className='p-6 bg-indigo-600 text-white flex justify-between items-center'>
          <button
            onClick={onBack || (() => router.back())}
            className='flex items-center text-sm font-semibold hover:text-indigo-200 transition-colors'
          >
            <ArrowLeft className='w-5 h-5 mr-1' />
            Volver
          </button>
          <h1 className='text-2xl font-extrabold'>Detalle de Factura</h1>

          {/* Botón de Descarga con Control de Prohibición */}
          <button
            onClick={handleDownloadPDF}
            disabled={downloading || isDownloadForbidden}
            className='flex items-center bg-white text-indigo-600 font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {downloading ? (
              <>
                <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                Generando...
              </>
            ) : isDownloadForbidden ? (
              'Descarga Única Realizada'
            ) : (
              <>
                <Download className='w-5 h-5 mr-2' />
                Descargar PDF
              </>
            )}
          </button>
        </div>

        {/* Contenido */}
        <div className='p-8 space-y-8'>
          {/* Advertencia de Prohibición */}
          {isDownloadForbidden && (
            <div
              className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl shadow-md'
              role='alert'
            >
              <p className='font-bold'>Acceso Restringido (Descarga Única)</p>
              <p>
                Esta factura ya fue descargada. Por motivos de seguridad y control, solo se permite
                una única descarga de los datos de la factura.
              </p>
            </div>
          )}

          {/* 🔑 1. Encabezado de Factura (Número y Fecha) - CORREGIDO */}
          <div className='flex justify-between items-start border-b pb-6 mb-6'>
            {/* Factura Número (Izquierda) */}
            <div>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-widest'>
                Factura Número
              </p>
              <p className='text-3xl font-black text-white bg-indigo-600 inline-block px-3 py-1 mt-1 rounded-lg'>
                {invoice.id}
              </p>
            </div>
            {/* Fecha de Emisión (Derecha) */}
            <div className='text-right'>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-widest'>
                Fecha de Emisión
              </p>
              <p className='text-xl font-bold text-gray-700 mt-1'>{invoice.date}</p>
            </div>
          </div>

          {/* 2. Datos Cliente y Servicio/Transacción - CORREGIDO */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 border-b pb-8'>
            {/* Columna 1: Información del Cliente */}
            <div className='space-y-1'>
              <h3 className='font-bold text-lg text-gray-800 mb-3 border-b-2 border-indigo-200 inline-block'>
                Cliente
              </h3>
              <p className='font-extrabold text-indigo-600 text-xl'>
                {invoice.clientName || invoice.requesterName}
              </p>

              {invoice.clientVAT && (
                <p className='text-sm text-gray-600'>**RUC/VAT:** {invoice.clientVAT}</p>
              )}
              {invoice.clientAddress && (
                <p className='text-sm text-gray-600'>**Dirección:** {invoice.clientAddress}</p>
              )}
            </div>

            {/* Columna 2: Información del Servicio/Factura */}
            <div className='space-y-1'>
              <h3 className='font-bold text-lg text-gray-800 mb-3 border-b-2 border-indigo-200 inline-block'>
                Detalles
              </h3>

              <p className='text-md text-gray-700'>
                <span className='font-semibold text-indigo-600'>Servicio Contratado:</span>{' '}
                {invoice.service}
              </p>
              {invoice.transactionId && (
                <p className='text-md text-gray-700'>
                  <span className='font-semibold text-indigo-600'>Transacción ID:</span>{' '}
                  {invoice.transactionId}
                </p>
              )}
            </div>
          </div>

          {/* Tabla de ítems */}
          <div>
            <h3 className='font-bold text-indigo-600 mb-4'>Detalle de Cargos</h3>
            <div className='overflow-x-auto rounded-xl shadow-lg'>
              <table className='min-w-full bg-white'>
                <thead className='bg-indigo-100 border-b border-indigo-200'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider'>
                      Descripción
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-indigo-600 uppercase tracking-wider'>
                      Cant.
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-indigo-600 uppercase tracking-wider'>
                      P. Unit. (Bs.)
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-indigo-600 uppercase tracking-wider'>
                      Total (Bs.)
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-indigo-200'>
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className='hover:bg-indigo-50 transition-colors'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {item.description}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500'>
                        {item.quantity ?? 0}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500'>
                        {(item.unitPrice ?? 0).toFixed(2)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-gray-900'>
                        {(item.subtotal ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales y QR centrados */}
          <div className='flex justify-center pt-4'>
            <div className='w-full sm:w-96 space-y-3 p-4 bg-indigo-50 rounded-xl shadow-inner flex flex-col items-center'>
              <div className='flex justify-between w-full'>
                <span className='text-indigo-600 font-semibold'>Subtotal:</span>
                <span className='font-medium'>{calculatedSubtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between w-full'>
                <span className='text-indigo-600 font-semibold'>
                  Impuestos ({((invoice.taxRate ?? 0) * 100).toFixed(0)}%)
                </span>
                <span className='font-medium'>{(invoice.taxAmount ?? 0).toFixed(2)}</span>
              </div>
              <div className='flex justify-between w-full border-t pt-3 border-indigo-200'>
                <span className='text-xl font-extrabold text-indigo-600'>TOTAL:</span>
                <span className='text-xl font-extrabold text-indigo-600'>
                  {(invoice.totalAmount ?? 0).toFixed(2)}
                </span>
              </div>

              {qrDataUrl && (
                <div className='mt-4 flex justify-center'>
                  <img src={qrDataUrl} alt='QR Factura' width={120} height={120} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
