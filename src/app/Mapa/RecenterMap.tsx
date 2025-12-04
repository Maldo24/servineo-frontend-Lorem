'use client';

import { useEffect, useState, useRef } from 'react';
import { useMap, Circle } from 'react-leaflet';

interface RecenterMapProps {
  position: [number, number];
}

export default function RecenterMap({ position }: RecenterMapProps) {
  const map = useMap();
  const [showPulse, setShowPulse] = useState(false);
  const prevPosition = useRef<[number, number] | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPosition.current = position;
      return;
    }

    if (
      !position ||
      (prevPosition.current &&
        position[0] === prevPosition.current[0] &&
        position[1] === prevPosition.current[1])
    ) {
      return;
    }

    prevPosition.current = position;

    map.flyTo(position, map.getZoom(), { animate: true, duration: 0.8, easeLinearity: 0.3 });

    setShowPulse(true);
    const timer = setTimeout(() => setShowPulse(false), 1200);

    return () => clearTimeout(timer);
  }, [position, map]);

  return (
    <>
      {showPulse && (
        <Circle
          center={position}
          radius={50}
          pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2, weight: 0 }}
        />
      )}
    </>
  );
}
