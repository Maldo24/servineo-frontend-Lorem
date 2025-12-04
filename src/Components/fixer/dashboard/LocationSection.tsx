'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Edit2, Check, X, Loader2 } from 'lucide-react';
import { PillButton } from '../Pill-button';
import NotificationModal from '@/Components/Modal-notifications';
import { useUpdateLocationMutation } from '@/app/redux/services/userApi';

interface Location {
  lat: number;
  lng: number;
  direccion?: string;
}

interface LocationSectionProps {
  readOnly?: boolean;
  fixerId?: string;
  currentLocation: {
    lat: number;
    lng: number;
    direccion?: string;
  };
}

// Tipos de Leaflet
type LeafletMap = L.Map;
type LeafletMarker = L.Marker;
type LeafletMouseEvent = L.LeafletMouseEvent;

declare global {
  interface Window {
    L: typeof import('leaflet');
  }
}

export function LocationSection({
  readOnly = false,
  fixerId,
  currentLocation,
}: LocationSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    currentLocation || null,
  );
  const [manualLat, setManualLat] = useState(currentLocation?.lat.toString() || '');
  const [manualLng, setManualLng] = useState(currentLocation?.lng.toString() || '');
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
    title: '',
    message: '',
  });

  const [updateLocation, { isLoading: isUpdating }] = useUpdateLocationMutation();

  const COCHABAMBA_BOUNDS = useMemo(
    () => ({
      north: -17.2,
      south: -17.6,
      east: -65.8,
      west: -66.4,
    }),
    [],
  );

  // Cargar Leaflet CSS y JS
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

  // Inicializar mapa
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map: LeafletMap = window.L.map(mapRef.current).setView(
      selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [-17.3935, -66.157],
      selectedLocation ? 15 : 13,
    );

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const bounds = window.L.latLngBounds(
      window.L.latLng(COCHABAMBA_BOUNDS.south, COCHABAMBA_BOUNDS.west),
      window.L.latLng(COCHABAMBA_BOUNDS.north, COCHABAMBA_BOUNDS.east),
    );
    map.setMaxBounds(bounds);
    map.on('drag', () => {
      map.panInsideBounds(bounds, { animate: false });
    });

    let marker: LeafletMarker | null = null;

    if (selectedLocation && isInCochabamba(selectedLocation.lat, selectedLocation.lng)) {
      marker = window.L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(map);
      setOutOfBounds(false);
    }

    // Solo permitir clicks si está en modo edición y no es readOnly
    if (!readOnly && isEditing) {
      map.on('click', (e: L.LeafletEvent) => {
        const mouseEvent = e as LeafletMouseEvent;
        const { lat, lng } = mouseEvent.latlng;

        if (!isInCochabamba(lat, lng)) {
          setOutOfBounds(true);
          return;
        }

        setOutOfBounds(false);

        if (marker) {
          map.removeLayer(marker);
        }

        marker = window.L.marker([lat, lng]).addTo(map);

        setSelectedLocation({ lat, lng });
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));
      });
    }

    return () => {
      map.remove();
    };
  }, [mapLoaded, selectedLocation, isEditing, readOnly, isInCochabamba, COCHABAMBA_BOUNDS]);

  const handleManualUpdate = () => {
    const lat = Number.parseFloat(manualLat);
    const lng = Number.parseFloat(manualLng);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      if (isInCochabamba(lat, lng)) {
        setOutOfBounds(false);
        setSelectedLocation({ lat, lng });
      } else {
        setOutOfBounds(true);
      }
    }
  };

  const handleSave = async () => {
    if (!fixerId || !selectedLocation) return;

    try {
      await updateLocation({
        id: fixerId,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          direccion: selectedLocation.direccion || '',
        },
      }).unwrap();

      setNotification({
        isOpen: true,
        type: 'success',
        title: '¡Éxito!',
        message: 'Ubicación actualizada correctamente',
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar la ubicación',
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedLocation(currentLocation || null);
    setManualLat(currentLocation?.lat.toString() || '');
    setManualLng(currentLocation?.lng.toString() || '');
    setOutOfBounds(false);
  };

  if (!fixerId) {
    return (
      <div className='p-4 text-center text-gray-500'>
        No se puede cargar la ubicación sin un perfil de fixer.
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        autoClose
        autoCloseDelay={3000}
      />

      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
          <MapPin className='h-5 w-5 text-blue-600' />
          {readOnly ? 'Ubicación de Trabajo' : 'Mi Ubicación de Trabajo'}
        </h2>
        {!readOnly && !isEditing && (
          <PillButton
            onClick={() => setIsEditing(true)}
            className='bg-primary text-white hover:bg-blue-800 flex items-center gap-2'
          >
            <Edit2 className='h-4 w-4' />
            Editar Ubicación
          </PillButton>
        )}
      </div>

      {/* Información */}
      <div className='space-y-4'>
        {isEditing && (
          <div className='rounded-lg bg-amber-50 p-3 border border-amber-200'>
            <p className='text-sm text-amber-800 font-medium'>⚠️ Restricción de ubicación</p>
            <p className='text-xs text-amber-700 mt-1'>
              Solo puedes seleccionar ubicaciones dentro del departamento de Cochabamba, Bolivia.
              Haz clic en el mapa para actualizar tu ubicación.
            </p>
          </div>
        )}

        {/* Mapa */}
        <div
          ref={mapRef}
          className={`h-96 w-full rounded-xl border ${isEditing ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} bg-gray-100 ${!mapLoaded ? 'flex items-center justify-center' : ''}`}
        >
          {!mapLoaded && <Loader2 className='animate-spin h-8 w-8 text-blue-600' />}
        </div>

        {/* Mensaje de fuera de límites */}
        {outOfBounds && isEditing && (
          <div className='rounded-lg bg-red-50 p-3 border border-red-200'>
            <p className='text-sm text-red-800 font-medium'>Ubicación fuera de Cochabamba</p>
            <p className='text-xs text-red-700 mt-1'>
              La ubicación seleccionada está fuera de la región de Cochabamba. Por favor, selecciona
              una ubicación dentro del departamento.
            </p>
          </div>
        )}

        {/* Coordenadas actuales */}
        {selectedLocation && selectedLocation.lat !== 0 && selectedLocation.lng !== 0 && (
          <div className='space-y-2 rounded-lg bg-blue-50 p-4'>
            <p className='text-sm font-medium text-blue-900'>
              {isEditing ? 'Ubicación seleccionada:' : 'Ubicación actual:'}
            </p>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='text-xs font-medium text-blue-700 block mb-1'>Latitud</label>
                <input
                  type='number'
                  step='0.000001'
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  disabled={!isEditing}
                  className='w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-600'
                />
              </div>
              <div>
                <label className='text-xs font-medium text-blue-700 block mb-1'>Longitud</label>
                <input
                  type='number'
                  step='0.000001'
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  disabled={!isEditing}
                  className='w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-600'
                />
              </div>
            </div>
            {isEditing && (
              <button
                type='button'
                onClick={handleManualUpdate}
                className='w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors'
              >
                Actualizar desde coordenadas
              </button>
            )}
          </div>
        )}

        {/* Sin ubicación */}
        {!selectedLocation && (
          <div className='text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50'>
            <MapPin className='h-12 w-12 text-gray-400 mx-auto mb-2' />
            <p className='text-gray-500 text-sm'>
              {readOnly
                ? 'Este fixer aún no ha registrado su ubicación de trabajo.'
                : 'Aún no has registrado tu ubicación de trabajo.'}
            </p>
            {!readOnly && !isEditing && (
              <PillButton
                onClick={() => setIsEditing(true)}
                className='mt-4 bg-primary text-white hover:bg-blue-800'
              >
                Agregar Ubicación
              </PillButton>
            )}
          </div>
        )}

        {/* Botones de acción en modo edición */}
        {isEditing && (
          <div className='flex justify-end gap-3'>
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50'
            >
              <X className='h-4 w-4' />
              Cancelar
            </button>
            <PillButton
              onClick={handleSave}
              disabled={isUpdating || !selectedLocation || outOfBounds}
              className='bg-primary text-white hover:bg-blue-800 flex items-center gap-2 disabled:opacity-50'
            >
              {isUpdating ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className='h-4 w-4' />
                  Guardar Ubicación
                </>
              )}
            </PillButton>
          </div>
        )}
      </div>
    </div>
  );
}
