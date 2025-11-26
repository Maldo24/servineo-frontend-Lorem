"use client"

import { MessageCircle, Phone, Mail, X } from "lucide-react"
import { useState } from "react"

interface QuickContactProps {
  whatsapp: string
  phone?: string
  email?: string
  position?: "bottom-right" | "bottom-left"
}

export function QuickContact({ whatsapp, phone, email, position = "bottom-right" }: QuickContactProps) {
  const [isOpen, setIsOpen] = useState(false)

  const positionClass = position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6"

  return (
    <div className={`fixed ${positionClass} z-40`}>
      {/* Menu */}
      {isOpen && (
        <div className="absolute bottom-full mb-4 right-0 bg-card border-2 border-border rounded-2xl p-3 shadow-2xl animate-scale-in space-y-2 w-56">
          <p className="text-sm font-semibold text-foreground mb-3 px-2">Nuestros Contactos</p>

          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg text-green-700 font-medium transition-all text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 w-full p-3 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg text-blue-700 font-medium transition-all text-sm"
            >
              <Phone className="w-4 h-4" />
              Llamar
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 w-full p-3 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg text-purple-700 font-medium transition-all text-sm"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-2xl shadow-green-500/50 flex items-center justify-center hover:scale-110 transition-transform duration-300 border-4 border-background"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  )
}
