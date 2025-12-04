// frontend/src/components/ask_for_help/FAQSearch.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface FAQSearchProps {
  onSearch: (query: string) => void;
}

const MAX_LENGTH = 100;

export const FAQSearch: React.FC<FAQSearchProps> = ({ onSearch }) => {
  const [searchTermRaw, setSearchTermRaw] = useState('');
  const handleSearch = useCallback(onSearch, [onSearch]);
  const searchTermClean = searchTermRaw.trim();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchTermClean);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTermClean, handleSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > MAX_LENGTH) value = value.substring(0, MAX_LENGTH);
    setSearchTermRaw(value);
  };

  // ✅ Función para borrar el texto
  const clearSearch = () => setSearchTermRaw('');

  return (
    <div className='relative w-full mb-8'>
      {/* 🔍 Icono de búsqueda */}
      <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-400'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='w-5 h-5'
        >
          <path
            fillRule='evenodd'
            d='M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z'
            clipRule='evenodd'
          />
        </svg>
      </span>

      {/* Campo de texto */}
      <input
        type='text'
        placeholder='Buscar preguntas frecuentes...'
        value={searchTermRaw}
        onChange={handleChange}
        maxLength={MAX_LENGTH}
        className='w-full pl-12 pr-10 py-3 border-2 border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:shadow-md'
        aria-label={`Buscar preguntas frecuentes (máx. ${MAX_LENGTH} caracteres)`}
      />

      {/* ❌ Icono para borrar texto */}
      {searchTermRaw && (
        <button
          onClick={clearSearch}
          className='
            absolute 
            right-3 
            top-1/2 
            transform 
            -translate-y-1/2 
            text-gray-400 
            hover:text-gray-600 
            focus:outline-none
          '
          aria-label='Borrar búsqueda'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-5 h-5'
          >
            <path
              fillRule='evenodd'
              d='M6.72 6.72a.75.75 0 011.06 0L12 10.94l4.22-4.22a.75.75 0 111.06 1.06L13.06 12l4.22 4.22a.75.75 0 11-1.06 1.06L12 13.06l-4.22 4.22a.75.75 0 11-1.06-1.06L10.94 12 6.72 7.78a.75.75 0 010-1.06z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      )}
    </div>
  );
};
