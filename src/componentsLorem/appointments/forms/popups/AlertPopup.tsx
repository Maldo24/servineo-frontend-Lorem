import * as React from "react";
import { Dialog, DialogContent } from "../../../calendar/ui/dialog";
import { Button } from "../../../atoms/button";

type Variant = "info" | "confirm";

interface AlertPopupProps {
  open: boolean;
  onClose: () => void;
  variant?: Variant;
  title?: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

export const AlertPopup: React.FC<AlertPopupProps> = ({
  open,
  onClose,
  variant = "info",
  title = "Atención",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Volver",
  onConfirm,
}) => {
  const handleConfirm = () => {
    onClose();               // cierra primero
    setTimeout(() => {       // evita doble montaje en el mismo tick
      onConfirm?.();
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-transparent shadow-none p-0">
        <div className="overflow-hidden rounded-2xl max-w-sm bg-white">
          <div className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold">{title}</span>
            <button onClick={onClose} className="opacity-90 hover:opacity-100 transition" aria-label="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 text-center">
            <div className="mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a1 1 0 0 1 .894.553l9 18A1 1 0 0 1 21 22H3a1 1 0 0 1-.894-1.447l9-18A1 1 0 0 1 12 2Zm0 6a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1Zm0 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
              </svg>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">{message}</div>

            <div className={`mt-5 flex ${variant === "confirm" ? "justify-between gap-3" : "justify-center"}`}>
              <Button variant="secondary" onClick={onClose} className="rounded-full px-6">
                {cancelLabel}
              </Button>
              {variant === "confirm" && (
                <Button onClick={handleConfirm} className="rounded-full px-6">
                  {confirmLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
