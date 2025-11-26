"use client"

import { useState } from "react"
import { PillButton } from "../Pill-button"
import { Plus, Trash2, Image as ImageIcon, Video, Play } from "lucide-react"
import { IPortfolioItem } from "@/types/fixer-profile"
import { Modal } from "@/Components/Modal"
import { useForm } from "react-hook-form"
import Image from "next/image"

const MOCK_PORTFOLIO: IPortfolioItem[] = [
    {
        _id: "1",
        fixerId: "fixer1",
        type: "image",
        url: "https://picsum.photos/300/200",
        createdAt: new Date().toISOString()
    },
    {
        _id: "2",
        fixerId: "fixer1",
        type: "video",
        url: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        createdAt: new Date().toISOString()
    }
]

interface PortfolioSectionProps {
    readOnly?: boolean;
}

export function PortfolioSection({ readOnly = false }: PortfolioSectionProps) {
    const [items, setItems] = useState<IPortfolioItem[]>(MOCK_PORTFOLIO)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalType, setModalType] = useState<"image" | "video">("image")

    const { register, handleSubmit, reset } = useForm<IPortfolioItem>()

    const handleOpenModal = (type: "image" | "video") => {
        if (readOnly) return;
        setModalType(type)
        reset({
            type: type,
            url: "",
            youtubeUrl: ""
        })
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        reset()
    }

    const onSubmit = (data: IPortfolioItem) => {
        const newItem: IPortfolioItem = {
            ...data,
            _id: Date.now().toString(),
            fixerId: "fixer1",
            createdAt: new Date().toISOString()
        }

        if (data.type === "video" && data.youtubeUrl && !data.url) {
            const videoId = data.youtubeUrl.split("v=")[1]?.split("&")[0]
            if (videoId) {
                newItem.url = `https://img.youtube.com/vi/${videoId}/0.jpg`
            }
        }

        setItems(prev => [...prev, newItem])
        handleCloseModal()
    }

    const handleDelete = (id: string) => {
        if (readOnly) return;
        if (confirm("¿Estás seguro de eliminar este elemento?")) {
            setItems(prev => prev.filter(i => i._id !== id))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                    {readOnly ? "Portafolio" : "Mi Portafolio"}
                </h2>

                {!readOnly && (
                    <div className="flex gap-2">
                        <PillButton
                            onClick={() => handleOpenModal("video")}
                            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Video className="h-4 w-4" />
                            Video
                        </PillButton>

                        <PillButton
                            onClick={() => handleOpenModal("image")}
                            className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Imagen
                        </PillButton>
                    </div>
                )}
            </div>

            {/* Grid de Portafolio */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                    <div
                        key={item._id}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:shadow-lg transition-all"
                    >
                        {/* Imagen con componente Next/Image */}
                        <div className="absolute inset-0 relative">
                            <Image
                                src={item.url || "https://placehold.co/300x300?text=No+Image"}
                                alt="Portfolio item"
                                fill
                                sizes="100vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        {item.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                <div className="rounded-full bg-white/20 backdrop-blur-sm p-4 ring-1 ring-white/50 group-hover:scale-110 transition-transform">
                                    <Play className="h-8 w-8 text-white fill-white" />
                                </div>
                            </div>
                        )}

                        {!readOnly && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                <button
                                    onClick={() => handleDelete(item._id!)}
                                    className="self-end p-2 bg-white/90 text-red-600 rounded-full hover:bg-white transition-colors shadow-sm hover:scale-110"
                                    title="Eliminar"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* MODAL */}
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                title={modalType === "image" ? "Agregar Imagen" : "Agregar Video"}
                size="md"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="hidden" {...register("type")} />

                    {modalType === "image" ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                            <input
                                {...register("url", { required: "La URL es requerida" })}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="https://..."
                            />
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de YouTube</label>
                                <input
                                    {...register("youtubeUrl", { required: "La URL es requerida" })}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Miniatura (Opcional)</label>
                                <input
                                    {...register("url")}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Se intentará extraer automáticamente"
                                />
                            </div>
                        </>
                    )}

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
