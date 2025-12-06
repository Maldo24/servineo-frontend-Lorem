'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacionProps {
  paginaActual: number;
  totalRegistros: number;
  registrosPorPagina: number;
  onChange: (numero: number) => void;
}

const Paginacion: React.FC<PaginacionProps> = ({
  paginaActual,
  totalRegistros,
  registrosPorPagina,
  onChange,
}) => {
  const t = useTranslations('pagination');
  const [mounted, setMounted] = useState(false);
  const [delta, setDelta] = useState(2);
  const [maxSinEllipsis, setMaxSinEllipsis] = useState(10);

  useEffect(() => {
    setMounted(true);

    const calculateDelta = () => {
      const width = window.innerWidth;

      // Ajustar delta y máximo sin ellipsis según el ancho de pantalla
      if (width < 480) {
        setDelta(1); // Móvil muy pequeño
        setMaxSinEllipsis(5); // Mostrar max 5 páginas sin ellipsis
      } else if (width < 640) {
        setDelta(2); // Móvil
        setMaxSinEllipsis(7); // Mostrar max 7 páginas sin ellipsis
      } else if (width < 768) {
        setDelta(3); // Móvil grande / Tablet pequeña
        setMaxSinEllipsis(9);
      } else if (width < 1024) {
        setDelta(4); // Tablet
        setMaxSinEllipsis(11);
      } else if (width < 1280) {
        setDelta(5); // Desktop pequeño
        setMaxSinEllipsis(13);
      } else {
        setDelta(6); // Desktop grande
        setMaxSinEllipsis(15);
      }
    };

    calculateDelta();
    window.addEventListener('resize', calculateDelta);

    return () => window.removeEventListener('resize', calculateDelta);
  }, []);

  const totalPaginas = Math.max(Math.ceil(totalRegistros / registrosPorPagina), 1);
  const registrosMostrados = paginaActual * registrosPorPagina;
  const yaLlegoAlFinal = registrosMostrados >= totalRegistros;

  // Función para generar el array de páginas con ellipsis responsive
  const generarPaginas = () => {
    const paginas: (number | string)[] = [];

    // Si el total de páginas cabe sin ellipsis según el tamaño de pantalla
    if (totalPaginas <= maxSinEllipsis) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
      return paginas;
    }

    // Si hay muchas páginas, usar ellipsis
    paginas.push(1);

    // Determinar si necesitamos ellipsis al inicio
    const startPage = Math.max(2, paginaActual - delta);
    if (startPage > 2) {
      paginas.push('start-ellipsis');
    }

    // Páginas alrededor de la actual
    const endPage = Math.min(totalPaginas - 1, paginaActual + delta);
    for (let i = startPage; i <= endPage; i++) {
      paginas.push(i);
    }

    // Determinar si necesitamos ellipsis al final
    if (endPage < totalPaginas - 1) {
      paginas.push('end-ellipsis');
    }

    // Siempre mostrar la última página
    if (totalPaginas > 1) {
      paginas.push(totalPaginas);
    }

    return paginas;
  };

  const paginas = generarPaginas();

  // Evitar problemas de hidratación
  if (!mounted) {
    return (
      <div className='flex items-center gap-1 sm:gap-2 mt-4 w-full px-2 justify-center'>
        <div className='h-8 sm:h-10 px-2 sm:px-3 bg-gray-200 rounded animate-pulse min-w-[100px]'></div>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-1 sm:gap-2 mt-4 w-full px-2 sm:px-4 justify-center'>
      {/* Botón Anterior */}
      {paginaActual > 1 && (
        <button
          onClick={() => onChange(paginaActual - 1)}
          className='h-8 sm:h-10 px-2 sm:px-3 text-sm sm:text-base rounded bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors duration-200 flex items-center justify-center gap-1 shrink-0'
          aria-label={t('previous')}
        >
          <ChevronLeft className='w-4 h-4 sm:w-5 sm:h-5' />
          <span className='hidden sm:inline whitespace-nowrap'>{t('previous')}</span>
        </button>
      )}

      {/* Botones de páginas */}
      {paginas.map((num, index) => {
        if (num === 'start-ellipsis' || num === 'end-ellipsis') {
          return (
            <div
              key={`${num}-${index}`}
              className='h-8 sm:h-10 px-1 sm:px-2 text-gray-500 text-sm sm:text-base flex items-center justify-center shrink-0'
            >
              ...
            </div>
          );
        }

        return (
          <button
            key={num}
            onClick={() => onChange(num as number)}
            className={`h-8 sm:h-10 px-2 sm:px-3 text-sm sm:text-base rounded transition-colors duration-200 min-w-[32px] sm:min-w-[40px] flex items-center justify-center shrink-0 ${
              num === paginaActual
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-gray-200 hover:bg-blue-500 hover:text-white'
            }`}
            aria-label={`${t('page')} ${num}`}
            aria-current={num === paginaActual ? 'page' : undefined}
          >
            {num}
          </button>
        );
      })}

      {/* Botón Siguiente */}
      {!yaLlegoAlFinal && (
        <button
          onClick={() => onChange(Math.min(paginaActual + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className={`h-8 sm:h-10 px-2 sm:px-3 text-sm sm:text-base rounded transition-colors duration-200 flex items-center justify-center gap-1 shrink-0 ${
            paginaActual === totalPaginas
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-gray-200 hover:bg-blue-500 hover:text-white'
          }`}
          aria-label={t('next')}
        >
          <span className='hidden sm:inline whitespace-nowrap'>{t('next')}</span>
          <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5' />
        </button>
      )}
    </div>
  );
};

export default Paginacion;
