import { Search } from 'lucide-react';
import React from 'react';

interface SearchIconProps {
  hasError?: boolean;
  className?: string;
}

export const SearchIcon = ({ hasError = false, className = '' }: SearchIconProps) => (
  <span className={`absolute left-2 top-1/2 -translate-y-1/2 z-[2] flex items-center ${className}`}>
    <Search size={20} color={hasError ? 'red' : '#888'} />
  </span>
);
