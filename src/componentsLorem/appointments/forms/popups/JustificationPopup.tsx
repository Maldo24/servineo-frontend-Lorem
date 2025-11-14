"use client";
import * as React from "react";
import { Dialog, DialogContent } from "../../../calendar/ui/dialog";
import { Button } from "../../../atoms/button";

interface JustificationPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  minLength?: number; // por defecto 10
  maxLength?: number; // por defecto 300
  placeholder?: string;
}

export const JustificationPopup: React.FC<JustificationPopupProps> = ({
  open,
  onClose,
  onSubmit,
  title = "Justificación",
  confirmLabel = "Continuar",
  cancelLabel = "Volver",
  minLength = 10,
  maxLength = 300,
  placeholder = "Describe brevemente el motivo…",
}) => {
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 40);
    } else {
      // limpiar al cerrar
      setReason("");
      setError(null);
    }
  }, [open]);

  const handleConfirm = () => {
    const trimmed = reason.trim();
    if (trimmed.length < minLength) {
      setError(`Debe ingresar al menos ${minLength} caracteres.`);
      return;
    }
    if (trimmed.length > maxLength) {
      setError(`El motivo no puede superar los ${maxLength} caracteres.`);
      return;
    }
    setError(null);
    onSubmit(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-transparent shadow-none p-0">
        <div className="overflow-hidden rounded-2xl w-full max-w-md bg-white text-black">
          {/* Header */}
          <div className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold">{title}</span>
            <button
              onClick={onClose}
              
              className="opacity-90 hover:opacity-100 transition"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            <p className="text-sm text-gray-700 mb-3">
              Indique el motivo por el cual desea reprogramar la cita.
            </p>

            <textarea
              ref={textareaRef}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              maxLength={maxLength}
              placeholder={placeholder}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="mt-1 text-right text-xs text-gray-500">
              {reason.trim().length}/{maxLength}
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div className="mt-5 flex justify-between gap-3">
              <Button variant="secondary" onClick={onClose} className="rounded-full px-6">
                {cancelLabel}
              </Button>
              <Button onClick={handleConfirm} className="rounded-full px-6">
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JustificationPopup;
