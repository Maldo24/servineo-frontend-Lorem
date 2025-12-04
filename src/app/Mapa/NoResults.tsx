'use client';

import { Popup } from 'react-leaflet';

interface NoResultsProps {
  show: boolean;
  position: [number, number];
}

export default function NoResults({ show, position }: NoResultsProps) {
  //const map = useMap();

  if (!show) return null;

  return (
    <Popup
      position={position}
      autoPan={true}
      closeButton={false}
      className='
        bg-white px-6 py-3 rounded-full shadow-2xl
        border border-gray-200 font-semibold text-gray-800 text-center
      '
    >
      ⚠️ Sin resultados de fixers cercanos
    </Popup>
  );
}
