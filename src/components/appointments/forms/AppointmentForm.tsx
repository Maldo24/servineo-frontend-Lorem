// components/appointments/forms/AppointmentForm.tsx
import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";

export type AppointmentPayload = {
  datetime: string;
  client: string;
  contact: string;
  modality: "virtual" | "presencial";
  description?: string;
  place?: string;
  meetingLink?: string;
};

export type AppointmentFormHandle = {
  open: (datetimeISO: string, meta?: { eventId?: string; title?: string }) => void;
  close: () => void;
};

function genMeetingLink(datetimeISO: string) {
  const id = Math.random().toString(36).slice(2, 9);
  return `https://meet.example.com/${id}?t=${encodeURIComponent(datetimeISO)}`;
}

const AppointmentForm = forwardRef<AppointmentFormHandle>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [datetime, setDatetime] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [contact, setContact] = useState<string>("+591 ");
  const [modality, setModality] = useState<"virtual" | "presencial">("virtual");
  const [description, setDescription] = useState<string>("");
  const [place, setPlace] = useState<string>(""); 
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ eventId?: string; title?: string } | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    open: (dt: string, m?: { eventId?: string; title?: string }) => {
      setDatetime(dt);
      setMeta(m || null);
      setMeetingLink(genMeetingLink(dt));
      setOpen(true);
      setTimeout(() => firstFieldRef.current?.focus(), 40);
    },
    close: () => handleClose()
  }), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function handleClose() {
    setOpen(false);
    setClient("");
    setContact("+591 ");
    setModality("virtual");
    setDescription("");
    setPlace("");
    setMsg(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!client.trim()) return setMsg("Ingresa el nombre del cliente.");
    if (!contact.trim()) return setMsg("Ingresa un contacto válido.");

    const phoneRegex = /^[67]\d{7}$/; // empieza con 6 o 7 y 8 dígitos
    const phone = contact.replace(/\D/g, "").slice(-8);
    if (!phoneRegex.test(phone)) return setMsg("Teléfono debe iniciar con 6 o 7 y tener 8 dígitos.");

    const payload: AppointmentPayload = {
      datetime,
      client: client.trim(),
      contact: contact.trim(),
      modality,
      description: description.trim(),
    };

    if (modality === "presencial") payload.place = place.trim();
    else payload.meetingLink = meetingLink.trim() || genMeetingLink(datetime);

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datetime: payload.datetime,
          name: payload.client,
          phone: payload.contact,
          note: `${payload.modality === "virtual" ? "Virtual" : "Presencial"} - ${payload.description || ""}`.trim(),
          meta: {
            modality: payload.modality,
            place: payload.place,
            meetingLink: payload.meetingLink,
            eventId: meta?.eventId,
            eventTitle: meta?.title
          }
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.error || data?.message || "Error al guardar");
        setLoading(false);
        return;
      }

      const bookingId = data?.id || data?.insertedId || String(Date.now());
      window.dispatchEvent(new CustomEvent("booking:created", { detail: { datetime: payload.datetime, id: bookingId, meta: payload } }));

      setMsg("¡Cita creada!");
      setTimeout(() => { setLoading(false); handleClose(); }, 700);
    } catch (err: any) {
      console.error(err);
      setMsg("Error en la conexión.");
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="appointment-title"
        className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto overflow-auto" style={{ maxHeight: "90vh" }}>
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <h3 id="appointment-title" className="text-lg font-semibold text-black">
              Agendar cita {meta?.title ? `- ${meta.title}` : ""}
            </h3>
            <button aria-label="Cerrar" className="text-gray-500 hover:text-gray-700" onClick={handleClose}>✕</button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-black">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium">Fecha y hora</span>
                <input readOnly value={new Date(datetime).toLocaleString()} className="mt-1 block w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Modalidad</span>
                <select value={modality} onChange={(e) => setModality(e.target.value as "virtual" | "presencial")}
                  className="mt-1 block w-full border rounded px-3 py-2 text-sm">
                  <option value="virtual">Virtual</option>
                  <option value="presencial">Presencial</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium">Cliente *</span>
                <input ref={firstFieldRef} value={client} onChange={(e) => setClient(e.target.value)}
                  placeholder="Nombre del cliente" className="mt-1 block w-full border rounded px-3 py-2 bg-white" required />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Contacto *</span>
                <input value={contact} onChange={(e) => setContact(e.target.value)}
                  placeholder="+591 77777777" className="mt-1 block w-full border rounded px-3 py-2 bg-white" required />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">Descripción del trabajo</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descripción de lo que se requiere" className="mt-1 block w-full border rounded px-3 py-2 bg-white" rows={3} />
            </label>

            {modality === "presencial" ? (
              <label className="block">
                <span className="text-sm font-medium">Lugar / Dirección</span>
                <input value={place} onChange={(e) => setPlace(e.target.value)}
                  placeholder="Ej. Campus FCyT - Aula 12" className="mt-1 block w-full border rounded px-3 py-2 bg-white" />
              </label>
            ) : (
              <div className="space-y-2">
                <label className="block">
                  <span className="text-sm font-medium">Enlace de reunión (opcional)</span>
                  <input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.example.com/abcd" className="mt-1 block w-full border rounded px-3 py-2 bg-white" />
                </label>
                <p className="text-xs text-black-600">Si no ingresa enlace, se generará uno automáticamente.</p>
              </div>
            )}

            {msg && <p className="text-sm text-red-600">{msg}</p>}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={handleClose} className="px-4 py-2 rounded bg-gray-300 text-sm">Cancelar</button>
              <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-[#2B6AE0] text-white text-sm disabled:opacity-60">
                {loading ? "Guardando..." : "Añadir"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default AppointmentForm;
