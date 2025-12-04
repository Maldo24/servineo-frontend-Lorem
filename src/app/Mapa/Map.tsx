'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Fixer } from '@/Components/interface/Fixer_Interface';
import { Map as LeafletMapType } from 'leaflet';

import RecenterMap from './RecenterMap';
import UserMarker from './UserMaker';
import FixerMarker from './FixerMaker';
import MapEvents from './MapEvents';
import MapCircle from './MapCircle';
import LocationButton from './LocationButton';
import ResetMapButton from './ResetMapButton';
import { distanceKm } from '@/app/lib/utils/distance';

const defaultPosition: [number, number] = [-17.39381, -66.15693];

function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [map]);
  return null;
}

export default function Map() {
  const [fixers, setFixers] = useState<Fixer[]>([]);
  const [pinPosition, setPinPosition] = useState<[number, number]>(defaultPosition);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultPosition);
  const [zoom, setZoom] = useState(14);

  // Estado independiente para el círculo
  const [circleCenter, setCircleCenter] = useState<[number, number]>(pinPosition);

  // Mantenerlo actualizado cuando cambie pinPosition
  useEffect(() => {
    setCircleCenter(pinPosition);
  }, [pinPosition]);

  const [loading, setLoading] = useState(true);
  const mapRef = useRef<LeafletMapType | null>(null);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    import('@/jsons/fixers.json')
      .then((module) => setFixers(module.default))
      .catch(() => alert('No se pudieron cargar los fixers 😢'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const savedPin = localStorage.getItem('pinPosition');
    const savedCenter = localStorage.getItem('mapCenter');
    const savedZoom = localStorage.getItem('mapZoom');

    if (savedPin) setPinPosition(JSON.parse(savedPin));
    if (savedCenter) setMapCenter(JSON.parse(savedCenter));
    if (savedZoom) setZoom(Number(savedZoom));
  }, []);

  const savePin = (pos: [number, number]) => {
    localStorage.setItem('pinPosition', JSON.stringify(pos));
  };

  const saveView = (center: [number, number], zoomLevel: number) => {
    localStorage.setItem('mapCenter', JSON.stringify(center));
    localStorage.setItem('mapZoom', zoomLevel.toString());
  };

  const handleClick = (pos: L.LatLngExpression) => {
    const [lat, lng] = Array.isArray(pos) ? pos : [pos.lat, pos.lng];
    setPinPosition([lat, lng]);
    savePin([lat, lng]);
  };

  const handleMove = (center: L.LatLngExpression) => {
    const [lat, lng] = Array.isArray(center) ? center : [center.lat, center.lng];
    setMapCenter([lat, lng]);
    saveView([lat, lng], zoom);
  };

  const handleZoom = (newZoom: number) => {
    setZoom(newZoom);
    saveView(mapCenter, newZoom);
  };

  const nearbyFixers = fixers.filter(
    (f) => f.available && distanceKm(pinPosition, [f.lat, f.lng]) <= 5,
  );

  const handleReset = () => {
    const plaza: [number, number] = defaultPosition;
    setPinPosition(plaza);
    setMapCenter(plaza);
    setZoom(14);
    localStorage.removeItem('pinPosition');
    localStorage.removeItem('mapCenter');
    localStorage.removeItem('mapZoom');
  };
  // ====== Memoizar el círculo ======
  const memoizedCircle = useMemo(() => {
    return <MapCircle center={pinPosition} radius={5000} />;
  }, [pinPosition]);
  const initialMap = useMemo(
    () => ({
      center: mapCenter,
      zoom: zoom,
    }),
    [mapCenter, zoom], // <- ahora depende de ellos
  );

  useEffect(() => {
    const handleResize = () => {
      setMapKey((prev) => prev + 1);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div>Cargando mapa...</div>;

  return (
    <div className='relative z-0' style={{ height: '60vh', width: '100%', marginTop: '10px' }}>
      <ResetMapButton onReset={handleReset} isOnline={navigator.onLine} />

      <MapContainer
        center={initialMap.center}
        zoom={initialMap.zoom}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <MapResizeHandler />
        <RecenterMap position={mapCenter} />

        <UserMarker position={pinPosition} />
        <MapCircle center={circleCenter} radius={5000} />

        {nearbyFixers.map((f) => (
          <FixerMarker key={f.id} fixer={f} />
        ))}

        <MapEvents onClick={handleClick} onMove={handleMove} onZoom={handleZoom} />

        {nearbyFixers.length === 0 && (
          <Popup position={pinPosition} closeButton={false} autoPan={true}>
            <div className='text-black px-4 py-2 rounded-lg font-semibold text-center shadow-md min-w-[180px]'>
              ⚠️ No se encontraron fixers cercanos
            </div>
          </Popup>
        )}
      </MapContainer>

      <LocationButton
        onLocationFound={(lat, lng) => {
          setPinPosition([lat, lng]);
          savePin([lat, lng]);
          setMapCenter([lat, lng]);
          setZoom(15);
          saveView([lat, lng], 15);
        }}
      />
    </div>
  );
}
