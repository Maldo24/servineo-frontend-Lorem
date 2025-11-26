"use client"

import { useState } from "react"
import { PillButton } from "../Pill-button"
import { Plus, Briefcase } from "lucide-react"
import { IJobOffer } from "@/types/fixer-profile"
import { Modal } from "@/Components/Modal"
import { useForm } from "react-hook-form"
import { JobOfferCard } from "@/Components/Job-offers/JobOfferCard"
import type { JobOfferData } from "@/types/jobOffers"

// Mock data for now
const MOCK_OFFERS: IJobOffer[] = [
    {
        _id: "1",
        fixerId: "fixer1",
        fixerName: "Juan Perez",
        fixerWhatsapp: "+591 70000000",
        description: "Servicio de plomería general, reparación de fugas y destape de cañerías.",
        city: "Cochabamba",
        price: 150,
        categories: ["Plomería"],
        images: ["https://picsum.photos/200"],
        createdAt: new Date().toISOString()
    }
]

interface JobOffersSectionProps {
    readOnly?: boolean;
}

export function JobOffersSection({ readOnly = false }: JobOffersSectionProps) {
    const [offers, setOffers] = useState<IJobOffer[]>(MOCK_OFFERS)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingOffer, setEditingOffer] = useState<IJobOffer | null>(null)

    const { register, handleSubmit, reset, setValue } = useForm<IJobOffer>()

    const handleOpenModal = (offer?: IJobOffer) => {
        if (readOnly) return;
        if (offer) {
            setEditingOffer(offer)
            setValue("description", offer.description)
            setValue("price", offer.price)
            setValue("categories", offer.categories)
            setValue("city", offer.city)
        } else {
            setEditingOffer(null)
            reset({
                description: "",
                price: 0,
                categories: [],
                city: "Cochabamba",
                images: []
            })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingOffer(null)
        reset()
    }

    const onSubmit = (data: IJobOffer) => {
        if (editingOffer) {
            setOffers(prev => prev.map(o => o._id === editingOffer._id ? { ...o, ...data } : o))
        } else {
            const newOffer: IJobOffer = {
                ...data,
                _id: Date.now().toString(),
                fixerId: "fixer1",
                fixerName: "Juan Perez",
                fixerWhatsapp: "",
                images: ["https://picsum.photos/200"],
                createdAt: new Date().toISOString()
            }
            setOffers(prev => [...prev, newOffer])
        }
        handleCloseModal()
    }

    const handleDelete = (id: string) => {
        if (readOnly) return;
        if (confirm("¿Estás seguro de eliminar esta oferta?")) {
            setOffers(prev => prev.filter(o => o._id !== id))
        }
    }

    // Helper to convert IJobOffer to JobOfferData for the card
    const mapToCardData = (offer: IJobOffer): JobOfferData => ({
        _id: offer._id || "",
        title: offer.categories[0] || "Sin título", // Using category as title for now
        description: offer.description,
        price: offer.price,
        category: offer.categories[0] || "General",
        tags: offer.categories,
        city: offer.city,
        createdAt: new Date(offer.createdAt || Date.now()),
        fixerId: offer.fixerId,
        fixerName: offer.fixerName,
        fixerPhoto: undefined, // Add if available in IJobOffer
        contactPhone: offer.fixerWhatsapp,
        allImages: offer.images,
        photos: offer.images,
        imagenUrl: offer.images[0],
        rating: 0, // Mock
        status: "active",
        updatedAt: new Date(offer.createdAt || Date.now())
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    {readOnly ? "Ofertas de Trabajo" : "Mis Ofertas de Trabajo"}
                </h2>
                {!readOnly && (
                    <PillButton
                        onClick={() => handleOpenModal()}
                        className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Nueva Oferta
                    </PillButton>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                    <JobOfferCard
                        key={offer._id}
                        offer={mapToCardData(offer)}
                        onEdit={!readOnly ? () => handleOpenModal(offer) : undefined}
                        onDelete={!readOnly ? handleDelete : undefined}
                        readOnly={readOnly}
                        className="h-full"
                    />
                ))}
            </div>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                title={editingOffer ? "Editar Oferta" : "Nueva Oferta"}
                size="lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            {...register("categories.0", { required: "Selecciona una categoría" })}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="Plomería">Plomería</option>
                            <option value="Electricidad">Electricidad</option>
                            <option value="Carpintería">Carpintería</option>
                            <option value="Pintura">Pintura</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            {...register("description", { required: "La descripción es requerida" })}
                            rows={3}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Describe tu servicio..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (Bs.)</label>
                            <input
                                type="number"
                                {...register("price", { required: true, min: 0 })}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                            <input
                                {...register("city", { required: true })}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <PillButton
                            type="button"
                            onClick={handleCloseModal}
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            Cancelar
                        </PillButton>
                        <PillButton
                            type="submit"
                            className="bg-primary text-white hover:bg-blue-800"
                        >
                            Guardar
                        </PillButton>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
