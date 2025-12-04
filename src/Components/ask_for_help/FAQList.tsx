// frontend/src/components/ask_for_help/FAQList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { FAQ } from './faq.types';
import { FAQItem } from './FAQItem';

interface FAQListProps {
  faqs: FAQ[];
  loading: boolean;
}

const FAQ_LIMIT = 5;

export const FAQList: React.FC<FAQListProps> = ({ faqs }) => {
  const [showAll, setShowAll] = useState(false);

  // 👉 Nuevo estado: cuál FAQ está abierta
  const [openFAQId, setOpenFAQId] = useState<string | null>(null);

  const faqsToShow = useMemo(() => {
    if (showAll || faqs.length <= FAQ_LIMIT) {
      return faqs;
    }
    return faqs.slice(0, FAQ_LIMIT);
  }, [faqs, showAll]);

  const hasMore = faqs.length > FAQ_LIMIT;
  const itemsShownCount = faqsToShow.length;

  if (faqs.length === 0) {
    return (
      <div className='text-center p-12 bg-gray-50 border border-gray-200 rounded-lg mt-8'>
        <h3 className='text-xl font-semibold text-gray-800 mb-2'>No se encontraron resultados</h3>
        <p className='text-gray-600'>
          Intenta con otras palabras clave o navega por todas las preguntas frecuentes.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Lista de Preguntas Frecuentes */}
      <div className='space-y-4'>
        {faqsToShow.map((faq) => (
          <FAQItem
            key={faq._id}
            faq={faq}
            isOpen={openFAQId === faq._id}
            onToggle={() => setOpenFAQId((prev) => (prev === faq._id ? null : faq._id))}
          />
        ))}
      </div>

      {/* Botón Ver más / Ver menos */}
      {hasMore && (
        <div className='mt-6 text-center'>
          <button
            onClick={() => setShowAll(!showAll)}
            className='
              text-blue-600 
              hover:text-blue-700   
              font-semibold 
              py-2 px-4 
              rounded-lg 
              transition 
              duration-150 
              ease-in-out 
              border 
              border-blue-600
            '
          >
            {showAll
              ? `Ver menos (${itemsShownCount} resultados)`
              : `Ver más (${faqs.length - FAQ_LIMIT} preguntas más)`}
          </button>
        </div>
      )}
    </div>
  );
};
