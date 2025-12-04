'use client';

import { useState, useEffect, TouchEvent } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { StaticImageData } from 'next/image';

import carpinteriaImg from '../../../public/es/img/carpinteria.png';
import electricistaImg from '../../../public/es/img/electricista.png';
import limpiezaImg from '../../../public/es/img/limpieza.png';
import pinturaImg from '../../../public/es/img/pintura.png';
import plomeriaImg from '../../../public/es/img/plomeria.png';
import fallbackImg from '../../../public/fallback-image.svg';

interface Slide {
  image: StaticImageData | string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: carpinteriaImg,
    category: 'CARPINTERÍA',
    title: 'Muebles y carpintería a medida',
    subtitle: 'Carpintería y muebles a medida',
    description: 'Profesionales especializados en trabajos de carpintería y muebles personalizados',
  },
  {
    image: electricistaImg,
    category: 'ELECTRICIDAD',
    title: 'Soluciones eléctricas seguras',
    subtitle: 'Instalaciones y reparaciones eléctricas',
    description: 'Expertos en instalaciones eléctricas residenciales e industriales',
  },
  {
    image: limpiezaImg,
    category: 'LIMPIEZA',
    title: 'Espacios impecables, vida saludable',
    subtitle: 'Servicios de limpieza profesional',
    description: 'Limpieza completa para hogares y oficinas con productos eco-amigables',
  },
  {
    image: pinturaImg,
    category: 'PINTURA',
    title: 'Renueva tus espacios con color',
    subtitle: 'Pintura de interiores y exteriores',
    description: 'Transforma tu hogar con colores que reflejan tu personalidad',
  },
  {
    image: plomeriaImg,
    category: 'PLOMERÍA',
    title: 'Soluciones expertas para tus tuberías',
    subtitle: 'Reparación e instalación de plomería',
    description: 'Soluciones rápidas y efectivas para todos tus problemas de plomería',
  },
];

const PREFETCH_TIMEOUT_MS = 3000;
const fallbackSrc = fallbackImg;
const blurDataURL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9J2cnIHgxPScwJyB5MT0nMCcgeDI9JzEnIHkyPScxJz48c3RvcCBvZmZzZXQ9JzAnIHN0b3AtY29sb3I9JyMwZWF1ZWUnLz48c3RvcCBvZmZzZXQ9JzEnIHN0b3AtY29sb3I9JyMxZTNhOGEnLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgZmlsbD0ndXJsKCNnKScvPjwvc3ZnPiI=';

export default function InspirationSection() {
  const t = useTranslations('Inspiration');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [failedMap, setFailedMap] = useState<Record<number, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(slides.map((_, i) => [i, true])),
  );

  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // Preload images
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preloadIndexes = [
      currentIndex,
      (currentIndex + 1) % slides.length,
      (currentIndex - 1 + slides.length) % slides.length,
    ];

    preloadIndexes.forEach((index) => {
      try {
        const img = new window.Image();
        let settled = false;
        const timer = window.setTimeout(() => {
          if (!settled) {
            setFailedMap((prev) => ({ ...prev, [index]: true }));
          }
        }, PREFETCH_TIMEOUT_MS);

        img.onload = () => {
          settled = true;
          window.clearTimeout(timer);
        };
        img.onerror = () => {
          settled = true;
          window.clearTimeout(timer);
          setFailedMap((prev) => ({ ...prev, [index]: true }));
        };
        const src =
          typeof slides[index].image === 'string' ? slides[index].image : slides[index].image.src;
        img.src = src;
      } catch {
        setFailedMap((prev) => ({ ...prev, [index]: true }));
      }
    });
  }, [currentIndex]);

  // Touch handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      nextSlide();
    }
    if (touchStart - touchEnd < -150) {
      prevSlide();
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <section className='py-16 px-4 bg-white'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>{t('insTitle')}</h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>{t('insDescription')}</p>
        </div>

        {/* Carousel */}
        <div
          className='carrusel-container'
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, index) => (
            <div key={index} className={`carrusel-slide ${index === currentIndex ? 'active' : ''}`}>
              <Image
                src={failedMap[index] ? fallbackSrc : slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: 'cover' }}
                className='carrusel-image'
                priority={index === 0}
                placeholder='blur'
                blurDataURL={blurDataURL}
                onError={() => {
                  setFailedMap((prev) => ({ ...prev, [index]: true }));
                }}
                onLoad={() => {
                  setLoadingMap((prev) => ({ ...prev, [index]: false }));
                }}
              />

              {loadingMap[index] && <div className='carrusel-skeleton' />}

              <div className='carrusel-overlay'></div>
              <div className='carrusel-content'>
                <span className='carrusel-category bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm [text-shadow:_0_0_8px_black,_0_0_4px_black,_0_0_2px_black]'>
                  {slide.category}
                </span>

                <div className='carrusel-text-group'>
                  <h2 className='carrusel-title text-white font-bold text-3xl md:text-5xl [text-shadow:_0_0_20px_black,_0_0_12px_black,_0_0_6px_black,_0_0_3px_black]'>
                    {slide.title}
                  </h2>

                  <p className='carrusel-subtitle text-white font-medium text-lg md:text-xl [text-shadow:_0_0_12px_black,_0_0_6px_black,_0_0_3px_black]'>
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={prevSlide}
            className='carrusel-arrow carrusel-arrow-left'
            aria-label='Diapositiva anterior'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
          <button
            onClick={nextSlide}
            className='carrusel-arrow carrusel-arrow-right'
            aria-label='Diapositiva siguiente'
          >
            <ChevronRight className='w-6 h-6' />
          </button>
          <div className='carrusel-dots'>
            {slides.map((_, index) => (
              <span
                key={index}
                className={`carrusel-dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
