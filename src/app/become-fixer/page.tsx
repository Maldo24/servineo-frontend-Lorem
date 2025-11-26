"use client"

import { useState } from "react"
import FixerRegisterForm from "@/componentsLumonis/fixer/Fixer-register-form"
import { FixerEnableWizard } from "@/componentsLumonis/fixer/Filter-eneable-wizard"


const defaultFormValues = {
  name: "Freddy Amin Zapata",
  email: "zapata@example.com",
  phone: "+591 68546043",
}

type RequesterUser = {
  id: string
  name: string
  email: string
  urlPhoto?: string
  role: "requester" | "fixer"
}

export default function BecomeFixerPage() {
  const [requester, setRequester] = useState<RequesterUser | null>(null)

  return (
    <div>
    <div className="container mx-auto max-w-4xl p-4">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Conviertete en un Fixer</h1>
        <p className="text-sm text-gray-500">Completa tu registro y habilita tu cuenta como FIXER</p>
      </header>

      <section className="space-y-6">
        <div className="neon-border glass-panel rounded-2xl border border-gray-200 p-4 shadow-sm animate-slide-up">
          <h2 className="mb-3 text-center text-lg font-semibold">Datos iniciales</h2>
          <FixerRegisterForm
            defaultValues={defaultFormValues}
            onSubmit={(data) => {
              const { name, email } = data
              const urlPhoto = "https://picsum.photos/80"
              setRequester({
                id: "req-1",
                name,
                email,
                urlPhoto,
                role: "requester",
              })
            }}
            submitButtonText="Continuar"
          />
        </div>
  
        {requester && (
          <div className="animate-fade-in">
            <FixerEnableWizard user={requester} />
          </div>
        )}
      </section>
    </div>
    </div>
  )
}