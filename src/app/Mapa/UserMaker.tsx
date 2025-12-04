'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface UserMarkerProps {
  position: [number, number];
}

export default function UserMarker({ position }: UserMarkerProps) {
  return (
    <Marker
      position={position}
      icon={L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
        iconSize: [40, 40],
      })}
    >
      <Popup>
        <span className='text-black font-bold'>📍 Estás aquí</span>
      </Popup>
    </Marker>
  );
}
