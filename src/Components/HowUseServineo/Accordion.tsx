'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: '¿Cómo funciona Servineo?',
      answer:
        'Servineo conecta hogares con profesionales calificados en Cochabamba. Publica tu necesidad, recibe cotizaciones de fixers verificados y elige al mejor para el trabajo.',
    },
    {
      question: '¿Qué tipos de servicios ofrecen?',
      answer:
        'Ofrecemos plomería, electricidad, carpintería, pintura, limpieza, jardinería, soldadura, albañilería y muchos servicios más para el hogar.',
    },
    {
      question: '¿Cómo se verifican los fixers?',
      answer:
        'Todos nuestros fixers pasan por un proceso de verificación que incluye revisión de documentos, entrevistas y evaluación de experiencia previa.',
    },
    {
      question: '¿Qué garantía ofrecen?',
      answer:
        'Ofrecemos garantía de 30 días en todos los trabajos realizados. Si no estás satisfecho, nuestro equipo de soporte te ayudará a resolver cualquier problema.',
    },
    {
      question: '¿Cómo se realizan los pagos?',
      answer:
        'Los pagos son 100% seguros a través de nuestra plataforma. Solo liberas el pago cuando el trabajo esté completado y estés satisfecho con el resultado.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className='max-w-4xl mx-auto px-4 py-8' aria-label='Preguntas frecuentes'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>Preguntas Frecuentes</h2>

      <div className='space-y-2'>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className='border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md'
          >
            <button
              onClick={() => toggleAccordion(index)}
              className='w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg'
              aria-expanded={openIndex === index}
              aria-controls={`answer-${index}`}
            >
              <span className='text-lg font-medium text-gray-800 pr-4'>{faq.question}</span>
              <span className='flex-shrink-0 transition-transform duration-300'>
                {openIndex === index ? (
                  <ChevronUp className='h-5 w-5 text-blue-600' aria-hidden='true' />
                ) : (
                  <ChevronDown className='h-5 w-5 text-gray-500' aria-hidden='true' />
                )}
              </span>
            </button>

            <div
              id={`answer-${index}`}
              className={`px-6 pb-4 transition-all duration-300 ${
                openIndex === index ? 'block opacity-100 max-h-96' : 'hidden opacity-0 max-h-0'
              }`}
              role='region'
              aria-labelledby={`question-${index}`}
            >
              <div className='border-t border-gray-100 pt-4'>
                <p className='text-gray-600 leading-relaxed'>{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Accordion;
