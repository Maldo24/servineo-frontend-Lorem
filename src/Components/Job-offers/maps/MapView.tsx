'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { JobOffer } from '@/app/lib/mock-data';
import { userLocation } from '@/app/lib/mock-data';
import { JobQuickInfo } from './JobQuickInfo';
import { MapPin, Minus, Plus } from 'lucide-react';
import type { Map, Marker, Circle } from 'leaflet';

interface MapViewProps {
  offers: JobOffer[];
  onOfferClick: (offer: JobOffer) => void;
}

export function MapView({ offers, onOfferClick }: MapViewProps) {
  const [isClient, setIsClient] = useState(false);
  const [hoveredOffer, setHoveredOffer] = useState<JobOffer | null>(null);
  const [radiusKm, setRadiusKm] = useState(1);
  const [offersInRadius, setOffersInRadius] = useState(0);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const userMarkerRef = useRef<Marker | null>(null);
  const circleRef = useRef<Circle | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringCardRef = useRef<boolean>(false);
  const currentHoveredOfferIdRef = useRef<string | null>(null);
  const pendingHoverRef = useRef<string | null>(null);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calcular ofertas dentro del radio actual
  const calculateOffersInRadius = useCallback(
    (currentRadius: number) => {
      const count = offers.filter((offer) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          offer.location.lat,
          offer.location.lng,
        );
        return distance <= currentRadius;
      }).length;
      setOffersInRadius(count);
    },
    [offers],
  );

  // Actualizar radio del círculo
  const updateCircleRadius = useCallback(
    (newRadius: number) => {
      if (circleRef.current) {
        circleRef.current.setRadius(newRadius * 1000); // convertir a metros
      }
      calculateOffersInRadius(newRadius);
    },
    [calculateOffersInRadius],
  );

  // Handlers para ajustar el radio
  const handleRadiusChange = useCallback(
    (newRadius: number) => {
      const clampedRadius = Math.max(0.5, Math.min(10, newRadius));
      setRadiusKm(clampedRadius);
      updateCircleRadius(clampedRadius);
    },
    [updateCircleRadius],
  );

  const increaseRadius = useCallback(() => {
    handleRadiusChange(radiusKm + 0.5);
  }, [radiusKm, handleRadiusChange]);

  const decreaseRadius = useCallback(() => {
    handleRadiusChange(radiusKm - 0.5);
  }, [radiusKm, handleRadiusChange]);

  const updateMarkers = useCallback(
    async (L: typeof import('leaflet'), map: Map, offersToShow: JobOffer[]) => {
      // Limpiar marcadores existentes de forma segura
      markersRef.current.forEach((marker) => {
        try {
          map.removeLayer(marker);
        } catch (error) {
          console.error('Error removing marker:', error);
        }
      });
      markersRef.current = [];

      // ========================================================================
      // 📍 MARCADORES OPTIMIZADOS CON MEJOR MANEJO DE HOVER
      // ========================================================================
      offersToShow.forEach((offer, index) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          offer.location.lat,
          offer.location.lng,
        ).toFixed(1);

        const markerIcon = L.divIcon({
          className: 'custom-offer-marker',
          html: `
          <div class="relative animate-in fade-in slide-in-from-bottom-4 duration-500" style="animation-delay: ${index * 100}ms">
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm"></div>
            <div class="relative group cursor-pointer">
              <div class="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-all duration-300"></div>
              <div class="relative w-12 h-12 bg-black/15 rounded-full border-4 border-white shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div class="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-300">
                ${offer.services.length}
              </div>
            </div>
          </div>
        `,
          iconSize: [48, 48],
          iconAnchor: [24, 48],
        });

        const marker = L.marker([offer.location.lat, offer.location.lng], {
          icon: markerIcon,
        }).addTo(map);

        // ========================================================================
        // 📍 EVENTOS HOVER OPTIMIZADOS - Mejor manejo de múltiples hover
        // ========================================================================
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.addEventListener('mouseenter', () => {
            // Limpiar cualquier timeout pendiente
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }

            // Si ya estamos mostrando esta oferta, no hacer nada
            if (currentHoveredOfferIdRef.current === offer.id) {
              return;
            }

            // Marcar como pendiente
            pendingHoverRef.current = offer.id;

            // Delay más corto para mejor responsividad
            hoverTimeoutRef.current = setTimeout(() => {
              // Verificar que sigue siendo la pendiente (no se canceló)
              if (pendingHoverRef.current === offer.id && !isHoveringCardRef.current) {
                currentHoveredOfferIdRef.current = offer.id;
                setHoveredOffer(offer);
              }
              pendingHoverRef.current = null;
            }, 100);
          });

          markerElement.addEventListener('mouseleave', () => {
            // Si este marcador era el pendiente, cancelarlo
            if (pendingHoverRef.current === offer.id) {
              pendingHoverRef.current = null;
            }

            // Limpiar timeout de entrada
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }

            // Solo ocultar si es el marcador actualmente mostrado
            if (currentHoveredOfferIdRef.current === offer.id) {
              // Delay antes de ocultar para permitir mover el mouse a la tarjeta
              hoverTimeoutRef.current = setTimeout(() => {
                if (!isHoveringCardRef.current && currentHoveredOfferIdRef.current === offer.id) {
                  currentHoveredOfferIdRef.current = null;
                  setHoveredOffer(null);
                }
              }, 150);
            }
          });
        }

        // Popup al hacer click
        marker.bindPopup(
          `<div class="text-center p-3">
          <p class="font-bold text-sm text-gray-800 mb-1">${offer.fixerName}</p>
          <p class="text-xs text-gray-600 mb-2">${offer.description}</p>
          <p class="text-xs text-primary font-semibold">${distance} km de distancia</p>
        </div>`,
          { className: 'custom-popup' },
        );

        markersRef.current.push(marker);
      });
    },
    [],
  ); // Dependencias: calculateDistance y userLocation son estables, pero si no, se pueden incluir

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    const initializeMap = async () => {
      const L = await import('leaflet');

      const map = L.map(mapRef.current!, {
        zoomControl: false,
      }).setView([userLocation.lat, userLocation.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Marcador de usuario
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative">
            <div class="absolute inset-0 w-10 h-10 -left-1 -top-1 bg-primary/30 rounded-full animate-ping"></div>
            <div class="relative w-8 h-8 bg-primary rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
      }).addTo(map);

      userMarker.bindPopup(
        `<div class="text-center p-3">
          <p class="font-bold text-sm text-blue-400 mb-1">Tu ubicación</p>
          <p class="text-xs text-gray-600">${userLocation.address}</p>
        </div>`,
        { className: 'custom-popup' },
      );

      userMarkerRef.current = userMarker;

      // Círculo dinámico con radio inicial
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        radius: radiusKm * 1000,
        weight: 2,
        opacity: 0.6,
      }).addTo(map);

      circleRef.current = circle;

      mapInstanceRef.current = map;
      updateMarkers(L, map, offers);
      calculateOffersInRadius(radiusKm);
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, offers, updateMarkers, radiusKm, calculateOffersInRadius]);

  // Efecto para actualizar marcadores cuando las ofertas cambian
  useEffect(() => {
    if (!isClient || !mapInstanceRef.current) return;

    const updateMarkersOnChange = async () => {
      const L = await import('leaflet');
      updateMarkers(L, mapInstanceRef.current!, offers);
    };

    updateMarkersOnChange();
  }, [offers, isClient, updateMarkers]);

  const handleShowMore = useCallback(
    (offer: JobOffer) => {
      // Limpiar todos los estados y timeouts
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      // Resetear todas las refs
      isHoveringCardRef.current = false;
      currentHoveredOfferIdRef.current = null;
      pendingHoverRef.current = null;

      onOfferClick(offer);
      setHoveredOffer(null);
    },
    [onOfferClick],
  );

  // Cleanup al desmontar componente
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // const handleRecenter = () => {
  //   if (mapInstanceRef.current) {
  //     mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14)
  //   }
  // }

  // Si no estamos en el cliente, mostrar un placeholder
  if (!isClient) {
    return (
      <div className='w-full h-full rounded-2xl overflow-hidden shadow-lg border border-blue-200 bg-gray-200 flex items-center justify-center'>
        <p>Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className='relative w-full h-full rounded-2xl overflow-hidden shadow-lg border border-blue-200'>
      <div ref={mapRef} className='w-full h-full relative' />

      {/* ======================================================================
          📍 PANEL "DETALLES DE LA OFERTA" (JobQuickInfo) - OPTIMIZADO
          ====================================================================== */}
      {hoveredOffer && (
        <div
          className='absolute top-4 left-1/4 -translate-x-1/2 z-[400] animate-in fade-in slide-in-from-top-4 duration-200 w-full max-w-sm px-4'
          onMouseEnter={() => {
            // Marcar que estamos sobre la tarjeta
            isHoveringCardRef.current = true;

            // Limpiar cualquier timeout de cierre
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            // Marcar que salimos de la tarjeta
            isHoveringCardRef.current = false;

            // Limpiar timeout anterior
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }

            // Delay corto para ocultar la tarjeta
            hoverTimeoutRef.current = setTimeout(() => {
              if (!isHoveringCardRef.current) {
                currentHoveredOfferIdRef.current = null;
                pendingHoverRef.current = null;
                setHoveredOffer(null);
              }
            }, 150);
          }}
        >
          <JobQuickInfo
            offer={hoveredOffer}
            onShowMore={() => handleShowMore(hoveredOffer)}
            distance={Number(
              calculateDistance(
                userLocation.lat,
                userLocation.lng,
                hoveredOffer.location.lat,
                hoveredOffer.location.lng,
              ).toFixed(1),
            )}
          />
        </div>
      )}

      {/* Botones de zoom */}
      <div className='absolute top-4 left-4 flex flex-col gap-0 z-[450] bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden'>
        <button
          onClick={handleZoomIn}
          className='w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-300'
          aria-label='Zoom in'
        >
          <span className='text-xl font-semibold leading-none'>+</span>
        </button>
        <button
          onClick={handleZoomOut}
          className='w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors'
          aria-label='Zoom out'
        >
          <span className='text-xl font-semibold leading-none'>−</span>
        </button>
      </div>

      {/* ======================================================================
          📍 PANEL DINÁMICO "DETALLES DEL MAPA" CON CONTROL DE RADIO
          ====================================================================== */}
      <div className='absolute bottom-4 right-4 bg-white/95 backdrop-blur-xl border border-blue-300 rounded-2xl p-4 shadow-2xl shadow-blue-500/20 z-[450] animate-in fade-in slide-in-from-right duration-500 max-w-xs'>
        <h4 className='font-bold text-sm text-primary mb-3 flex items-center gap-2'>
          <MapPin className='w-4 h-4' />
          Detalles del mapa
        </h4>
        <div className='space-y-2.5 text-sm'>
          <div className='flex items-center gap-3 group cursor-default'>
            <div className='relative'>
              <div className='w-5 h-5 rounded-full bg-primary border-2 border-white shadow-lg transition-transform duration-300 group-hover:scale-110' />
            </div>
            <span className='font-medium'>Tu ubicación</span>
          </div>
          <div className='flex items-center gap-3 group cursor-default'>
            <div className='relative'>
              <div className='w-5 h-5 rounded-full bg-black/20 border-2 border-white shadow-lg transition-transform duration-300 group-hover:scale-110' />
            </div>
            <span className='font-medium'>Ofertas de trabajo</span>
          </div>

          {/* Control de Radio */}
          <div className='pt-3 border-t border-blue-500/30 space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-700 text-xs font-medium'>Radio de búsqueda</span>
              <span className='text-primary text-sm font-bold'>{radiusKm.toFixed(1)} km</span>
            </div>

            {/* Slider */}
            <div className='relative'>
              <input
                type='range'
                min='0.5'
                max='10'
                step='0.5'
                value={radiusKm}
                onChange={(e) => handleRadiusChange(parseFloat(e.target.value))}
                className='w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all'
              />
              <div className='flex justify-between text-xs text-gray-400 mt-1'>
                <span>0.5km</span>
                <span>10km</span>
              </div>
            </div>

            {/* Botones +/- */}
            <div className='flex items-center justify-center gap-2'>
              <button
                onClick={decreaseRadius}
                disabled={radiusKm <= 0.5}
                className='w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-110'
                aria-label='Disminuir radio'
              >
                <Minus className='w-4 h-4' />
              </button>
              <span className='text-xs text-gray-500 min-w-[60px] text-center'>Ajustar radio</span>
              <button
                onClick={increaseRadius}
                disabled={radiusKm >= 10}
                className='w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-110'
                aria-label='Aumentar radio'
              >
                <Plus className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>

        {/* Contador de ofertas */}
        <div className='mt-3 pt-3 border-t border-blue-500/30'>
          <p className='text-xs font-semibold text-primary'>
            {offersInRadius} {offersInRadius === 1 ? 'oferta' : 'ofertas'} en el radio
          </p>
          <p className='text-xs text-gray-500 mt-1'>{offers.length} total disponibles</p>
        </div>
      </div>
    </div>
  );
}
