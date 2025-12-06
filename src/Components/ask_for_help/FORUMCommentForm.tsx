// src/Components/ask_for_help/FORUMCommentForm.tsx
"use client";

import React from "react";

interface FORUMCommentFormProps {
  value: string;
  posting: boolean;
  error: string | null;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const FORUMCommentForm: React.FC<FORUMCommentFormProps> = ({
  value,
  posting,
  error,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escriba el mensaje..."
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={posting || !value.trim()}
        className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
      >
        {posting ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
};