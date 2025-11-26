"use client"

import { JobOfferCard } from "@/componentsLumonis/Job-offers/Job-offer-card"
import { MapPin, Star, Briefcase, MessageSquare, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Fixer } from "@/app/lib/mock-data"
import Image from "next/image"

interface FixerProfileContentProps {
  fixer: Fixer
}

export function FixerProfileContent({ fixer }: FixerProfileContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("inicio")

  const handleOfferClick = (offerId: string) => {
    router.push(`/offers/${offerId}`)
  }

  const handleContact = () => {
    if (fixer.whatsapp) {
      window.open(`https://wa.me/${fixer.whatsapp}`, "_blank")
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "servicios":
        return renderServicesTab()
      case "reseñas":
        return renderReviewsTab()
      case "fotos":
        return renderPhotosTab()
      default:
        return renderHomeTab()
    }
  }

  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* About Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acerca de</h2>
        <p className="text-gray-600 mb-6">
          {fixer.bio || "Este profesional aún no ha agregado una descripción."}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Experiencia</p>
              <p className="text-sm text-gray-600">
                {new Date().getFullYear() - new Date(fixer.joinDate).getFullYear()} años
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      {fixer.services?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Servicios</h2>
          <div className="flex flex-wrap gap-2">
            {fixer.services.map((service, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Jobs */}
      {fixer.jobOffers?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Trabajos Recientes</h2>
            <button
              onClick={() => setActiveTab("servicios")}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fixer.jobOffers.slice(0, 2).map((offer) => (
              <JobOfferCard 
                key={offer.id} 
                offer={offer} 
                onClick={() => handleOfferClick(offer.id)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )

 const renderServicesTab = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Mis Servicios</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {fixer.services.map((service, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{service}</h3>
          <p className="text-gray-600 text-sm">
            Servicio profesional especializado en {service.toLowerCase()}.
          </p>
        </div>
      ))}
    </div>
  </div>
)

const renderReviewsTab = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reseñas</h2>
        <div className="flex items-center">
          <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full mr-4">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="ml-1 font-medium text-amber-700">
              {fixer.rating?.toFixed(1) || "Nuevo"}
            </span>
          </div>
          <span className="text-gray-600">
            {fixer.completedJobs || 0} trabajos realizados
          </span>
        </div>
      </div>
      <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Escribir reseña
      </button>
    </div>

    <div className="space-y-4">
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                <span className="font-medium text-gray-600">C{i + 1}</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Cliente Satisfecho {i + 1}</h4>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= 5 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              Hace {i + 1} {i === 0 ? "semana" : "semanas"}
            </span>
          </div>
          <p className="text-gray-700">
            Excelente servicio, muy profesional y puntual. El trabajo quedó impecable.
          </p>
        </div>
      ))}
    </div>
  </div>
)

const renderPhotosTab = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Galería de Trabajos</h2>
    
    {fixer.jobOffers?.some(offer => offer.photos?.length > 0) ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {fixer.jobOffers.flatMap(offer => 
          offer.photos?.map((photo, i) => (
            <div 
              key={`${offer.id}-${i}`}
              className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={photo || "/placeholder.svg"}
                alt={`Trabajo ${i + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          ))
        )}
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
          <Briefcase className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aún no hay fotos</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Este profesional aún no ha compartido fotos de sus trabajos.
        </p>
      </div>
    )}
  </div>
)
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative -mt-16">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden">
                {fixer.photo ? (
                  <Image
                    src={fixer.photo}
                    alt={fixer.name}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
                    {fixer.name[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-white">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{fixer.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{fixer.city}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span>{fixer.rating?.toFixed(1) || 'Nuevo'}</span>
                  <span className="mx-1">•</span>
                  <span>{fixer.completedJobs || 0} trabajos</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleContact}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-blue-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Contactar
                </button>
                <button className="p-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {[
            { id: "inicio", label: "Inicio" },
            { id: "servicios", label: "Servicios" },
            { id: "reseñas", label: "Reseñas" },
            { id: "fotos", label: "Galería" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  )
}