'use client';
import React from 'react';

interface FixerStat {
  id: string;
  name: string;
  total: number;
  active: number;
  cancelled: number;
  rescheduled: number;
  rate: string;
}

const FixerStatsTable = ({ stats }: { stats: FixerStat[] }) => {
  return (
    <div className='bg-white rounded-xl shadow border border-gray-200 overflow-hidden'>
      <div className='p-4 border-b border-gray-200'>
        <h3 className='font-bold text-gray-800'>Rendimiento por Fixer</h3>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th className='px-6 py-3'>Fixer</th>
              <th className='px-6 py-3 text-center'>Total</th>
              <th className='px-6 py-3 text-center text-green-600'>Activas</th>
              <th className='px-6 py-3 text-center text-red-600'>Canceladas</th>
              <th className='px-6 py-3 text-center text-orange-500'>Reprogramadas</th>
              <th className='px-6 py-3 text-center'>Tasa Cancelación</th>
            </tr>
          </thead>
          <tbody>
            {stats.length > 0 ? (
              stats.map((fixer) => (
                <tr key={fixer.id} className='bg-white border-b hover:bg-gray-50'>
                  <td className='px-6 py-4 font-medium text-gray-900'>{fixer.name}</td>
                  <td className='px-6 py-4 text-center'>{fixer.total}</td>
                  <td className='px-6 py-4 text-center'>{fixer.active}</td>
                  <td className='px-6 py-4 text-center'>{fixer.cancelled}</td>
                  <td className='px-6 py-4 text-center'>{fixer.rescheduled}</td>
                  <td className='px-6 py-4 text-center font-bold'>{fixer.rate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='px-6 py-4 text-center'>
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FixerStatsTable;
