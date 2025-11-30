'use client';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
    iconUrl: markerIcon.src ?? markerIcon,
    shadowUrl: markerShadow.src ?? markerShadow,
});

interface MapViewProps {
    onSelect: (lat: number, lon: number) => void;
    markerPosition?: { lat: number; lon: number } | null;
}

export default function MapView({ onSelect, markerPosition }: MapViewProps) {
    return (
        <MapContainer
            center={[markerPosition?.lat || -17.39, markerPosition?.lon || -66.15]}
            zoom={13}
            style={{ height: 400, width: '100%' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MarkerHandler onSelect={onSelect} markerPosition={markerPosition} />
        </MapContainer>
    );
}

interface MarkerHandlerProps {
    onSelect: (lat: number, lon: number) => void;
    markerPosition?: { lat: number; lon: number } | null;
}

function MarkerHandler({ onSelect, markerPosition }: MarkerHandlerProps) {
    const [position, setPosition] = useState(markerPosition || null);

    useEffect(() => {
        setPosition(markerPosition || null);
    }, [markerPosition]);

    useMapEvents({
        click(e) {
            setPosition({ lat: e.latlng.lat, lon: e.latlng.lng });
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position ? (
        <Marker position={[position.lat, position.lon]} />
    ) : null;
}
