'use client';

import { useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useState, useEffect } from 'react';

interface MapEventsProps {
  onClick?: (pos: LatLngExpression) => void;
  onMove?: (pos: LatLngExpression) => void;
  onZoom?: (zoom: number) => void;
}

export default function MapEvents({ onClick, onMove, onZoom }: MapEventsProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const map = useMapEvents({});

  const showOfflineMessage = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  // Escuchar cambios de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Habilitar/deshabilitar interacción del mapa según conexión
  useEffect(() => {
    if (!map) return;

    if (!isOnline) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    }
  }, [isOnline, map]);

  // Bloquear botones + y - del zoom cuando no hay conexión
  useEffect(() => {
    if (!map) return;

    const handleZoomStart = () => {
      if (!isOnline) {
        showOfflineMessage();
        map.setZoom(map.getZoom()); // mantener zoom
      }
    };

    map.on('zoomstart', handleZoomStart);

    return () => {
      map.off('zoomstart', handleZoomStart);
    };
  }, [isOnline, map]);

  // Manejar eventos del mapa
  useMapEvents({
    click: (e) => {
      if (!isOnline) {
        showOfflineMessage();
        return;
      }
      if (onClick) onClick([e.latlng.lat, e.latlng.lng]);
    },
    moveend: (e) => {
      if (!isOnline) {
        showOfflineMessage();
        e.target.setView(e.target.getCenter()); // mantener vista
        return;
      }
      if (onMove) onMove(e.target.getCenter());
    },
    zoomend: (e) => {
      if (!isOnline) {
        showOfflineMessage();
        e.target.setZoom(e.target.getZoom()); // mantener zoom
        return;
      }
      if (onZoom) onZoom(e.target.getZoom());
    },
  });

  return (
    <>
      {showMessage && (
        <div
          className='absolute top-4 left-1/2 -translate-x-1/2 z-[1000] text-white font-bold px-6 py-3 rounded-xl shadow-lg text-center transition-all duration-700 ease-in-out'
          style={{
            pointerEvents: 'none',
            backgroundColor: '#E74C3C',
            transform: showMessage ? 'translateY(0)' : 'translateY(-20px)',
            opacity: showMessage ? 1 : 0,
          }}
        >
          ⚠️ Sin conexión..
        </div>
      )}
    </>
  );
}
