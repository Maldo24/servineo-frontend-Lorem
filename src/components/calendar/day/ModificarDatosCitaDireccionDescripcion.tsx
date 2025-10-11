"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";


type MapPickerModalProps = {
  open: boolean;
  initialLat?: number;
  initialLon?: number;
  apiBase: string;
  locationIqKey?: string;
  onClose: () => void;
  onConfirm: (picked: {
    lat: number;
    lon: number;
    display_name: string;
    place_id?: string;
    icon?: string;
  }) => void;
};

const MapPickerModal = dynamic(() => import("@/components/calendar/day/ModalUbicacionMapa"), {
  ssr: false,
  loading: () => <div>Cargando mapa...</div>
}) as React.ComponentType<MapPickerModalProps>;

const API = process.env.NEXT_PUBLIC_API_BASE_URL as string;
const LTK = process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN;

type CitaResponse = {
  Cita: {
    id_Cita: string;
    id_Fixer: string;
    id_Requester: string;
    fecha_Cita: string;
    estado_Fecha_Seleccionada: string;
    id_Horario: string;
  };
  DetalleCita: {
    id_Cita: string;
    estado_Cita: "Activo" | "Cancelado";
    modalidad_Cita: "Presencial" | "Virtual";
    descripcion_Cita: string;
    id_Ubicacion: string;
  };
  Requester: {
    id_Requester: string;
    nombre_Requester: string;
    numero_Requester: string;
  };
  Fixer: {
    idFixer: string;
    nombre_Fixer: string;
  };
  Horario: {
    id_Horario: string;
    Hora_Inicio: string;
    Hora_Fin: string;
    estado_Horario: "libre" | "ocupado" | "no_disponible";
  };
  Ubicacion: {
    id_Ubicacion: string;
    latitud_Ubicacion: number;
    longitud_Ubicacion: number;
    nombre_Ubicacion: string;
    direccion: string;
    provider?: string;
    place_id?: string;
    osm_type?: string;
    osm_id?: string;
    display_name?: string;
    icon?: string;
  };
  Requester_Ubicacion: {
    id_Ubicacion: string;
    id_Requester: string;
  };
};

type SearchItem = {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  icon?: string;
};

function formatFechaHora(iso: string) {
  const d = new Date(iso);
  const fmtFecha = d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const fmtHora = d.toLocaleTimeString("es-ES", {
    hour: "numeric",
    minute: "2-digit",
  });
  return { fmtFecha, fmtHora };
}

