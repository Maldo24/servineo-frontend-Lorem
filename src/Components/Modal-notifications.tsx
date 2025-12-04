'use client';

import { X, CheckCircle, AlertCircle, Info, type LucideIcon, AlertTriangle } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: ReactNode;
  icon?: LucideIcon;
  autoClose?: boolean;
  autoCloseDelay?: number;
  // Acciones para confirmación
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-500',
    titleColor: 'text-green-700 dark:text-green-400',
    progressColor: 'bg-green-500',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-500',
    titleColor: 'text-red-700 dark:text-red-400',
    progressColor: 'bg-red-500',
    buttonColor: 'bg-red-600 hover:bg-red-700',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-700 dark:text-blue-400',
    progressColor: 'bg-blue-500',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  warning: {
    icon: AlertTriangle, // Cambiado a triangulo para advertencia general
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    iconColor: 'text-orange-500',
    titleColor: 'text-orange-700 dark:text-orange-400',
    progressColor: 'bg-orange-500',
    buttonColor: 'bg-orange-600 hover:bg-orange-700', // Color del botón de confirmar
  },
};

export default function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  icon: CustomIcon,
  autoClose = true,
  autoCloseDelay = 3000,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}: NotificationModalProps) {
  const config = typeConfig[type] || typeConfig.info;
  const IconComponent = CustomIcon || config.icon;

  // Lógica: Solo auto-cerrar si NO es warning, o si el usuario forzó autoClose=true explícitamente
  const shouldAutoClose = isOpen && autoClose && type !== 'warning';

  useEffect(() => {
    if (shouldAutoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 animate-fade-in'>
      {/* Overlay backdrop */}
      <div
        className='fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity'
        onClick={handleCancel}
        aria-hidden='true'
      />

      <div
        className={`relative w-full max-w-md bg-white border-2 ${config.borderColor} rounded-2xl shadow-2xl animate-scale-in`}
        role='dialog'
        aria-modal='true'
      >
        <div className='p-6'>
          <div className='flex items-start gap-4'>
            {/* Ícono */}
            <div
              className={`flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center`}
            >
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
            </div>

            {/* Contenido Texto */}
            <div className='flex-1 min-w-0'>
              <h3 className={`text-lg font-bold ${config.titleColor} mb-1`}>{title}</h3>
              <div className='text-sm text-gray-600 leading-relaxed'>{message}</div>
            </div>

            {/* Botón X de cerrar */}
            <button
              onClick={handleCancel}
              className='flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-all hover:rotate-90 duration-300 text-gray-400 hover:text-gray-600'
              aria-label='Cerrar'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Botones de Acción (Solo si es warning o se pasó onConfirm) */}
          {(type === 'warning' || onConfirm) && (
            <div className='mt-6 flex gap-3 justify-end'>
              <button
                onClick={handleCancel}
                className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors'
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 ${config.buttonColor} text-white rounded-lg text-sm font-medium transition-colors shadow-sm`}
              >
                {confirmText}
              </button>
            </div>
          )}

          {/* Barra de Progreso (Solo si auto-cierra) */}
          {shouldAutoClose && (
            <div className='mt-4 h-1 bg-gray-100 rounded-full overflow-hidden'>
              <div
                className={`h-full ${config.progressColor} animate-progress origin-left`}
                style={{ animationDuration: `${autoCloseDelay}ms` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
