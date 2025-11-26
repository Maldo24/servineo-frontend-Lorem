"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
export type FormType = 'create' | 'edit' | 'view'
const MapView = dynamic(
    () => import("@/componentsLorem/maps/location/MapView"),
    {
        ssr: false,
        loading: () => (
            <div
                style={{ height: 400, width: "100%" }}
                className="flex items-center justify-center bg-gray-100"
            >
                <p>Cargando mapa...</p>
            </div>
        )
    }
);

interface LocationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (location: { lat: number; lon: number; address: string }) => void;
    initialCoords?: { lat: number; lon: number; address?: string } | null;
    formtype?: 'create' | 'edit' | 'view';
}

export default function LocationModal({ open, onClose, onConfirm, initialCoords, formtype }: LocationModalProps) {
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [address, setAddress] = useState<string>("");

    // Cuando el modal se abre, inicializa con initialCoords si existen
    useEffect(() => {
        if (open && initialCoords) {
            setCoords({ lat: initialCoords.lat, lon: initialCoords.lon });
            setAddress(initialCoords.address || "");
        }
    }, [open, initialCoords]);

    async function fetchAddress(lat: number, lon: number) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/location/reverse?lat=${lat}&lon=${lon}`);
            const data = await res.json();
            setAddress(data.display_name || "Dirección no disponible");
        } catch {
            setAddress("No se pudo obtener la dirección");
        }
    }

    function handleSelect(lat: number, lon: number) {
        setCoords({ lat, lon });
        fetchAddress(lat, lon);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden">
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Seleccionar ubicación</h3>
                    <MapView onSelect={handleSelect} markerPosition={coords} />

                    {coords && (
                        <p className="text-sm mt-3 text-gray-700">
                            <b>Dirección:</b> {address || "Cargando..."}
                        </p>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 text-black text-sm">Cancelar</button>
                        {
                            formtype !== 'view' ? (
                                <button
                                    onClick={() => coords && onConfirm({ ...coords, address })}
                                    disabled={!coords}
                                    className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
                                >
                                    Confirmar ubicación
                                </button>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
