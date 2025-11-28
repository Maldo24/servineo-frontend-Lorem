import React, { useRef, useEffect } from "react";

interface ReminderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reminderTime: number) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleConfirm = () => {
    onConfirm(0);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-title"
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
      >
        <div className="p-6">
          <h3
            id="reminder-title"
            className="text-lg font-semibold text-black mb-4"
          >
            Configurar Tiempo de Recordatorio
          </h3>

          {/* Contenido vacío - espacio para futuras opciones */}
          <div className="min-h-[120px]">
            {/* Aquí se agregarán las opciones de recordatorio */}
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 text-gray-700 text-sm hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 rounded bg-[#2B6AE0] text-white text-sm hover:bg-[#1e4fb8] transition-colors"
            >
              Configurar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;