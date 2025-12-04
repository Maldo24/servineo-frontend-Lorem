import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, label, options, className = '', ...props }, ref) => {
    return (
      <label className='block'>
        {label && <span className='text-sm font-medium'>{label}</span>}
        <select
          ref={ref}
          className={`mt-1 block w-full border rounded px-3 py-2 text-sm ${className} ${
            error ? 'border-red-500' : ''
          }`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className='text-red-600 text-sm mt-1'>{error}</p>}
      </label>
    );
  },
);

Select.displayName = 'Select';
