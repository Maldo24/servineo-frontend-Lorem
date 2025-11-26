"use client"

import { useState } from "react"
import { MapPin, Edit, Save, X, Briefcase, MessageSquare, Star, Phone, Mail, Calendar } from "lucide-react"
import Image from "next/image"
import Link from 'next/link';
import type { Fixer } from "@/app/lib/mock-data"

export function FixerProfile({ fixer, isOwner = false }: { fixer: Fixer, isOwner?: boolean }) {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        bio: fixer.bio || "",
        phone: fixer.phone || "",
        city: fixer.city || "",
        whatsapp: fixer.whatsapp || ""
    })


    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        // Here you would typically make an API call to update the profile
        console.log("Saving profile:", formData)
        setIsEditing(false)
        // Optionally refresh the profile data
        // router.refresh()
    }

    const handleContact = () => {
        if (fixer.whatsapp) {
            window.open(`https://wa.me/${fixer.whatsapp}`, "_blank")
        }
    }


    const handleClickCalendar = () => {

        sessionStorage.setItem('fixer_id', fixer.id);
        sessionStorage.setItem('requester_id', 'pupup');
        sessionStorage.setItem('roluser', 'fixer');
    };
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                                {fixer.photo ? (
                                    <Image
                                        src={fixer.photo}
                                        alt={fixer.name}
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
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
                            <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center md:justify-start">
                                {!isOwner && fixer.whatsapp && (
                                    <button
                                        onClick={handleContact}
                                        className="px-4 py-2 bg-white text-blue-700 rounded-lg font-medium flex items-center gap-2 justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Contactar por WhatsApp
                                    </button>
                                )}
                                {isOwner && (
                                    <Link
                                        href="../calendar"
                                        onClick={handleClickCalendar}
                                        className="px-4 py-2 bg-white text-blue-700 rounded-lg font-medium flex items-center gap-2 justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <Calendar className="w-4 h-4"
                                        />
                                        Ver Calendario
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    {isOwner && (
                        <div className="flex justify-end mb-4">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
                                    >
                                        <Save className="w-4 h-4" />
                                        Guardar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                                >
                                    <Edit className="w-4 h-4" />
                                    Editar perfil
                                </button>
                            )}
                        </div>
                    )}

                    {/* Bio Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Acerca de mí</h3>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                                placeholder="Cuéntanos sobre ti y tus servicios..."
                            />
                        ) : (
                            <p className="text-gray-700 whitespace-pre-line">
                                {fixer.bio || "Este profesional aún no ha agregado una descripción."}
                            </p>
                        )}
                    </div>

                    {/* Contact & Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h3>
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
                                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                                            placeholder="Número de teléfono"
                                        />
                                    ) : (
                                        <span>{fixer.phone}</span>
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
                                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                                            placeholder="WhatsApp (opcional)"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Services */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Mis Servicios</h3>
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
                                    <p className="text-gray-500">Aún no se han agregado servicios</p>
                                )}
                            </div>

                            {/* Payment Methods */}
                            {fixer.paymentMethods?.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Métodos de pago</h4>
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
                </div>
            </div>
        </div>
    )
}
