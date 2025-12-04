'use client';
import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { Location } from '../../../../types/job-request';

interface MapJobRequestProps {
  isEnabled: boolean;
  initialLocationObject: Location | null;
  onPositionChange: (position: Location) => void;
}

interface MapMouseEvent {
  latlng: {
    lat: number;
    lng: number;
  };
}

interface LeafletMap {
  setView: (center: [number, number], zoom: number) => void;
  on: (event: string, callback: (e: MapMouseEvent) => void) => void;
  off: (event: string, callback?: (e: MapMouseEvent) => void) => void;
  dragging: { enable: () => void; disable: () => void };
  touchZoom: { enable: () => void; disable: () => void };
  doubleClickZoom: { enable: () => void; disable: () => void };
  scrollWheelZoom: { enable: () => void; disable: () => void };
  boxZoom: { enable: () => void; disable: () => void };
  keyboard: { enable: () => void; disable: () => void };
  remove: () => void;
}

interface LeafletMarker {
  setLatLng: (latlng: [number, number]) => void;
  getLatLng: () => { lat: number; lng: number };
}

const MapJobRequest: React.FC<MapJobRequestProps> = ({
  isEnabled,
  initialLocationObject,
  onPositionChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const initialPosition = useMemo<[number, number]>(() => {
    if (!initialLocationObject) return [-16.5, -68.15];
    return [initialLocationObject.lat, initialLocationObject.lng];
  }, [initialLocationObject]);

  const handlePositionChange = useCallback(
    (position: Location) => {
      onPositionChange(position);
    },
    [onPositionChange],
  );

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (!isEnabled || !markerRef.current) return;

      const { lat, lng } = e.latlng;
      const newPosition: [number, number] = [lat, lng];

      markerRef.current.setLatLng(newPosition);

      handlePositionChange({
        lat: newPosition[0],
        lng: newPosition[1],
      });
    },
    [isEnabled, handlePositionChange],
  );

  const enableMap = useCallback(() => {
    const map = mapInstanceRef.current;

    if (map) {
      try {
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();

        map.on('click', handleMapClick);

        if (mapRef.current) {
          mapRef.current.style.pointerEvents = 'auto';
          mapRef.current.style.opacity = '1';
          mapRef.current.style.cursor = 'crosshair';
        }
      } catch (error) {
        console.error('Error enabling map:', error);
      }
    }
  }, [handleMapClick]);

  const disableMap = useCallback(() => {
    const map = mapInstanceRef.current;

    if (map) {
      try {
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();

        map.off('click', handleMapClick);

        if (mapRef.current) {
          mapRef.current.style.pointerEvents = 'none';
          mapRef.current.style.opacity = '0.6';
          mapRef.current.style.cursor = 'not-allowed';
        }
      } catch (error) {
        console.error('Error disabling map:', error);
      }
    }
  }, [handleMapClick]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      try {
        const L = await import('leaflet');

        if (!isMounted || !mapRef.current) return;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const map = L.map(mapRef.current).setView(initialPosition, 15);
        mapInstanceRef.current = map as unknown as LeafletMap;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const marker = L.marker(initialPosition, {
          draggable: false,
        }).addTo(map);
        markerRef.current = marker as unknown as LeafletMarker;

        if (isEnabled) {
          enableMap();
        } else {
          disableMap();
        }

        setMapReady(true);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    const timer = setTimeout(() => {
      initMap();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);

      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off('click', handleMapClick);
          mapInstanceRef.current.remove();
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
      setMapReady(false);
    };
  }, [enableMap, disableMap, handleMapClick, initialPosition, isEnabled]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !markerRef.current) return;

    try {
      markerRef.current.setLatLng(initialPosition);
      mapInstanceRef.current.setView(initialPosition, 15);
    } catch (error) {
      console.error('Error updating map position:', error);
    }
  }, [initialPosition, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    if (isEnabled) {
      enableMap();
    } else {
      disableMap();
    }
  }, [isEnabled, mapReady, enableMap, disableMap]);

  return (
    <div className='space-y-2'>
      <div ref={mapRef} className='h-64 w-full overflow-hidden rounded-md border border-gray-300' />
      {isEnabled && mapReady && (
        <p className='text-xs text-gray-600 text-center'>
          Haz click en cualquier lugar del mapa para colocar el marcador
        </p>
      )}
      {!mapReady && (
        <div className='flex h-64 items-center justify-center text-gray-500'>Cargando mapa...</div>
      )}
    </div>
  );
};

export default MapJobRequest;
