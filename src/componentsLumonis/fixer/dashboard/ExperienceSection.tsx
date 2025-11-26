"use client"

import { useState } from "react"
import { PillButton } from "../Pill-button"
import { Plus, Edit2, Trash2, Building2, Calendar, Briefcase } from "lucide-react"
import { IExperience } from "@/types/fixer-profile"
import { Modal } from "@/Components/Modal"
import { useForm } from "react-hook-form"

const MOCK_EXP: IExperience[] = [
    {
        _id: "1",
        fixerId: "fixer1",
        jobTitle: "Plomero Senior",
        jobType: "Tiempo completo",
        organization: "Servicios Generales S.A.",
        isCurrent: true,
        startDate: "2021-03-01",
        endDate: null,
        createdAt: new Date().toISOString()
    }
]

interface ExperienceSectionProps {
    readOnly?: boolean;
}

export function ExperienceSection({ readOnly = false }: ExperienceSectionProps) {
    const [experiences, setExperiences] = useState<IExperience[]>(MOCK_EXP)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingExp, setEditingExp] = useState<IExperience | null>(null)

    const { register, handleSubmit, reset, setValue, watch } = useForm<IExperience>()
    const isCurrent = watch("isCurrent")

    const handleOpenModal = (exp?: IExperience) => {
        if (readOnly) return;
        if (exp) {
            setEditingExp(exp)
            setValue("jobTitle", exp.jobTitle)
            setValue("jobType", exp.jobType)
            setValue("organization", exp.organization)
            setValue("isCurrent", exp.isCurrent)
            setValue("startDate", exp.startDate.split("T")[0])
            setValue("endDate", exp.endDate ? exp.endDate.split("T")[0] : "")
        } else {
            setEditingExp(null)
            reset({
                jobTitle: "",
                jobType: "Tiempo completo",
                organization: "",
                isCurrent: false,
                startDate: "",
                endDate: ""
            })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingExp(null)
        reset()
    }

    const onSubmit = (data: IExperience) => {
        if (editingExp) {
            setExperiences(prev => prev.map(e => e._id === editingExp._id ? { ...e, ...data } : e))
        } else {
            const newExp: IExperience = {
                ...data,
                _id: Date.now().toString(),
                fixerId: "fixer1",
                createdAt: new Date().toISOString()
            }
            setExperiences(prev => [...prev, newExp])
        }
        handleCloseModal()
    }

    const handleDelete = (id: string) => {
        if (readOnly) return;
        if (confirm("¿Estás seguro de eliminar esta experiencia?")) {
            setExperiences(prev => prev.filter(e => e._id !== id))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {readOnly ? "Experiencia Laboral" : "Mi Experiencia Laboral"}
                </h2>
                {!readOnly && (
                    <PillButton
                        onClick={() => handleOpenModal()}
                        className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar Experiencia
                    </PillButton>
                )}
            </div>

            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 py-2">
                {experiences.map((exp) => (
                    <div key={exp._id} className="relative pl-8 group">
                        {/* Timeline dot */}
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-sm" />

                        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all hover:border-blue-200">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{exp.jobTitle}</h3>
                                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                                            <Briefcase className="h-4 w-4" />
                                            <span>{exp.organization}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? "Presente" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ""}
                                        </span>
                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-medium text-xs uppercase tracking-wide">
                                            {exp.jobType}
                                        </span>
                                    </div>
                                </div>

                                {!readOnly && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(exp)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp._id!)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                title={editingExp ? "Editar Experiencia" : "Nueva Experiencia"}
                size="lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Título</label>
                        <input
                            {...register("jobTitle", { required: "El cargo es requerido" })}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ej: Plomero Senior"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa / Organización</label>
                        <input
                            {...register("organization", { required: "La empresa es requerida" })}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Ej: Servicios Generales S.A."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Empleo</label>
                        <select
                            {...register("jobType", { required: true })}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="Tiempo completo">Tiempo completo</option>
                            <option value="Medio tiempo">Medio tiempo</option>
                            <option value="Contrato">Contrato</option>
                            <option value="Freelance">Freelance</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="isCurrent"
                            {...register("isCurrent")}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700">Actualmente trabajo aquí</label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                            <input
                                type="date"
                                {...register("startDate", { required: true })}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                            <input
                                type="date"
                                {...register("endDate", { required: !isCurrent })}
                                disabled={isCurrent}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
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
