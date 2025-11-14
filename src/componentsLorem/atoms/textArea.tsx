import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  readOnly?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, label, className = '',readOnly, ...props }, ref) => {
    return (
      <label className="block">
        {label && <span className="text-sm font-medium">{label}</span>}
        <textarea
          ref={ref}
          className={`mt-1 block w-full border rounded px-3 py-2 bg-white ${className} ${
            error ? 'border-red-500' : ''
          }${readOnly ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}`} 
          readOnly={readOnly}
          {...props}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </label>
    );
  }
);

TextArea.displayName = 'TextArea';