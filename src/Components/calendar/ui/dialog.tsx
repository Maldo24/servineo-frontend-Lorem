import * as React from 'react';
import { createPortal } from 'react-dom';

type DialogProps = {
  open: boolean;
  onOpenChange?: (v: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange?.(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div aria-modal='true' role='dialog' className='fixed inset-0 z-[9999] grid place-items-center'>
      <div className='fixed inset-0 bg-black/50' onClick={() => onOpenChange?.(false)} />
      {children}
    </div>,
    document.body,
  );
}

type DivProps = React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode };

export function DialogContent({ className, children, ...rest }: DivProps) {
  return (
    <div
      {...rest}
      className={['relative z-[10000]', className].filter(Boolean).join(' ')}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
