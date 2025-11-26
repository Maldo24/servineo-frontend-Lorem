// src\Components\Shared\ImageCarousel.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageCarouselProps {
  images: string[]
  alt: string
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  const handlePrevious = () => {
    setCurrentIndex((current) => (current - 1 + images.length) % images.length)
  }

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % images.length)
  }

  if (!images.length) {
    return null
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden group">
      <Image
        src={images[currentIndex]}
        alt={`${alt} - Imagen ${currentIndex + 1}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
      />
      
      {images.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-3"
                    : "bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )

}