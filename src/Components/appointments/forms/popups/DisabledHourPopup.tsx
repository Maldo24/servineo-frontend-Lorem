import React from 'react';

interface DisabledHourPopupProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const DisabledHourPopup: React.FC<DisabledHourPopupProps> = ({ open, onClose, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xs mx-auto p-6">
        <h3 className="text-lg font-semibold text-black mb-2">Horario inhabilitado</h3>
        <p className="text-gray-700 mb-4 text-sm">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisabledHourPopup;
