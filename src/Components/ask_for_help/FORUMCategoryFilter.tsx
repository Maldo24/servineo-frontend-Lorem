// frontend/src/Components/ask_for_help/FORUMCategoryFilter.tsx
'use client';

import React from 'react';
import type { ForumCategoria } from './forum.types';

export type ForumCategoryFilterValue = ForumCategoria | "todas";

interface FORUMCategoryFilterProps {
  selectedCategory: ForumCategoryFilterValue;
  onCategoryChange: (value: ForumCategoryFilterValue) => void;
}

const categories: { value: ForumCategoryFilterValue; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "problemas", label: "Problemas" },
  { value: "servicios", label: "Servicios" },
  { value: "consejos", label: "Consejos" },
  { value: "general", label: "General" },
];

export const FORUMCategoryFilter: React.FC<FORUMCategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200">
      {categories.map((category) => {
        const isActive = selectedCategory === category.value;
        const buttonClasses = isActive
          ? "border-primary text-primary font-bold"
          : "border-transparent text-neutral-text hover:text-primary hover:border-primary font-semibold";

        return (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`
              px-4 py-2 text-base border-b-2
              flex items-center space-x-2 transition duration-150 ease-in-out
              ${buttonClasses}
            `}
            aria-pressed={isActive}
          >
            <span className="whitespace-nowrap">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
};