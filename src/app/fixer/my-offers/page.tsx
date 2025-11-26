"use client"

import { useState, useEffect } from "react"
import { currentFixer, mockJobOfferService, type JobOffer } from "@/app/lib/mock-data"
import { Plus, Edit2, Trash2, ImageIcon } from "lucide-react"
import JobOfferForm from "@/componentsLumonis/Job-offers/Job-offer-form"
import type { JobOfferFormData } from "@/app/lib/validations/Job-offer-Schemas"
import { ImageCarousel } from "@/componentsLumonis/Shared/ImageCarousel"
import NotificationModal from "@/componentsLumonis/Modal-notifications"
import ConfirmationModal from "@/componentsLumonis/Modal-confirmation"
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks"
import { setFixer } from "@/app/redux/slice/fixerSlice"
import {
  setOffers,
  addOffer,
  updateOffer as updateOfferRedux,
  deleteOffer as deleteOfferRedux,
} from "@/app/redux/slice/jobOffersSlice"

export default function MyOffersPage() {
  const dispatch = useAppDispatch()
  const offers = useAppSelector((state) => state.jobOffers.offers)
  const currentFixerRedux = useAppSelector((state) => state.fixer.currentFixer)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<JobOffer | null>(null)
  const [notification, setNotification] = useState<{
    isOpen: boolean
    type: "success" | "error" | "info" | "warning"
    title: string
    message: string
  }>({ isOpen: false, type: "success", title: "", message: "" })
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean
    offerId: string | null
  }>({ isOpen: false, offerId: null })

  
  useEffect(() => {
    if (!currentFixerRedux) {
      dispatch(setFixer(currentFixer))
    }
    const myOffers = mockJobOfferService.getMyOffers(currentFixer.id)
    dispatch(setOffers(myOffers))
  }, [dispatch, currentFixerRedux])

  const handleEdit = (offer: JobOffer) => {
    setEditingOffer(offer)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (offerId: string) => {
    setConfirmDelete({ isOpen: true, offerId })
  }

  const handleConfirmDelete = () => {
    if (confirmDelete.offerId) {
      try {
        mockJobOfferService.deleteOffer(confirmDelete.offerId)
        dispatch(deleteOfferRedux(confirmDelete.offerId))
        setNotification({
          isOpen: true,
          type: "success",
          title: "Oferta eliminada",
          message: "La oferta se eliminó correctamente",
        })
      } catch (error) {
        console.error("Error al eliminar la oferta:", error)
        setNotification({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "No se pudo eliminar la oferta. Por favor, intenta de nuevo.",
        })
      }
    }
    setConfirmDelete({ isOpen: false, offerId: null })
  }

  const handleSubmit = (formData: JobOfferFormData) => {
    try {
      
      const servicesAsStrings = formData.services.map((service) => service.value)
      const defaultLocations: { [key: string]: { lat: number; lng: number } } = {
        Cochabamba: { lat: -17.3895, lng: -66.1568 },
        "La Paz": { lat: -16.5, lng: -68.15 },
        "Santa Cruz": { lat: -17.7834, lng: -63.1821 },
        "El Alto": { lat: -16.5207, lng: -68.1742 },
      }

      const cityLocation = defaultLocations[formData.city] || defaultLocations["Cochabamba"]

      const offerData = {
        title: formData.title,
        description: formData.description,
        city: formData.city,
        services: servicesAsStrings,
        tags: formData.services.map((s) => s.value),
        photos: formData.photos || ["/placeholder.svg?height=300&width=400&text=trabajo"],
        price: formData.price || 0,
        fixerId: currentFixer.id,
        fixerName: currentFixer.name,
        whatsapp: currentFixer.whatsapp || currentFixer.phone,
        location: {
          lat: cityLocation.lat,
          lng: cityLocation.lng,
          address: `${formData.city}, Bolivia`,
        },
      }

      if (editingOffer) {
        const updatedOffer = mockJobOfferService.updateOffer(editingOffer.id, {
          ...offerData,
          id: editingOffer.id,
          createdAt: editingOffer.createdAt,
        })
        if (updatedOffer) {
          dispatch(updateOfferRedux(updatedOffer))
          setNotification({
            isOpen: true,
            type: "success",
            title: "Oferta actualizada",
            message: "La oferta se actualizó correctamente",
          })
        }
      } else {
        const newOffer = mockJobOfferService.addOffer(offerData)
        dispatch(addOffer(newOffer))
        setNotification({
          isOpen: true,
          type: "success",
          title: "Oferta creada",
          message: "La oferta se creó correctamente",
        })
      }

      setIsFormOpen(false)
      setEditingOffer(null)
    } catch (error) {
      console.error("Error al procesar el formulario:", error)
      setNotification({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Hubo un error al procesar el formulario. Por favor, intenta de nuevo.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          
          <button
            onClick={() => {
              setEditingOffer(null)
              setIsFormOpen(true)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nueva Oferta
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <JobOfferForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingOffer(null)
              }}
              defaultValues={editingOffer ?? undefined}
              submitButtonText={editingOffer ? "Guardar Cambios" : "Publicar Oferta"}
            />
          </div>
        )}

        
        {offers.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No tienes ofertas publicadas</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Crea tu primera oferta de trabajo para que los clientes puedan encontrarte y contactarte
            </p>
            <button
              onClick={() => {
                setEditingOffer(null)
                setIsFormOpen(true)
              }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 font-bold"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Oferta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                className="animate-fade-in relative group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative w-full overflow-hidden rounded-xl border border-primary bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  
                  <ImageCarousel
                    images={
                      offer.photos.length > 0 ? offer.photos : ["/placeholder.svg?height=180&width=320&text=Oferta"]
                    }
                    alt={`Trabajo de ${offer.fixerName}`}
                  />

                  
                  <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700 border border-gray-200 shadow-sm">
                    <span className="font-medium text-blue-600">{offer.city}</span>
                  </div>
                  <div className="absolute right-3 top-3 rounded-xl bg-white/95 px-3 py-2 text-sm font-bold text-primary shadow-lg border border-primary/20">
                    {offer.price} Bs
                  </div>

                  
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-black/0 p-4">
                    <div className="flex items-end justify-between">
                      <div className="text-white">
                        <div className="text-sm opacity-90">{offer.fixerName}</div>
                        <div className="text-xs opacity-80">{offer.whatsapp}</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-primary to-blue-600 px-3 py-1 rounded-full text-white font-medium">
                        {offer.services[0]}
                      </div>
                    </div>
                  </div>

                  
                  <div className="absolute left-3 bottom-16 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(offer)
                      }}
                      className="p-2 bg-white/95 text-primary rounded-lg transition-all hover:scale-110 shadow-lg hover:shadow-xl"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(offer.id)
                      }}
                      className="p-2 bg-white/95 text-destructive rounded-lg transition-all hover:scale-110 shadow-lg hover:shadow-xl"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, offerId: null })}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar oferta?"
        message="Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta oferta?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
