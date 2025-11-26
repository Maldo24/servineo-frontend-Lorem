'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface SearchCheckboxesProps {
  titleOnly: boolean;
  setTitleOnly: (value: boolean) => void;
  exactWords: boolean;
  setExactWords: (value: boolean) => void;
}

export function SearchCheckboxes({
  titleOnly,
  setTitleOnly,
  exactWords,
  setExactWords,
}: SearchCheckboxesProps) {
  const t = useTranslations('search');

  return (
    <div className="w-full bg-gray-100 border border-gray-200 rounded-lg p-4 mt-4">
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <input
            type="checkbox"
            checked={titleOnly}
            onChange={(e) => {
              const checked = e.target.checked;
              setTitleOnly(checked);
              if (checked) setExactWords(false);
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
          />
          <span className="text-sm text-gray-700">{t('titleOnly')}</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
          <input
            type="checkbox"
            checked={exactWords}
            onChange={(e) => {
              const checked = e.target.checked;
              setExactWords(checked);
              if (checked) setTitleOnly(false);
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
          />
          <span className="text-sm text-gray-700">{t('exactWords')}</span>
        </label>
      </div>
    </div>
  );
}
