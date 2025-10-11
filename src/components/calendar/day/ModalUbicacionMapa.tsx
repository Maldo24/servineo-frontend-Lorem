"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
} from "react-leaflet";
import type {
  Icon,
  LatLngTuple,
  LeafletMouseEvent,
  Map as LeafletMap,
} from "leaflet";
import L from "leaflet";

type Picked = {
  lat: number;
  lon: number;
  display_name: string;
  place_id?: string;
  icon?: string;
};

export default function MapPickerModal({
  open,
  initialLat = -16.5,
  initialLon = -68.15,
  onClose,
  onConfirm,
  apiBase,
  locationIqKey,
}: {
  open: boolean;
  initialLat?: number;
  initialLon?: number;
  apiBase: string;
  locationIqKey?: string;
  onClose: () => void;
  onConfirm: (p: Picked) => void;
}) {
  // Evitamos SSR: sólo renderizamos el mapa cuando existe window
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<LatLngTuple>([initialLat, initialLon]);
  const [label, setLabel] = useState("Buscando dirección…");
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => setMounted(true), []);

  const defaultIcon: Icon = useMemo(
    () =>
      new L.Icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    []
  );

  async function reverse(lat: number, lon: number) {
    try {
      setLoading(true);
      let url: string;
      if (locationIqKey) {
        url = `https://us1.locationiq.com/v1/reverse?key=${locationIqKey}&lat=${lat}&lon=${lon}&format=json`;
      } else {
        url = `${apiBase}/locations/reverse?lat=${lat}&lon=${lon}`; // tu mock
      }
      const res = await fetch(url);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error("reverse failed");
      setLabel(json.display_name || "Ubicación sin nombre");
      return json as { display_name: string; place_id?: string };
    } catch {
      setLabel("No se pudo identificar la dirección");
      return { display_name: "Dirección desconocida" };
    } finally {
      setLoading(false);
    }
  }

  // reverse geocoding al mover el marcador / hacer click
  useEffect(() => {
    const [lat, lon] = pos;
    void reverse(lat, lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos[0], pos[1]]);

  // Configurar eventos del mapa cuando esté listo
  useEffect(() => {
    if (map) {
      map.on("click", (e: LeafletMouseEvent) => {
        setPos([e.latlng.lat, e.latlng.lng]);
      });
    }
  }, [map]);

  function handleDragEnd(e: L.LeafletEvent) {
    const marker = e.target as L.Marker;
    const p = marker.getLatLng();
    setPos([p.lat, p.lng]);
  }

  // Early return después de todos los hooks
  if (!open || !mounted) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Confirmar Ubicación</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="mb-3 h-[340px] overflow-hidden rounded-2xl border">
          <MapContainer
            center={pos}
            zoom={16}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
            whenReady={() => setMap}
            ref={setMap}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <Marker
              position={pos}
              icon={defaultIcon}
              draggable
              eventHandlers={{ dragend: handleDragEnd }}
            />
          </MapContainer>
        </div>

        <div className="mb-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          <div className="font-medium">Dirección estimada</div>
          <div className="mt-1 text-slate-600">
            {loading ? "Buscando…" : label}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-200 px-5 py-2.5 text-[15px] font-medium text-slate-700 hover:bg-slate-300"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              const [lat, lon] = pos;
              onConfirm({
                lat,
                lon,
                display_name: label,
              });
            }}
            className="rounded-2xl bg-sky-600 px-5 py-2.5 text-[15px] font-medium text-white hover:bg-sky-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}