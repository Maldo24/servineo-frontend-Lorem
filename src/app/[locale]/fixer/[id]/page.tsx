"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Star, MessageCircle, Share2, Flag } from "lucide-react"
import { PillButton } from "../../../../componentsLumonis/Pill-button"

import { JobOffersSection } from "../../../../componentsLumonis/fixer/dashboard/JobOffersSection"
import { CertificationsSection } from "../../../../componentsLumonis/fixer/dashboard/CertificationsSection"
import { ExperienceSection } from "../../../../componentsLumonis/fixer/dashboard/ExperienceSection"
import { PortfolioSection } from "../../../../componentsLumonis/fixer/dashboard/PortfolioSection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../componentsLumonis/Tabs/Tabs"
import EstadisticasTrabajos from "../../../../componentsLumonis/fixer/Fixer-statistics"

// Mock data for the profile header
const MOCK_FIXER = {
    name: "Juan Perez",
    role: "Plomero Profesional",
    rating: 4.8,
    reviews: 124,
    location: "Cochabamba, Bolivia",
    photo: "https://picsum.photos/80",
    bio: "Especialista en plomería residencial y comercial con más de 10 años de experiencia. Garantizo trabajos limpios y duraderos.",
    verified: true
}

export default function FixerProfilePage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState("resumen")
    console.log("Fixer ID:", params.id)
    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Profile Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                                <Image
                                    src={MOCK_FIXER.photo}
                                    alt={MOCK_FIXER.name}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {MOCK_FIXER.verified && (
                                <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full ring-2 ring-white" title="Verificado">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{MOCK_FIXER.name}</h1>
                                    <p className="text-lg text-gray-600 font-medium">{MOCK_FIXER.role}</p>

                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="font-semibold text-gray-900">{MOCK_FIXER.rating}</span>
                                            <span>({MOCK_FIXER.reviews} reseñas)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{MOCK_FIXER.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <PillButton className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        Contactar
                                    </PillButton>
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                        <Flag className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
                                {MOCK_FIXER.bio}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white p-1 rounded-xl border shadow-sm inline-flex">
                        <TabsTrigger value="resumen" className="px-6">Resumen</TabsTrigger>
                        <TabsTrigger value="ofertas" className="px-6">Ofertas</TabsTrigger>
                        <TabsTrigger value="experiencia" className="px-6">Experiencia</TabsTrigger>
                        <TabsTrigger value="certificaciones" className="px-6">Certificaciones</TabsTrigger>
                        <TabsTrigger value="portafolio" className="px-6">Portafolio</TabsTrigger>
                        <TabsTrigger value="estadisticas" className="px-6">Estadísticas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="resumen" className="space-y-8">


                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Ofertas Destacadas</h2>
                            <JobOffersSection readOnly />
                        </section>
                    </TabsContent>

                    <TabsContent value="ofertas">
                        <JobOffersSection readOnly />
                    </TabsContent>

                    <TabsContent value="experiencia">
                        <ExperienceSection readOnly />
                    </TabsContent>

                    <TabsContent value="certificaciones">
                        <CertificationsSection readOnly />
                    </TabsContent>

                    <TabsContent value="portafolio">
                        <PortfolioSection readOnly />
                    </TabsContent>
                    <TabsContent value="estadisticas">
                        <EstadisticasTrabajos />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
