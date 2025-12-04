'use client';

import type React from 'react';
import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type ModalAlign = 'center' | 'top';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  size?: ModalSize;
  align?: ModalAlign;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  overlayClassName?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'w-screen h-screen max-w-none m-0 rounded-none',
};

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

const Modal: React.FC<ModalProps> & {
  Header: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Body: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>;
} = ({
  open,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  size = 'md',
  align = 'center',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = '',
  overlayClassName = '',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeOnEsc, onClose]);

  useLockBodyScroll(open);

  // Focus trap simple al abrir
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        panelRef.current?.focus();
      });
    }
  }, [open]);

  if (!open) return null;

  const content = (
    <div
      ref={overlayRef}
      role='presentation'
      className={[
        // Layout
        'fixed inset-0 z-[1000] flex',
        align === 'center' ? 'items-end sm:items-center' : 'items-start', // En móvil empieza abajo, en desktop centro
        'justify-center p-4 sm:p-6',
        // Estilo Visual del Fondo (Backdrop)
        'bg-gray-900/60 backdrop-blur-sm transition-all duration-300',
        // Animación de entrada del fondo
        'animate-in fade-in duration-200',
        overlayClassName,
      ].join(' ')}
      onMouseDown={(e) => {
        if (!closeOnOverlayClick) return;
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
        ref={panelRef}
        className={[
          // Layout Base
          'w-full bg-white relative outline-none flex flex-col',
          // Bordes y Sombras
          'rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100',
          // Altura máxima segura (para que no se salga de la pantalla en laptops pequeñas)
          'max-h-[90vh] sm:max-h-[85vh]',
          // Animación de entrada del Panel (Zoom sutil y fade)
          'animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300 ease-out',
          sizeClasses[size],
          align === 'top' ? 'mt-10 sm:mt-20' : '',
          className,
        ].join(' ')}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Renderizado condicional del Header automático */}
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4 shrink-0 bg-white rounded-t-2xl'>
            {title && <div className='text-lg font-bold text-gray-900 leading-6'>{title}</div>}

            {showCloseButton && (
              <button
                type='button'
                aria-label='Cerrar'
                onClick={onClose}
                className='group relative -mr-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20'
              >
                <X className='h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors' />
              </button>
            )}
          </div>
        )}

        {/* El children se renderiza directamente aquí. 
            El usuario debe usar <Modal.Body> para el padding y scroll. */}
        {children}

        {/* Renderizado condicional del Footer automático */}
        {footer && (
          <div className='border-t border-gray-100 px-6 py-4 bg-gray-50/50 rounded-b-2xl shrink-0 flex justify-end gap-3'>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return ReactDOM.createPortal(content, document.body);
};

// === SUBCOMPONENTES ESTILIZADOS ===

Modal.Header = function ModalHeader({ className = '', children, ...props }) {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-100 text-lg font-bold text-gray-900 shrink-0 flex items-center justify-between bg-white rounded-t-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Modal.Body = function ModalBody({ className = '', children, ...props }) {
  // overflow-y-auto permite scroll si el contenido es muy alto
  // flex-1 hace que ocupe el espacio restante entre header y footer
  return (
    <div className={`px-6 py-6 overflow-y-auto flex-1 overscroll-contain ${className}`} {...props}>
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ className = '', children, ...props }) {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl shrink-0 flex items-center justify-end gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Modal };
export default Modal;
