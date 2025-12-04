import React from 'react';
import { highlightTextParts } from '@/Components/Common/TextHighlighter';

interface SearchHighlightProps {
  text: string;
  searchQuery: string;
  className?: string;
}

export const SearchHighlight: React.FC<SearchHighlightProps> = ({
  text,
  searchQuery,
  className = '',
}) => {
  const parts = highlightTextParts(text, searchQuery);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.highlight ? (
          <mark key={index} className='bg-yellow-200 font-semibold px-0.5 rounded'>
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  );
};
