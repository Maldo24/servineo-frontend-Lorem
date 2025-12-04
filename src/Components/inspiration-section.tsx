'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const inspirationProjects = [
  {
    id: 1,
    title: 'Soluciones expertas para tus tuberías',
    description: 'Reparación e instalación de plomería',
    category: 'PLOMERÍA',
    image: '/plomeria-profesional.jpg',
  },
  {
    id: 2,
    title: 'Transformación de espacios',
    description: 'Pintura interior y exterior de calidad',
    category: 'PINTURA',
    image: '/pintura-interior-moderna.jpg',
  },
  {
    id: 3,
    title: 'Muebles y carpintería a medida',
    description: 'Diseños personalizados para tu hogar',
    category: 'CARPINTERÍA',
    image: '/muebles-carpinteria.jpg',
  },
];

export function InspirationSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % inspirationProjects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + inspirationProjects.length) % inspirationProjects.length);
  };

  const project = inspirationProjects[currentSlide];

  return (
    <section className='py-16 px-4 bg-background'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
            Inspiración para tu hogar
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Descubre ideas y proyectos realizados por nuestros profesionales expertos
          </p>
        </div>

        {/* Carousel */}
        <div className='relative overflow-hidden rounded-2xl shadow-lg'>
          {/* Image */}
          <div className='relative h-96 w-full'>
            <Image
              src={project.image || '/placeholder.svg'}
              alt={project.title}
              fill
              className='object-cover'
            />
            {/* Dark overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
          </div>

          {/* Content overlay */}
          <div className='absolute inset-0 flex flex-col justify-between p-6 md:p-8'>
            <div>
              <span className='inline-block bg-primary/90 text-white px-3 py-1 rounded-md text-sm font-medium'>
                {project.category}
              </span>
            </div>
            <div>
              <h3 className='text-2xl md:text-4xl font-bold text-white mb-2 text-balance'>
                {project.title}
              </h3>
              <p className='text-white/90 text-lg'>{project.description}</p>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10'
            aria-label='Anterior'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
          <button
            onClick={nextSlide}
            className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-10'
            aria-label='Siguiente'
          >
            <ChevronRight className='w-6 h-6' />
          </button>

          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
            {inspirationProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-primary w-8' : 'bg-white/50 w-2'
                }`}
                aria-label={`Ir a proyecto ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
