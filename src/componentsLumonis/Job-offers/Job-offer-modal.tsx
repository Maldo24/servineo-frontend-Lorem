"use client"

import type { JobOffer } from "@/app/lib/mock-data"
import { X, MessageCircle, MapPin, Sparkles, Calendar } from "lucide-react"
import Image from "next/image"
import Link from 'next/link'

interface Props {
    offer: JobOffer | null
    isOpen: boolean
    onClose: () => void
}

export function JobOfferModal({ offer, isOpen, onClose }: Props) {
    if (!isOpen || !offer) return null
    const handleClickCalendar = () => {

        sessionStorage.setItem('fixer_id','68e87a9cdae3b73d8040102f');
        sessionStorage.setItem('requester_id', '68ec99ddf39c7c140f42fcfa');
        sessionStorage.setItem('roluser', 'requester');

    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-white w-full max-w-3xl rounded-2xl border-primary border-2 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-white via-white to-primary/5 backdrop-blur-lg border-b border-primary p-6 flex items-center justify-between z-10">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            {offer.fixerName}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{offer.city}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-muted rounded-xl transition-all hover:rotate-90 duration-300"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-lg">Descripción</h3>
                        </div>
                        <p className="text-foreground/80 leading-relaxed bg-muted/30 p-4 rounded-xl">{offer.description}</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-3">Servicios Ofrecidos</h3>
                        <div className="flex flex-wrap gap-2">
                            {offer.tags.map((tag) => (
                                <span key={tag} className="px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm rounded-full font-medium border border-primary/20 hover:border-primary/40 hover:scale-105 transition-all">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {offer.photos.length > 0 && (
                        <div>
                            <h3 className="font-bold text-lg mb-4">Galería de Trabajos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {offer.photos.map((photo, index) => (
                                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-muted group cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                                        <Image
                                            src={photo || "/placeholder.svg"}
                                            alt={`Foto ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-border/50">
                        <h3 className="font-bold text-lg mb-4">Información de Contacto</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                    <MessageCircle className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">WhatsApp</p>
                                    <p className="font-semibold">{offer.whatsapp}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                    <MapPin className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Ciudad</p>
                                    <p className="font-semibold">{offer.city}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Siempre se muestran ambos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <a
                            href={`https://wa.me/${offer.whatsapp.replace(/\s/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp
                        </a>

                        <Link
                            href="../calendar"

                            onClick={handleClickCalendar}
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                        >
                            <Calendar className="w-5 h-5" />
                            Agendar Cita +
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
