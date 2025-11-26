"use client"

import { useState, useEffect, useRef } from "react"
import {
  MapPin,
  Edit,
  Save,
  X,
  Briefcase,
  MessageSquare,
  Star,
  Phone,
  Mail,
} from "lucide-react"
import Image from "next/image"
import type { Fixer } from "@/app/lib/mock-data"
import FixerGraficCard from "@/Components/fixer/Fixer-grafic-card"

interface FixerProfileProps {
  fixer: Fixer
  isOwner?: boolean
}

interface FormData {
  bio: string
  phone: string
  city: string
  whatsapp: string
}

interface LocationMapProps {
  lat: number
  lng: number
}

export function FixerProfile({ fixer, isOwner = false }: FixerProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    bio: fixer.bio || "",
    phone: fixer.phone || "",
    city: fixer.city || "",
    whatsapp: fixer.whatsapp || "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    console.log("Saving profile:", formData)
    setIsEditing(false)
  }

  const handleContact = () => {
    if (fixer.whatsapp) {
      window.open(`https://wa.me/${fixer.whatsapp.replace(/\D/g, "")}`, "_blank")
    }
  }

  const formattedJoinDate = (() => {
    if (!fixer.joinDate) return null
    const date = new Date(fixer.joinDate)
    if (Number.isNaN(date.getTime())) return null

    return date.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    })
  })()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                {fixer.photo && fixer.photo.startsWith("http") ? (
                  <Image
                    src={fixer.photo}
                    alt={fixer.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <Briefcase className="w-16 h-16 text-blue-600" />
                  </div>
                )}
              </div>
              {isOwner && (
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold">{fixer.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{fixer.city}</span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>{fixer.rating?.toFixed(1) || "Nuevo"}</span>
                </div>
                <span className="text-sm opacity-80">
                  {fixer.completedJobs} trabajos realizados
                </span>
              </div>

              {formattedJoinDate && (
                <p className="mt-1 text-sm opacity-80">
                  En la app desde {formattedJoinDate}
                </p>
              )}

              {!isOwner && fixer.whatsapp && (
                <button
                  onClick={handleContact}
                  className="mt-4 px-4 py-2 bg-white text-blue-700 rounded-lg font-medium flex items-center gap-2 mx-auto md:mx-0 hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contactar por WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Botones de edición */}
          {isOwner && (
            <div className="flex justify-end mb-6">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar perfil
                </button>
              )}
            </div>
          )}

          {/* Bio Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Acerca de mí
            </h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                placeholder="Cuéntanos sobre ti y tus servicios..."
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {fixer.bio || "Este profesional aún no ha agregado una descripción."}
              </p>
            )}
          </div>

          {/* Contact & Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de contacto
              </h3>
              <div className="space-y-3">
                {fixer.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span>{fixer.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex-1 bg-white px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Número de teléfono"
                    />
                  ) : (
                    <span>{fixer.phone || "No especificado"}</span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="flex-1 bg-white px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="WhatsApp (opcional)"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mis Servicios
                </h3>
                {isOwner && (
                  <button className="text-blue-600 text-sm hover:underline">
                    Gestionar
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {fixer.services.length > 0 ? (
                  fixer.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                    >
                      {service}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">
                    Aún no se han agregado servicios
                  </p>
                )}
              </div>

              {/* Payment Methods */}
              {fixer.paymentMethods?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Métodos de pago aceptados
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {fixer.paymentMethods.map((method, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mapa de ubicación */}
          {fixer.location?.lat && fixer.location?.lng && (
            <LocationMap lat={fixer.location.lat} lng={fixer.location.lng} />
          )}

          {/* Tarjeta de estadísticas */}
          <div className="mt-12">
            <FixerGraficCard
              completedJobs={fixer.completedJobs ?? 0}
              cancelledJobs={fixer.cancelledJobs ?? 0}
              monthlyData={fixer.monthlyData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ========================================
// Componente del mapa
// ========================================
function LocationMap({ lat, lng }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link")
      link.id = "leaflet-css"
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    if (!window.L) {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => setMapLoaded(true)
      document.body.appendChild(script)
    } else {
      setMapLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.L) return

    const L = window.L
    const map = L.map(mapRef.current).setView([lat, lng], 14)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    L.marker([lat, lng]).addTo(map)

    return () => {
      map.remove()
    }
  }, [lat, lng, mapLoaded])

  if (!mapLoaded) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Ubicación</h3>
        <div className="h-64 w-full rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-500">
          Cargando mapa...
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Ubicación</h3>
      <div ref={mapRef} className="h-64 w-full rounded-xl border border-gray-200" />
    </div>
  )
}
