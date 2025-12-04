'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/Components/Card';

interface Location {
  lat: number;
  lng: number;
}

interface LocationStepProps {
  location: Location | null;
  onLocationChange: (location: Location) => void;
  error?: string;
}

export function LocationStep({ location, onLocationChange, error }: LocationStepProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [manualLat, setManualLat] = useState(location?.lat.toString() || '');
  const [manualLng, setManualLng] = useState(location?.lng.toString() || '');
  const [outOfBounds, setOutOfBounds] = useState(false);

  const COCHABAMBA_BOUNDS = useMemo(
    () => ({
      north: -17.2,
      south: -17.6,
      east: -65.8,
      west: -66.4,
    }),
    [],
  );

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  const isInCochabamba = useCallback(
    (lat: number, lng: number): boolean => {
      return (
        lat >= COCHABAMBA_BOUNDS.south &&
        lat <= COCHABAMBA_BOUNDS.north &&
        lng >= COCHABAMBA_BOUNDS.west &&
        lng <= COCHABAMBA_BOUNDS.east
      );
    },
    [COCHABAMBA_BOUNDS],
  );

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const map = L.map(mapRef.current).setView([-17.3935, -66.157], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const bounds = L.latLngBounds(
      L.latLng(COCHABAMBA_BOUNDS.south, COCHABAMBA_BOUNDS.west),
      L.latLng(COCHABAMBA_BOUNDS.north, COCHABAMBA_BOUNDS.east),
    );
    map.setMaxBounds(bounds);
    map.on('drag', () => {
      map.panInsideBounds(bounds, { animate: false });
    });

    let marker: L.Marker | null = null;
    if (location && isInCochabamba(location.lat, location.lng)) {
      marker = L.marker([location.lat, location.lng]).addTo(map);
      map.setView([location.lat, location.lng], 15);
      setOutOfBounds(false);
    }

    map.on('click', (e: L.LeafletEvent) => {
      const { lat, lng } = e.latlng;
      if (!isInCochabamba(lat, lng)) {
        setOutOfBounds(true);

        if (marker) {
          map.removeLayer(marker);
          marker = null;
        }
        onLocationChange({ lat: 0, lng: 0 });
        setManualLat('');
        setManualLng('');
        return;
      }

      setOutOfBounds(false);

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lng]).addTo(map);

      onLocationChange({ lat, lng });
      setManualLat(lat.toFixed(6));
      setManualLng(lng.toFixed(6));
    });

    return () => {
      map.remove();
    };
  }, [mapLoaded, location, onLocationChange, isInCochabamba, COCHABAMBA_BOUNDS]);

  const handleManualUpdate = () => {
    const lat = Number.parseFloat(manualLat);
    const lng = Number.parseFloat(manualLng);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      if (isInCochabamba(lat, lng)) {
        setOutOfBounds(false);
        onLocationChange({ lat, lng });
      } else {
        setOutOfBounds(true);
      }
    }
  };

  return (
    <Card title='Registrar ubicación de trabajo'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <p className='text-sm text-gray-700'>
            Haz clic en el mapa para seleccionar tu ubicación de trabajo{' '}
            <strong>solo en la región de Cochabamba</strong>
          </p>
          <div className='rounded-lg bg-amber-50 p-3 border border-amber-200'>
            <p className='text-sm text-amber-800 font-medium'>⚠️ Restricción de ubicación</p>
            <p className='text-xs text-amber-700 mt-1'>
              Solo puedes seleccionar ubicaciones dentro del departamento de Cochabamba, Bolivia.
            </p>
          </div>
          <div ref={mapRef} className='h-80 w-full rounded-xl border border-gray-300 bg-gray-100' />
        </div>

        {outOfBounds && (
          <div className='rounded-lg bg-red-50 p-3 border border-red-200'>
            <p className='text-sm text-red-800 font-medium'>Ubicación fuera de Cochabamba</p>
            <p className='text-xs text-red-700 mt-1'>
              La ubicación seleccionada está fuera de la región de Cochabamba. Por favor, selecciona
              una ubicación dentro del departamento.
            </p>
          </div>
        )}

        {location && location.lat !== 0 && location.lng !== 0 && (
          <div className='space-y-2 rounded-lg bg-blue-50 p-3'>
            <p className='text-sm font-medium text-blue-900'>Ubicación seleccionada:</p>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label className='text-xs text-blue-700'>Latitud</label>
                <input
                  type='number'
                  step='0.000001'
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className='w-full rounded-md border border-blue-200 bg-white px-2 py-1 text-sm'
                />
              </div>
              <div>
                <label className='text-xs text-blue-700'>Longitud</label>
                <input
                  type='number'
                  step='0.000001'
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className='w-full rounded-md border border-blue-200 bg-white px-2 py-1 text-sm'
                />
              </div>
            </div>
            <button
              type='button'
              onClick={handleManualUpdate}
              className='w-full rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
            >
              Actualizar ubicación
            </button>
          </div>
        )}

        {error && <p className='text-sm text-red-600'>{error}</p>}
      </div>
    </Card>
  );
}
