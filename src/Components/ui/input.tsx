import * as React from 'react';
import { cn } from '@/app/lib/utils';

// ✅ forwardRef para compatibilidad con React Hook Form y tipado correcto
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot='input'
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props} // ✅ Esto pasa onChange, value, etc.
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
