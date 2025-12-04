import React from 'react';

export interface MessageProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'warning' | 'error' | 'info' | 'success';
}

export default function Message({ isOpen, onClose, title, message, type = 'info' }: MessageProps) {
  if (!isOpen) return null;

  const typeStyles = {
    warning: {
      border: 'border-yellow-500',
      icon: '⚠️',
      bgIcon: 'bg-yellow-100 text-yellow-600',
      button: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    },
    error: {
      border: 'border-red-500',
      icon: '❌',
      bgIcon: 'bg-red-100 text-red-600',
      button: 'bg-red-500 hover:bg-red-600 text-white',
    },
    info: {
      border: 'border-blue-500',
      icon: 'ℹ️',
      bgIcon: 'bg-blue-100 text-blue-600',
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
    success: {
      border: 'border-green-500',
      icon: '✅',
      bgIcon: 'bg-green-100 text-green-600',
      button: 'bg-green-500 hover:bg-green-600 text-white',
    },
  };

  const styles = typeStyles[type];

  const getDefaultTitle = () => {
    switch (type) {
      case 'warning':
        return 'Advertencia';
      case 'error':
        return 'Error';
      case 'success':
        return 'Éxito';
      default:
        return 'Información';
    }
  };

  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4'>
      <div
        className={`bg-white rounded-lg shadow-xl max-w-sm w-full p-6 border-l-4 ${styles.border}`}
      >
        <div className='flex items-center mb-4'>
          <div className={`rounded-full p-2 mr-3 ${styles.bgIcon}`}>{styles.icon}</div>
          <h3 className='text-lg font-semibold text-gray-900'>{title || getDefaultTitle()}</h3>
        </div>

        <p className='text-gray-700 mb-6'>{message}</p>

        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${styles.button}`}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
