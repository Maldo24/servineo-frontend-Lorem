import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className = '', ...props }, ref) => {
    return (
      <label className='block'>
        {label && <span className='text-sm font-medium'>{label}</span>}
        <input
          ref={ref}
          className={`mt-1 block w-full border rounded px-3 py-2 bg-white ${className} ${
            error ? 'border-red-500' : ''
          }`}
          {...props}
        />
        {error && <p className='text-red-600 text-sm mt-1'>{error}</p>}
      </label>
    );
  },
);

Input.displayName = 'Input';
