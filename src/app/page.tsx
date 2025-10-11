"use client";
import { useState } from "react";
import EditBookingModal from "../components/calendar/day/ModificarDatosCitaDireccionDescripcion";

export default function Home() {
  const [open, setOpen] = useState(true);
  return (
    <div className="min-h-screen bg-white p-6">
      <button onClick={() => setOpen(true)} className="rounded-xl bg-sky-600 px-4 py-2 text-white">
        Editar cita
      </button>

      {open && (
        <EditBookingModal
          bookingId="bk-913"
          onClose={() => setOpen(false)}
          onSaved={() => console.log("✅ Guardado")}
        />
      )}
    </div>
  );
}
