"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useTranslations } from 'next-intl'
import type { JobOffer } from "@/app/lib/mock-data"
import { userLocation } from "@/app/lib/mock-data"
import { JobQuickInfo } from "./JobQuickInfo"
import { ZoomIn, ZoomOut, Locate, MapPin } from "lucide-react"
import type { Map, Marker } from 'leaflet';

interface MapViewProps {
  offers: JobOffer[]
  onOfferClick: (offer: JobOffer) => void
}

export function MapView({ offers, onOfferClick }: MapViewProps) {
  const t = useTranslations('jobOffers.map')
  const [isClient, setIsClient] = useState(false)
  const [hoveredOffer, setHoveredOffer] = useState<JobOffer | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)
  const markersRef = useRef<Marker[]>([])
  const userMarkerRef = useRef<Marker | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const updateMarkers = useCallback(async (L: typeof import('leaflet'), map: Map, offersToShow: JobOffer[]) => {
    // Limpiar marcadores existentes
    markersRef.current.forEach((marker) => map.removeLayer(marker))
    markersRef.current = []

    // Agregar nuevos marcadores
    offersToShow.forEach((offer, index) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        offer.location.lat,
        offer.location.lng,
      ).toFixed(1)

      const markerIcon = L.divIcon({
        className: "custom-offer-marker",
        html: `
          <div class="relative animate-in fade-in slide-in-from-bottom-4 duration-500" style="animation-delay: ${index * 100}ms">
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm"></div>
            <div class="relative group cursor-pointer">
              <div class="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-all duration-300"></div>
              <div class="relative w-12 h-12 bg-black/15 rounded-full border-4 border-white shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-300">
                ${offer.services.length}
              </div>
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      })

      const marker = L.marker([offer.location.lat, offer.location.lng], {
        icon: markerIcon,
      }).addTo(map)

      // Eventos hover
      const markerElement = marker.getElement()
      if (markerElement) {
        markerElement.addEventListener("mouseenter", () => {
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
          }
          hoverTimeoutRef.current = setTimeout(() => {
            setHoveredOffer(offer)
          }, 200)
        })

        markerElement.addEventListener("mouseleave", () => {
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
          }
          hoverTimeoutRef.current = setTimeout(() => {
            setHoveredOffer(null)
          }, 300)
        })
      }

      // Popup al hacer click - NO traducir fixerName ni description (son datos)
      marker.bindPopup(
        `<div class="text-center p-3">
          <p class="font-bold text-sm text-gray-800 mb-1">${offer.fixerName}</p>
          <p class="text-xs text-gray-600 mb-2">${offer.description}</p>
          <p class="text-xs text-primary font-semibold">${distance} km ${t('distance')}</p>
        </div>`,
        { className: "custom-popup" },
      )

      markersRef.current.push(marker)
    })
  }, [t])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapRef.current) return

    const initializeMap = async () => {
      const L = await import("leaflet")

      const map = L.map(mapRef.current!, {
        zoomControl: false,
      }).setView([userLocation.lat, userLocation.lng], 14)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      // Crear icono de usuario
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `
          <div class="relative">
            <div class="absolute inset-0 w-10 h-10 -left-1 -top-1 bg-primary/30 rounded-full animate-ping"></div>
            <div class="relative w-8 h-8 bg-primary rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      // Marcador de usuario
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
      }).addTo(map)
      userMarker.bindPopup(
        `<div class="text-center p-3">
          <p class="font-bold text-sm text-blue-400 mb-1">${t('yourLocation')}</p>
          <p class="text-xs text-gray-600">${userLocation.address}</p>
        </div>`,
        { className: "custom-popup" },
      )

      userMarkerRef.current = userMarker

      // Círculo alrededor del usuario
      L.circle([userLocation.lat, userLocation.lng], {
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.15,
        radius: 1000,
        weight: 2,
        opacity: 0.6,
      }).addTo(map)

      mapInstanceRef.current = map

      // Agregar marcadores de ofertas
      updateMarkers(L, map, offers)
    }

    initializeMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isClient, offers, updateMarkers, t])

  // Efecto para actualizar marcadores cuando las ofertas cambian
  useEffect(() => {
    if (!isClient || !mapInstanceRef.current) return

    const updateMarkersOnChange = async () => {
      const L = await import("leaflet")
      updateMarkers(L, mapInstanceRef.current!, offers)
    }

    updateMarkersOnChange()
  }, [offers, isClient, updateMarkers])

  const handleShowMore = (offer: JobOffer) => {
    onOfferClick(offer)
    setHoveredOffer(null)
  }

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut()
    }
  }

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14)
    }
  }

  // Si no estamos en el cliente, mostrar un placeholder
  if (!isClient) {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-blue-200 bg-gray-200 flex items-center justify-center">
        <p>{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg border border-blue-200">
      <div ref={mapRef} className="w-full h-full relative z-0" />

      {hoveredOffer && (
        <div
          className="absolute top-4 right-2 sm:top-20 sm:left-4 z-[1000] animate-in fade-in slide-in-from-right-8 sm:slide-in-from-left-8 duration-300"
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current)
            }
          }}
          onMouseLeave={() => {
            hoverTimeoutRef.current = setTimeout(() => {
              setHoveredOffer(null)
            }, 300)
          }}
        >
          <JobQuickInfo
            offer={hoveredOffer}
            onShowMore={() => handleShowMore(hoveredOffer)}
            distance={Number(calculateDistance(
              userLocation.lat,
              userLocation.lng,
              hoveredOffer.location.lat,
              hoveredOffer.location.lng,
            ).toFixed(1))}
          />
        </div>
      )}

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={handleZoomIn}
          className="p-3 bg-white/20 backdrop-blur-xl border border-blue-500/30 rounded-xl text-primary hover:text-blue-400 hover:border-blue-400/50 transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 hover:scale-110"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-3 bg-white/20 backdrop-blur-xl border border-blue-500/30 rounded-xl text-primary hover:text-blue-400 hover:border-blue-400/50 transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 hover:scale-110"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleRecenter}
          className="p-3 bg-white/20 backdrop-blur-xl border border-blue-500/30 rounded-xl text-primary hover:text-blue-400 hover:border-blue-400/50 transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 hover:scale-110"
        >
          <Locate className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-xl border-1 border-primary rounded-2xl p-4 shadow-2xl shadow-blue-500/20 z-[1000] animate-in fade-in slide-in-from-left duration-500 max-w-xs">
        <h4 className="font-bold text-sm text-primary mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {t('mapDetails')}
        </h4>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-primary border-2 border-white/50 shadow-lg transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-medium">{t('yourLocation')}</span>
          </div>
          <div className="flex items-center gap-3 group cursor-default">
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-black/20 border-2 border-white/50 shadow-lg transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-medium">{t('jobOffers')}</span>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-blue-500/30">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500/60 bg-blue-500/10" />
            <span className="text-gray-600 text-xs">{t('radius')}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-blue-500/30">
          <p className="text-xs font-semibold text-primary">
            {offers.length} {offers.length === 1 ? t('availableOffers.singular') : t('availableOffers.plural')}
          </p>
        </div>
      </div>
    </div>
  )
}
