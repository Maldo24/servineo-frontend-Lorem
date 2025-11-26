"use client"

import { availableServices } from "@/app/lib/mock-data"
import { Check, Filter, X } from "lucide-react"

interface JobTypeFilterProps {
  selectedTypes: string[]
  onTypeToggle: (type: string) => void
  onClearAll: () => void
}

export function JobTypeFilter({ selectedTypes, onTypeToggle, onClearAll }: JobTypeFilterProps) {
  return (
    <div className="bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-xl border-2 border-border rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top duration-500">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Filtrar por tipo</h3>
            <p className="text-xs text-muted-foreground">Selecciona los servicios que buscas</p>
          </div>
        </div>

        {selectedTypes.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-all duration-300 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {availableServices.map((service, index) => {
          const isSelected = selectedTypes.includes(service)
          return (
            <button
              key={service}
              onClick={() => onTypeToggle(service)}
              className={`
                group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                hover:shadow-lg hover:-translate-y-0.5
                ${
                  isSelected
                    ? "bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30 scale-105"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted border-2 border-transparent hover:border-primary/20"
                }
              `}
              style={{
                animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
              }}
            >
              <span className="flex items-center justify-center gap-2">
                {isSelected && <Check className="w-4 h-4 animate-in zoom-in duration-300" />}
                <span className="truncate">{service}</span>
              </span>

              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
          )
        })}
      </div>

      {selectedTypes.length > 0 && (
        <div className="mt-5 pt-4 border-t border-border animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedTypes.length} {selectedTypes.length === 1 ? "tipo seleccionado" : "tipos seleccionados"}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedTypes.slice(0, 3).map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium border border-primary/20"
                >
                  {type}
                </span>
              ))}
              {selectedTypes.length > 3 && (
                <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium">
                  +{selectedTypes.length - 3} más
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
