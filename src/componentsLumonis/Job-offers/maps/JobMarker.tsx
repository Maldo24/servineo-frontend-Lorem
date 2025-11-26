"use client"

import { MapPin } from "lucide-react"
import type { JobOffer } from "@/app/lib/mock-data"

interface JobMarkerProps {
  offer: JobOffer
  isSelected: boolean
  onClick: () => void
}

export function JobMarker({ offer, isSelected, onClick }: JobMarkerProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative transform transition-all duration-200 hover:scale-110
        ${isSelected ? "scale-125 z-50" : "z-10"}
      `}
      title={offer.fixerName}
    >
      <MapPin
        className={`
          w-10 h-10 drop-shadow-lg transition-colors
          ${isSelected ? "text-primary fill-primary" : "text-red-500 fill-red-500"}
        `}
      />
      <div
        className={`
        absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white
        ${isSelected ? "bg-primary animate-pulse" : "bg-red-500"}
      `}
      />
    </button>
  )
}
