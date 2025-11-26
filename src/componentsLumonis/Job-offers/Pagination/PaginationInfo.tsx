'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

interface PaginationInfoProps {
  paginaActual: number;
  registrosPorPagina: number;
  totalRegistros: number;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  paginaActual,
  registrosPorPagina,
  totalRegistros,
}) => {
  const t = useTranslations('pagination');

  if (totalRegistros === 0) {
    return (
      <div className="text-sm text-gray-600 mt-3">
        {t('showingResults', { start: 0, end: 0, total: 0 })}
      </div>
    );
  }

  const inicioRegistro = (paginaActual - 1) * registrosPorPagina + 1;
  const finRegistro = Math.min(paginaActual * registrosPorPagina, totalRegistros);

  return (
    <div className="text-sm text-gray-600 mt-3">
      {t('showingResults', { start: inicioRegistro, end: finRegistro, total: totalRegistros })}
    </div>
  );
};

export default PaginationInfo;
