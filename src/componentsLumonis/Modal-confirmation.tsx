"use client"

import { X, AlertTriangle } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const typeConfig = {
    danger: {
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      iconColor: "text-red-500",
      titleColor: "text-red-700 dark:text-red-400",
      buttonColor: "bg-red-500 hover:bg-red-600",
    },
    warning: {
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-500",
      titleColor: "text-orange-700 dark:text-orange-400",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
    },
    info: {
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-500",
      titleColor: "text-blue-700 dark:text-blue-400",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
    },
  }

  const config = typeConfig[type]

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        className={`relative w-full max-w-md bg-card border-2 ${config.borderColor} rounded-2xl shadow-2xl animate-scale-in`}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center`}>
              <AlertTriangle className={`w-6 h-6 ${config.iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-bold ${config.titleColor} mb-1`}>{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 hover:bg-muted rounded-lg transition-all hover:rotate-90 duration-300"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-border rounded-xl hover:bg-muted transition-all font-semibold"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2.5 ${config.buttonColor} text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}