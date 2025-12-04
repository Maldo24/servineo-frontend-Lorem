'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar trabajos, ubicaciones, servicios...',
  className = '',
  disabled = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex-1 relative group ${className}`}>
      <div className='absolute left-4 top-1/2 -translate-y-1/2 z-10'>
        <Search
          className={`w-5 h-5 transition-all duration-300 ${
            isFocused
              ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
              : 'text-muted-foreground group-hover:text-blue-500'
          }`}
        />
      </div>

      {/* {isFocused && !disabled && (
        <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-pulse z-10" />
      )} */}

      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={`
          w-full pl-12 pr-12 py-4 
          bg-white/90 backdrop-blur-md
          border-2 rounded-2xl
          font-medium text-foreground placeholder:text-muted-foreground/60
          transition-all duration-300 ease-out
          shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isFocused
              ? 'border-primary shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02] bg-white'
              : 'border-primary hover:border-blue-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
          }
          ${disabled ? 'bg-gray-100' : ''}
        `}
      />

      {isFocused && !disabled && (
        <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse' />
      )}
    </div>
  );
}
