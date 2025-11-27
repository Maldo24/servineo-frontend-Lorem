"use client"

import { useState } from "react"
import { useAppSelector } from "@/app/redux/hooks"
import { JobOffersSection } from "@/componentsLumonis/fixer/dashboard/JobOffersSection"
import { CertificationsSection } from "@/componentsLumonis/fixer/dashboard/CertificationsSection"
import { ExperienceSection } from "@/componentsLumonis/fixer/dashboard/ExperienceSection"
import { PortfolioSection } from "@/componentsLumonis/fixer/dashboard/PortfolioSection"
import { User, Briefcase, Award, Building2, Image as ImageIcon, MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"
import EstadisticasTrabajos from "@/componentsLumonis/fixer/Fixer-statistics"

type Tab = "offers" | "certs" | "experience" | "portfolio" | "estadisticas"

export default function FixerDashboardPage() {
    const { user } = useAppSelector((state) => state.user)
    const [activeTab, setActiveTab] = useState<Tab>("offers")

    if (!user) {
        return <div className="p-8 text-center">Cargando perfil...</div>
    }

    return (
        <div className="container mx-auto max-w-6xl p-4 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                <div className="px-6 pb-6">
                    <div className="relative flex justify-between items-end -mt-12 mb-4">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                {user.url_photo ? (
                                    <Image
                                        src={user.url_photo}
                                        alt={user.name}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="96px"
                                    />
                                ) : (
                                    <User className="h-full w-full p-4 text-gray-400" />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 border-2 border-white rounded-full" title="Disponible"></div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors">
                                Editar Perfil
                            </button>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors">
                                Ver Público
                            </button>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-500 font-medium">Fixer Profesional</p>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                            {user.email && (
                                <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                </div>
                            )}
                            {user.telefono && (
                                <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    {user.telefono}
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Cochabamba, Bolivia
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    <nav className="flex flex-col gap-1">
                        <button
                            onClick={() => setActiveTab("offers")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "offers"
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Briefcase className="h-5 w-5" />
                            Ofertas de Trabajo
                        </button>
                        <button
                            onClick={() => setActiveTab("certs")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "certs"
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Award className="h-5 w-5" />
                            Certificaciones
                        </button>
                        <button
                            onClick={() => setActiveTab("experience")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "experience"
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Building2 className="h-5 w-5" />
                            Experiencia
                        </button>
                        <button
                            onClick={() => setActiveTab("portfolio")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "portfolio"
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <ImageIcon className="h-5 w-5" />
                            Portafolio
                        </button>
                        <button
                            onClick={() => setActiveTab("estadisticas")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "estadisticas"
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Award className="h-5 w-5" />
                            Estadísticas
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]">
                        {activeTab === "offers" && <JobOffersSection />}
                        {activeTab === "certs" && <CertificationsSection />}
                        {activeTab === "experience" && <ExperienceSection />}
                        {activeTab === "portfolio" && <PortfolioSection />}
                        {activeTab === "estadisticas" && <EstadisticasTrabajos />}
                    </div>
                </div>
            </div>
        </div>
    )
}
