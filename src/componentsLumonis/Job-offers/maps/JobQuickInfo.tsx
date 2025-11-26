"use client"

import type React from "react"
import { Phone, MessageCircle, ChevronRight, MapPin, Star, Navigation } from "lucide-react"
import type { JobOffer } from "@/app/lib/mock-data"

interface JobQuickInfoProps {
  offer: JobOffer
  onShowMore: () => void
  distance?: number
}

export function JobQuickInfo({ offer, onShowMore, distance }: JobQuickInfoProps) {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const message = encodeURIComponent(`Hola ${offer.fixerName}, vi tu oferta de trabajo y me interesa.`)
    window.open(`https://wa.me/${offer.whatsapp.replace(/\s/g, "")}?text=${message}`, "_blank")
  }

  return (
    <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border-2 border-primary/80 p-5 min-w-[300px] max-w-[calc(100vw-2rem)] sm:max-w-[380px] animate-in fade-in slide-in-from-left-8 duration-300 overflow-hidden z-[1000]">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-4">
          <div className="relative group">
            <div className="relative w-14 h-14 rounded-xl bg-blue-500/90 flex items-center justify-center text-white font-bold text-xl shadow-md border border-white/50 flex-shrink-0 transition-all duration-300 group-hover:bg-blue-600/90">
              {offer.fixerName.charAt(0)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-blue-900 truncate">{offer.fixerName}</h3>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="text-xs text-gray-600 ml-1">(4.9)</span>
            </div>
            {distance !== undefined && (
              <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                <Navigation className="w-3 h-3" />
                <span className="font-semibold">{distance.toFixed(1)} km de distancia</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2 mb-4 leading-relaxed">{offer.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {offer.tags.slice(0, 3).map((tag, index) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-blue-100 text-primary text-xs rounded-lg font-semibold border border-blue-300 animate-in fade-in slide-in-from-left duration-300 hover:bg-blue-200 hover:border-blue-400 transition-all"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 mb-4 pb-4 border-b border-blue-200">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>{offer.location.address}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-green-50 border-2 border-green-500 text-green-700 hover:bg-green-100 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>

          <button
            onClick={onShowMore}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 border-2 border-blue-600"
          >
            Ver más
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 mt-3 pt-3 border-t border-blue-200">
          <Phone className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium">{offer.whatsapp}</span>
        </div>
      </div>
    </div>
  )
}
