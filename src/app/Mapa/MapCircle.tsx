'use client';

import { Circle } from 'react-leaflet';

interface MapCircleProps {
  center: [number, number];
  radius?: number;
}

export default function MapCircle({ center, radius = 5000 }: MapCircleProps) {
  return (
    <Circle center={center} radius={radius} pathOptions={{ color: 'blue', fillOpacity: 0.1 }} />
  );
}
