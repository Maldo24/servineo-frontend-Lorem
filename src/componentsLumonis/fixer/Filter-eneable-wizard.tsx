"use client"

import { useState } from "react"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StepIndicator } from "./Step-indicator"
import { Card } from "../Card"
import { PillButton } from "./Pill-button"
import { CIStep } from "./steps/Ci-step"
import { LocationStep } from "./steps/Location-step"
import { ServicesStep, type Service } from "./steps/Services-step"
import { PaymentStep } from "./steps/Payment-step"
import { VehicleStep } from "./steps/Vehicle-step"
import { TermsStep } from "./steps/Terms-step"
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { ProfilePhotoStep } from "./steps/Profile-photo-step"
// import { useCreateUserProfileMutation } from "@/app/redux/services/userApi"
import { IUser } from "@/types/user"
import { fixerProfileSchema, type FixerProfileData } from "@/app/lib/validations/fixer-schemas"

const DEFAULT_SERVICES: Service[] = [
  { id: "svc-plumbing", name: "Plomería" },
  { id: "svc-electric", name: "Electricidad" },
  { id: "svc-carpentry", name: "Carpintería" },
  { id: "svc-paint", name: "Pintura" },
]

interface FixerEnableWizardProps {
  user: IUser
}

export function FixerEnableWizard({ user }: FixerEnableWizardProps) {
  //const [registerFixer] = useCreateUserProfileMutation()
  const [step, setStep] = useState(0)
  const total = 7 // 0 to 6
  const [success, setSuccess] = useState(false)

  const methods = useForm<FixerProfileData>({
    resolver: zodResolver(fixerProfileSchema),
    defaultValues: {
      ci: "",
      workLocation: { lat: -16.5, lng: -68.15 }, // Default location (La Paz approx)
      servicios: [],
      metodoPago: {
        hasEfectivo: false,
        qr: false,
        tarjetaCredito: false
      },
      accountInfo: "",
      experience: { descripcion: "" },
      vehiculo: {
        hasVehiculo: false,
        tipoVehiculo: undefined
      },
      acceptTerms: false,
      url_photo: user.url_photo || "",
    },
    mode: "onChange",
  })

  const {
    handleSubmit,
    trigger,
    watch,
    setValue,
    //control,
    formState: { isSubmitting, errors },
  } = methods

  // Watch values for conditional rendering or passing to steps
  const url_photo = watch("url_photo")
  const ci = watch("ci")
  const workLocation = watch("workLocation")
  const servicios = watch("servicios")
  const metodoPago = watch("metodoPago")
  const accountInfo = watch("accountInfo")
  const vehiculo = watch("vehiculo")
  const acceptTerms = watch("acceptTerms")

  // Helper to manage services state which is a bit complex for simple watch
  // We'll keep the list of available services in local state if they can be added/removed dynamically
  // But the selected IDs are in the form.
  const [availableServices, setAvailableServices] = useState<Service[]>(
    DEFAULT_SERVICES.map((s) => ({ id: s.id, name: s.name }))
  )

  const validateStep = async () => {
    let fieldsToValidate: (keyof FixerProfileData)[] = []

    switch (step) {
      case 0:
        fieldsToValidate = ["url_photo"]
        break
      case 1:
        fieldsToValidate = ["ci"]
        break
      case 2:
        fieldsToValidate = ["workLocation"]
        break
      case 3:
        fieldsToValidate = ["servicios"]
        break
      case 4:
        fieldsToValidate = ["metodoPago", "accountInfo"]
        break
      case 5:
        fieldsToValidate = ["vehiculo"]
        break
      case 6:
        fieldsToValidate = ["acceptTerms"]
        break
    }

    const isValid = await trigger(fieldsToValidate)
    return isValid
  }

  const goNext = async () => {
    const isValid = await validateStep()
    if (isValid) {
      setStep((s) => Math.min(total - 1, s + 1))
    }
  }

  const goPrev = () => {
    setStep((s) => Math.max(0, s - 1))
  }

  // Service handlers
  const handleToggleService = (id: string) => {
    const current = servicios || []
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id]
    setValue("servicios", updated, { shouldValidate: true })
  }

  const handleAddCustomService = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = `custom-${Date.now()}`
    setAvailableServices((prev) => [...prev, { id, name: trimmed, custom: true }])
    setValue("servicios", [...(servicios || []), id], { shouldValidate: true })
  }

  const handleEditService = (id: string, name: string) => {
    setAvailableServices((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)))
  }

  const handleDeleteService = (id: string) => {
    setAvailableServices((prev) => prev.filter((s) => s.id !== id))
    setValue(
      "servicios",
      (servicios || []).filter((x) => x !== id),
      { shouldValidate: true }
    )
  }

  // Payment handlers
  const handleTogglePayment = (method: "cash" | "qr" | "card") => {
    const current = { ...metodoPago }
    if (method === "cash") current.hasEfectivo = !current.hasEfectivo
    if (method === "qr") current.qr = !current.qr
    if (method === "card") current.tarjetaCredito = !current.tarjetaCredito

    setValue("metodoPago", current, { shouldValidate: true })
  }

  // Helper to convert object to array for the step component
  const getPaymentArray = () => {
    const arr: ("cash" | "qr" | "card")[] = []
    if (metodoPago?.hasEfectivo) arr.push("cash")
    if (metodoPago?.qr) arr.push("qr")
    if (metodoPago?.tarjetaCredito) arr.push("card")
    return arr
  }

  const onSubmit: SubmitHandler<FixerProfileData> = async (data) => {
    try {
      // Construct the payload matching IUser structure
      // We are updating the existing user, so we send the fields to update
      const payload = {
        ...user, // Keep existing user data
        role: "fixer" as const,
        ci: data.ci,
        url_photo: data.url_photo,
        workLocation: {
          lat: data.workLocation.lat,
          lng: data.workLocation.lng,
          direccion: data.workLocation.direccion || "",
          departamento: data.workLocation.departamento || "Cochabamba", // Default or derived
          pais: "Bolivia"
        },
        servicios: availableServices
          .filter((s) => data.servicios.includes(s.id))
          .map((s) => s.name), // The backend expects string array of names? Or IDs? 
        // User schema says: servicios: [{ type: String }]
        // Assuming names for now based on schema type String.
        metodoPago: data.metodoPago,
        vehiculo: data.vehiculo,
        acceptTerms: data.acceptTerms,
        experience: data.experience,
        // accountInfo is not in IUser, so we don't send it directly unless we add it to a field
        // Maybe it goes into experience or a new field? 
        // For now, ignoring accountInfo in payload as it's not in IUser schema provided.
      }

      console.log("Submitting user profile data:", payload)
      //await registerFixer(payload).unwrap()
      setSuccess(true)
    } catch (error) {
      console.error("Error registering fixer:", error)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="mx-auto w-full max-w-3xl animate-fade-in">
        <StepIndicator step={step} total={total} />
        {success ? (
          <Card title="¡Listo!">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-600 animate-scale-in" />
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {user.name} ahora está habilitado como FIXER.
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>CI: {ci}</p>
                <p>
                  Ubicación: {workLocation?.lat.toFixed(5)}, {workLocation?.lng.toFixed(5)}
                </p>
                <p>Servicios: {servicios?.length}</p>
                <p>Métodos de pago: {getPaymentArray().join(", ")}</p>
                <p>
                  Vehículo: {vehiculo?.hasVehiculo ? `Sí (${vehiculo.tipoVehiculo})` : "No"}
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  Estado: En revisión (pending)
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {step === 0 && (
              <ProfilePhotoStep
                photoUrl={url_photo}
                onPhotoChange={(url) => setValue("url_photo", url, { shouldValidate: true })}
                error={errors.url_photo?.message}
              />
            )}

            {step === 1 && (
              <CIStep
                ci={ci}
                onCIChange={(val) => setValue("ci", val, { shouldValidate: true })}
                error={errors.ci?.message}
              />
            )}

            {step === 2 && (
              <LocationStep
                location={workLocation}
                onLocationChange={(val) => setValue("workLocation", val, { shouldValidate: true })}
                error={errors.workLocation?.message || errors.workLocation?.lat?.message}
              />
            )}

            {step === 3 && (
              <ServicesStep
                services={availableServices}
                selectedServiceIds={servicios}
                onToggleService={handleToggleService}
                onAddCustomService={handleAddCustomService}
                onEditService={handleEditService}
                onDeleteService={handleDeleteService}
                error={errors.servicios?.message}
              />
            )}

            {step === 4 && (
              <PaymentStep
                payments={getPaymentArray()}
                accountInfo={accountInfo || ""}
                onTogglePayment={handleTogglePayment}
                onAccountInfoChange={(val) => setValue("accountInfo", val, { shouldValidate: true })}
                paymentsError={errors.metodoPago?.root?.message} // Check where error lands
                accountError={errors.accountInfo?.message}
              />
            )}

            {step === 5 && (
              <VehicleStep
                hasVehicle={vehiculo?.hasVehiculo}
                vehicleType={vehiculo?.tipoVehiculo}
                onHasVehicleChange={(val) => {
                  setValue("vehiculo.hasVehiculo", val, { shouldValidate: true })
                  if (!val) setValue("vehiculo.tipoVehiculo", undefined)
                }}
                onVehicleTypeChange={(val) => setValue("vehiculo.tipoVehiculo", val, { shouldValidate: true })}
                error={errors.vehiculo?.hasVehiculo?.message || errors.vehiculo?.tipoVehiculo?.message}
              />
            )}

            {step === 6 && (
              <TermsStep
                accepted={acceptTerms}
                onAcceptChange={(val) => setValue("acceptTerms", val, { shouldValidate: true })}
                error={errors.acceptTerms?.message}
              />
            )}

            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {errors.root.message}
              </div>
            )}

            <div className="flex items-center justify-between">
              <PillButton
                type="button"
                disabled={step === 0}
                onClick={goPrev}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Atrás
              </PillButton>
              {step < total - 1 ? (
                <PillButton
                  type="button"
                  onClick={goNext}
                  className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </PillButton>
              ) : (
                <PillButton
                  type="submit"
                  disabled={isSubmitting || !acceptTerms}
                  className="bg-primary text-white hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? "Registrando..." : "Registrar"}
                  <CheckCircle2 className="h-4 w-4" />
                </PillButton>
              )}
            </div>
          </form>
        )}
      </div>
    </FormProvider>
  )
}