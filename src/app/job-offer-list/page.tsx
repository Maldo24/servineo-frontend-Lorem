"use client"

import { useState, useEffect, useMemo } from "react"
import { mockJobOffers } from "../lib/mock-data"
import { JobOffer } from "../lib/mock-data"
import { JobOfferCard } from "@/componentsLumonis/Job-offers/Job-offer-card"
import { JobOfferModal } from "@/componentsLumonis/Job-offers/Job-offer-modal"
import { MapView } from "@/componentsLumonis/Job-offers/maps/MapView"
import { SearchHeader } from "@/componentsLumonis/SearchHeader"
import { FiltersPanel } from "@/componentsLumonis/FiltersPanel"
import { useAppSelector } from "../redux/hooks"
import {
  selectSearchQuery,
  selectSelectedCities,
  selectSelectedJobTypes,
} from "../redux/slice/filterSlice"
import { Briefcase, Map, List, ChevronLeft, ChevronRight } from "lucide-react"


export default function JobOffersPage() {
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  useEffect(() => {
    setOffers(mockJobOffers)
  }, [])

  
  const searchQuery = useAppSelector(selectSearchQuery)
  const selectedCities = useAppSelector(selectSelectedCities)
  const selectedJobTypes = useAppSelector(selectSelectedJobTypes)
  

  
  const filteredOffers = useMemo(() => {
    return [...offers]
      .filter((offer) => {
        const matchesSearch =
          !searchQuery ||
          (offer.description && offer.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (offer.fixerName && offer.fixerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (offer.tags && offer.tags.some(tag => 
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ))

        const matchesCity = 
          selectedCities.length === 0 || 
          (offer.city && selectedCities.includes(offer.city))

        const matchesJobType = 
          selectedJobTypes.length === 0 || 
          (offer.services && offer.services.some(service => 
            selectedJobTypes.includes(service)
          ))

        return matchesSearch && matchesCity && matchesJobType
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [offers, searchQuery, selectedCities, selectedJobTypes])


  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCities, selectedJobTypes])

  const handleCardClick = (offer: JobOffer) => {
    setSelectedOffer(offer)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col justify-center md:flex-row md:items-center gap-4">
            <div className="flex items-center bg-gray-50 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === "list" 
                    ? "bg-white shadow-sm text-primary" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List className="w-4 h-4" />
                <span>Lista</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === "map" 
                    ? "bg-white shadow-sm text-primary" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Mapa</span>
              </button>
            </div>
          </div>

          <div className="mt-4">
            <SearchHeader />
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <div className="hidden md:block w-full md:w-80 flex-shrink-0 border-r border-gray-100 bg-white p-4">
          <FiltersPanel />
        </div>

        
        <div className="md:hidden p-4 border-b border-gray-100">
          <FiltersPanel />
        </div>

        
        <main className="flex-1 p-4 bg-gray-50 min-h-[calc(100vh-180px)]">
          {viewMode === "list" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedOffers.map((offer, index) => (
                  <div 
                    key={index} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <JobOfferCard 
                      offer={offer} 
                      onClick={() => handleCardClick(offer)} 
                    />
                  </div>
                ))}
              </div>

              
              {filteredOffers.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-primary text-white'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="h-[calc(100vh-250px)] rounded-lg overflow-hidden border border-gray-200 bg-white">
              <MapView 
                offers={filteredOffers} 
                onOfferClick={handleCardClick} 
              />
            </div>
          )}

          {filteredOffers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No se encontraron ofertas</h3>
              <p className="text-gray-500 mt-1">
                No hay ofertas que coincidan con tu búsqueda o filtros actuales.
              </p>
            </div>
          )}
        </main>
      </div>

      <JobOfferModal 
        offer={selectedOffer} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}