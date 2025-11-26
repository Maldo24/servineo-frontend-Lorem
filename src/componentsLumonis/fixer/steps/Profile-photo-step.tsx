"use client"

import type React from "react"

import { useState } from "react"
import { Upload, User, X } from "lucide-react"
import { Card } from "@/componentsLumonis/Card"
import { fixerService } from "@/app/lib/service/fixer-service"
import Image from "next/image"

interface ProfilePhotoStepProps {
  photoUrl?: string
  onPhotoChange: (url: string) => void
  error?: string
}

export function ProfilePhotoStep({ photoUrl, onPhotoChange, error }: ProfilePhotoStepProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(photoUrl || null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor seleccione una imagen válida")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB")
      return
    }

    setUploading(true)
    try {
      const url = await fixerService.uploadProfilePhoto(file)
      setPreview(url)
      onPhotoChange(url)
    } catch (err) {
      console.error("Error uploading photo:", err)
      alert("Error al subir la foto")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onPhotoChange("")
  }

  return (
    <Card title="Foto de Perfil">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Sube una foto de perfil para que los clientes puedan identificarte</p>

        <div className="flex flex-col items-center gap-4">
          {preview ? (
            <div className="relative">
              <div className="relative h-40 w-40">
                <Image
                  src={preview || "/placeholder.svg"}
                  alt="Foto de perfil"
                  fill
                  className="rounded-full object-cover ring-4 ring-blue-100"
                />
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-100 ring-4 ring-gray-200">
              <User className="h-16 w-16 text-gray-400" />
            </div>
          )}

          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
            <div className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
              <Upload className="h-4 w-4" />
              {uploading ? "Subiendo..." : preview ? "Cambiar foto" : "Subir foto"}
            </div>
          </label>
        </div>

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
          <p className="font-medium">Recomendaciones:</p>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Usa una foto clara de tu rostro</li>
            <li>Formato: JPG, PNG o WebP</li>
            <li>Tamaño máximo: 5MB</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
