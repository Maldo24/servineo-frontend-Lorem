"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import { X } from "lucide-react"

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full"
export type ModalAlign = "center" | "top"

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  size?: ModalSize
  align?: ModalAlign
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  className?: string
  overlayClassName?: string
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "w-screen h-screen max-w-none",
}

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [locked])
}

const Modal: React.FC<ModalProps> & {
  Header: React.FC<React.HTMLAttributes<HTMLDivElement>>
  Body: React.FC<React.HTMLAttributes<HTMLDivElement>>
  Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>
} = ({
  open,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  size = "md",
  align = "center",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = "",
  overlayClassName = "",
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !closeOnEsc) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, closeOnEsc, onClose])

  useLockBodyScroll(open)

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  if (!open) return null

  const content = (
    <div
      ref={overlayRef}
      role="presentation"
      className={[
        "fixed inset-0 z-[1000] flex",
        align === "center" ? "items-center" : "items-start",
        "justify-center bg-black/50",
        overlayClassName,
      ].join(" ")}
      onMouseDown={(e) => {
        if (!closeOnOverlayClick) return
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        tabIndex={-1}
        ref={panelRef}
        className={[
          "w-full mx-4 sm:mx-6 rounded-xl bg-white shadow-xl outline-none",
          sizeClasses[size],
          align === "top" ? "mt-16" : "",
          className,
        ].join(" ")}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
            <div className="text-lg font-semibold">{title}</div>
            {showCloseButton && (
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X className="h-5 w-5" /> 
              </button>
            )}
          </div>
        )}

        <div className="px-4 py-4">{children}</div>

        {footer && <div className="border-t px-4 py-3">{footer}</div>}
      </div>
    </div>
  )

  if (typeof window === "undefined") return null
  return ReactDOM.createPortal(content, document.body)
}

Modal.Header = function ModalHeader(props) {
  return <div className="px-4 py-3 border-b text-lg font-semibold" {...props} />
}

Modal.Body = function ModalBody(props) {
  return <div className="px-4 py-4" {...props} />
}

Modal.Footer = function ModalFooter(props) {
  return <div className="px-4 py-3 border-t" {...props} />
}

export { Modal }
export default Modal
