"use client"

import { useState } from "react"
import { PillButton } from "../Pill-button"
import { Plus, Edit2, Trash2, Award, ExternalLink, Calendar, Building2 } from "lucide-react"
import { ICertification } from "@/types/fixer-profile"
import { Modal } from "@/Components/Modal"
import { useForm } from "react-hook-form"

const MOCK_CERTS: ICertification[] = [
    {
        _id: "1",
        fixerId: "fixer1",
        name: "Técnico en Instalaciones Eléctricas",
        institution: "INFOCAL",
        issueDate: "2023-05-15",
        expiryDate: "2026-05-15",
        credentialId: "INFO-2023-001",
        credentialUrl: "https://example.com/cert",
        createdAt: new Date().toISOString()
    }
]

interface CertificationsSectionProps {
    readOnly?: boolean;
}

export function CertificationsSection({ readOnly = false }: CertificationsSectionProps) {
    const [certs, setCerts] = useState<ICertification[]>(MOCK_CERTS)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCert, setEditingCert] = useState<ICertification | null>(null)

    const { register, handleSubmit, reset, setValue } = useForm<ICertification>()

    const handleOpenModal = (cert?: ICertification) => {
        if (readOnly) return;
        if (cert) {
            setEditingCert(cert)
            setValue("name", cert.name)
            setValue("institution", cert.institution)
            setValue("issueDate", cert.issueDate.split("T")[0])
            setValue("expiryDate", cert.expiryDate.split("T")[0])
            setValue("credentialId", cert.credentialId)
            setValue("credentialUrl", cert.credentialUrl)
        } else {
            setEditingCert(null)
            reset({
                name: "",
                institution: "",
                issueDate: "",
                expiryDate: "",
                credentialId: "",
                credentialUrl: ""
            })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingCert(null)
        reset()
    }

    const onSubmit = (data: ICertification) => {
        if (editingCert) {
            setCerts(prev => prev.map(c => c._id === editingCert._id ? { ...c, ...data } : c))
        } else {
            const newCert: ICertification = {
                ...data,
                _id: Date.now().toString(),
                fixerId: "fixer1",
                createdAt: new Date().toISOString()
            }
            setCerts(prev => [...prev, newCert])
        }
        handleCloseModal()
    }

    const handleDelete = (id: string) => {
        if (readOnly) return;
        if (confirm("¿Estás seguro de eliminar esta certificación?")) {
            setCerts(prev => prev.filter(c => c._id !== id))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    {readOnly ? "Certificaciones" : "Mis Certificaciones"}
                </h2>
                {!readOnly && (
                    <PillButton
                        onClick={() => handleOpenModal()}
                        className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar Certificación
                    </PillButton>
                )}
            </div>

            <div className="grid gap-4">
                {certs.map((cert) => (
                    <div
                        key={cert._id}
                        className="group relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all hover:border-blue-200"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">{cert.name}</h3>
                                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                                        <Building2 className="h-4 w-4" />
                                        <span>{cert.institution}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            <span>Emitido: {new Date(cert.issueDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            <span>Vence: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {cert.credentialUrl && (
                                        <a
                                            href={cert.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-sm mt-3 font-medium"
                                        >
                                            Ver credencial <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {!readOnly && (
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal(cert)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cert._id!)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                title={editingCert ? "Editar Certificación" : "Nueva Certificación"}
                size="lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Certificación</label>
                        <input
                            {...register("name", { required: "El nombre es requerido" })}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ej: Técnico Electricista"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institución Emisora</label>
                        <input
                            {...register("institution", { required: "La institución es requerida" })}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ej: INFOCAL"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Emisión</label>
                            <input
                                type="date"
                                {...register("issueDate", { required: true })}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                            <input
                                type="date"
                                {...register("expiryDate", { required: true })}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID Credencial</label>
                            <input
                                {...register("credentialId")}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Opcional"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Credencial</label>
                            <input
                                {...register("credentialUrl")}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="https://..."
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
