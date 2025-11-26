"use client"

import { X, CheckCircle, AlertCircle, Info, Trash2, type LucideIcon } from "lucide-react"
import { useEffect } from "react"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  icon?: LucideIcon
  autoClose?: boolean
  autoCloseDelay?: number
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    iconColor: "text-green-500",
    titleColor: "text-green-700 dark:text-green-400",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    iconColor: "text-red-500",
    titleColor: "text-red-700 dark:text-red-400",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-500",
    titleColor: "text-blue-700 dark:text-blue-400",
  },
  warning: {
    icon: Trash2,
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-500",
    titleColor: "text-orange-700 dark:text-orange-400",
  },
}

export default function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  icon: CustomIcon,
  autoClose = true,
  autoCloseDelay = 3000,
}: NotificationModalProps) {
  const config = typeConfig[type]
  const IconComponent = CustomIcon || config.icon

  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        className={`relative w-full max-w-md bg-card border-2 ${config.borderColor} rounded-2xl shadow-2xl animate-scale-in`}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center`}>
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
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

          {autoClose && (
            <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${config.bgColor} animate-progress`}
                style={{ animationDuration: `${autoCloseDelay}ms` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
