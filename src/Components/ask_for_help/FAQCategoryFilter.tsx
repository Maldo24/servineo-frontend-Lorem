// frontend/src/components/ask_for_help/FAQCategoryFilter.tsx
'use client';

import React from 'react';
import { FAQCategoria } from './faq.types';
// Eliminada: import styles from '../styles/faq.module.css';

interface FAQCategoryFilterProps {
  selectedCategory: FAQCategoria | 'all';
  onCategoryChange: (category: FAQCategoria | 'all') => void;
}

const categories = [
  { value: 'all', label: 'Todas' },
  { value: FAQCategoria.PROBLEMAS, label: 'Problemas' },
  { value: FAQCategoria.SERVICIOS, label: 'Servicios' },
  { value: FAQCategoria.PAGOS, label: 'Pagos' },
  { value: FAQCategoria.GENERAL, label: 'General' },
];

export const FAQCategoryFilter: React.FC<FAQCategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className='flex flex-wrap gap-2 mb-8 border-b border-gray-200'>
      {categories.map((category) => {
        const isActive = selectedCategory === category.value;
        const buttonClasses = isActive
          ? 'border-primary text-primary font-bold'
          : 'border-transparent text-neutral-text hover:text-primary hover:border-primary font-semibold';

        return (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value as FAQCategoria | 'all')}
            className={`
              px-4 py-2 text-base border-b-2
              flex items-center space-x-2 transition duration-150 ease-in-out
              ${buttonClasses}
            `}
            aria-pressed={isActive}
          >
            <span className='whitespace-nowrap'>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
};