export default function EditBookingModal({
  bookingId,
  onClose,
  onSaved,
}: {
  bookingId: string;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState<CitaResponse | null>(null);

  const [ubicacionEditable, setUbicacionEditable] = useState(false);
  const [descEditable, setDescEditable] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [desc, setDesc] = useState("");

  const [pickedLoc, setPickedLoc] = useState<SearchItem | null>(null);
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API}/citas/${bookingId}`);
        const txt = await res.text();
        if (!res.ok) throw new Error(`No se pudo cargar la cita (HTTP ${res.status})`);
        const json: CitaResponse = JSON.parse(txt);
        setData(json);
        setDireccion(json.Ubicacion?.direccion ?? "");
        setDesc(json.DetalleCita?.descripcion_Cita ?? "");
      } catch (e) {
        if (e instanceof Error) setErr(e.message);
        else setErr("Error desconocido");
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId]);

  const titulo = useMemo(
    () => data?.Requester?.nombre_Requester ?? "—",
    [data]
  );
  const { fmtFecha, fmtHora } = useMemo(() => {
    if (!data) return { fmtFecha: "—", fmtHora: "—" };
    return formatFechaHora(data.Cita.fecha_Cita);
  }, [data]);

  async function handleSave() {
    if (!data) return;
    try {
      setSaving(true);
      setErr("");

      if (ubicacionEditable && (pickedLoc || direccion !== data.Ubicacion?.direccion)) {
        const body = {
          Ubicacion: {
            id_Ubicacion: data.DetalleCita.id_Ubicacion,
            nombre_Ubicacion: data.Ubicacion?.nombre_Ubicacion ?? "Ubicación",
            direccion: pickedLoc?.display_name ?? direccion,
            latitud_Ubicacion: pickedLoc ? Number(pickedLoc.lat) : data.Ubicacion?.latitud_Ubicacion,
            longitud_Ubicacion: pickedLoc ? Number(pickedLoc.lon) : data.Ubicacion?.longitud_Ubicacion,
            provider: LTK ? "locationiq" : "mock",
            place_id: pickedLoc?.place_id ?? data.Ubicacion?.place_id,
            display_name: pickedLoc?.display_name ?? data.Ubicacion?.display_name,
          },
        };

        const r1 = await fetch(`${API}/citas/${data.Cita.id_Cita}/ubicacion`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!r1.ok) throw new Error("No se pudo guardar la ubicación");
      }

      if (descEditable && desc !== data.DetalleCita.descripcion_Cita) {
        const r2 = await fetch(`${API}/citas/${data.Cita.id_Cita}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            DetalleCita: { 
              descripcion_Cita: desc, 
              modalidad_Cita: data.DetalleCita.modalidad_Cita 
            },
          }),
        });
        if (!r2.ok) throw new Error("No se pudo guardar la descripción");
      }

      onSaved?.();
      onClose();
    } catch (e) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const handleMapConfirm = (picked: {
    lat: number;
    lon: number;
    display_name: string;
    place_id?: string;
    icon?: string;
  }) => {
    setMapOpen(false);
    setPickedLoc({
      place_id: picked.place_id ?? "picked",
      display_name: picked.display_name,
      lat: String(picked.lat),
      lon: String(picked.lon),
    });
    setDireccion(picked.display_name);
    setUbicacionEditable(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-3xl font-semibold">{titulo}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 space-y-2 text-[15px]">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-xl">📅</span>
            <span>
              <span className="font-medium">Fecha:</span> {fmtFecha}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-xl">🕗</span>
            <span>
              <span className="font-medium">Hora de reunión:</span> {fmtHora}
            </span>
          </div>
        </div>

        {loading && <div className="text-slate-500">Cargando…</div>}
        {err && <div className="mb-3 text-sm text-rose-600">{err}</div>}

        {!loading && data && (
          <>
            <div className="mb-4">
              <label className="mb-1 block text-[15px] font-semibold text-slate-800">
                Ubicación:
                <button
                  type="button"
                  onClick={() => setMapOpen(true)}
                  className="ml-2 rounded-md p-1 text-slate-500 hover:bg-slate-100"
                  title="Editar en mapa"
                >
                  ✎
                </button>
              </label>

              <input
                value={direccion}
                readOnly
                className="w-full rounded-xl border bg-slate-100 p-2.5 text-[15px] text-slate-700"
              />
              <p className="mt-1 text-xs text-slate-500">
                Toca ✎ para mover el pin en el mapa y actualizar la dirección.
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-slate-800">
                <span>Descripción del trabajo</span>
                <button
                  type="button"
                  onClick={() => setDescEditable((v) => !v)}
                  className={`rounded-md p-1 ${
                    descEditable
                      ? "bg-amber-100 text-amber-700"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                  title={descEditable ? "Salir de edición" : "Editar"}
                >
                  ✎
                </button>
                {descEditable && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Editando
                  </span>
                )}
              </label>

              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                readOnly={!descEditable}
                rows={3}
                placeholder="Describe el trabajo…"
                className={`w-full resize-none rounded-xl border p-2.5 text-[15px] transition ${
                  descEditable
                    ? "bg-white ring-2 ring-sky-400 border-sky-300"
                    : "bg-slate-100 text-slate-600"
                }`}
              />
              {descEditable && (
                <div className="mt-1 text-xs text-slate-500">
                  Estás editando. Pulsa <b>Aceptar</b> para guardar los cambios.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl bg-slate-200 px-5 py-2.5 text-[15px] font-medium text-slate-700 hover:bg-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-2xl bg-sky-600 px-5 py-2.5 text-[15px] font-medium text-white hover:bg-sky-700 disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Aceptar"}
              </button>
            </div>

            {mapOpen && (
              <MapPickerModal
                open={mapOpen}
                apiBase={API}
                locationIqKey={LTK}
                initialLat={data?.Ubicacion?.latitud_Ubicacion ?? -16.5}
                initialLon={data?.Ubicacion?.longitud_Ubicacion ?? -68.15}
                onClose={() => setMapOpen(false)}
                onConfirm={handleMapConfirm}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}