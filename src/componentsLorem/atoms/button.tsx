import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'px-4 py-2 rounded text-sm transition-colors';
    const variants = {
      primary: 'bg-[#2B6AE0] text-white disabled:opacity-60 disabled:cursor-not-allowed',
      secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-400'
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? 'Actualizando...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';