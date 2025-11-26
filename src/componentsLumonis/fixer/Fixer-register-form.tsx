"use client"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { initialRegistrationSchema, type InitialRegistrationData } from "@/app/lib/validations/fixer-schemas"
import { AlertCircle } from "lucide-react"
import { useState } from "react"

interface FixerRegisterFormProps {
  onSubmit: (data: InitialRegistrationData) => void
  submitButtonText?: string
  defaultValues?: Partial<InitialRegistrationData>
}

export default function FixerRegisterForm({
  onSubmit,
  submitButtonText = "Registrar",
  defaultValues,
}: FixerRegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InitialRegistrationData>({
    resolver: zodResolver(initialRegistrationSchema),
    defaultValues: {
      name: defaultValues?.name || "Juan Carlos Pérez García",
      email: defaultValues?.email || "juan.perez@example.com",
      phone: defaultValues?.phone || "+591 70341618",
    },
    mode: "onChange" // Validación en tiempo real
  })

  const handleFormSubmit = async (data: InitialRegistrationData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre Completo <span className="text-red-500">*</span>
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <input
                {...field}
                id="name"
                type="text"
                maxLength={30}
                className="w-full rounded-full border border-transparent bg-gray-200 px-4 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-gray-100 focus:ring-2 focus:ring-blue-400 transition-all"
                placeholder="Ingrese su nombre completo"
                onChange={(e) => {
                  // Solo permitir letras y espacios, limitar a 30 caracteres
                  const value = e.target.value
                    .replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ\s]/g, '')
                    .slice(0, 30)
                  field.onChange(value)
                }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {field.value?.length || 0}/30
              </span>
            </div>
          )}
        />
        {errors.name && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.name.message}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <Controller
          name="email"
  control={control}
  render={({ field }) => (
    <input
      {...field}
      id="email"
      type="email"
      className="w-full rounded-full border border-transparent bg-gray-200 px-4 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-gray-100 focus:ring-2 focus:ring-blue-400 transition-all"
      placeholder="correo@ejemplo.com"
    />
  )}
/>
        {errors.email && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.email.message}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Teléfono <span className="text-red-500">*</span>
        </label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <input
                {...field}
                id="phone"
                type="tel"
                className="w-full rounded-full border border-transparent bg-gray-200 px-4 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:bg-gray-100 focus:ring-2 focus:ring-blue-400 transition-all pr-20"
                placeholder="+591 70123456"
                onChange={(e) => {
                  // Solo permitir números, +, - y espacios
                  const value = e.target.value.replace(/[^\d\s+-]/g, '')
                  field.onChange(value)
                }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {field.value ? field.value.replace(/\D/g, '').length : 0}/10 dígitos
              </span>
            </div>
          )}
        />
        {errors.phone && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.phone.message}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {isSubmitting ? "Registrando..." : submitButtonText}
      </button>
    </form>
  )
}