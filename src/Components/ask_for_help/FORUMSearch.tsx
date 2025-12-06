
"use client";

import React from "react";
import { Search } from "lucide-react";

interface FORUMSearchProps {
  query: string;
  onChange: (value: string) => void;
}

export const FORUMSearch: React.FC<FORUMSearchProps> = ({ query, onChange }) => {
  return (
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-5 w-5" />
      </span>
      <input
        type="text"
        placeholder="Buscar por título o descripción..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-10 py-3 border-2 border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:shadow-md"
      />
    </div>
  );
};
