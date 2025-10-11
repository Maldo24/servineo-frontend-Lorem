"use client";
import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function DaySchedule({ fixerId = "fx-202" }) {
  const [date, setDate] = useState("2025-08-17");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const fetchDay = async (d) => {
    try {
      setLoading(true);
      setErr("");
      const res = await fetch(
        `${API}/fixers/${fixerId}/availability?fecha_Seleccionada=${d}`
      );
      if (!res.ok) throw new Error("No se pudo cargar la disponibilidad");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDay(date);
  }, []);

  const labelByEstado = (estado) => {
    switch (estado) {
      case "libre":
        return { text: "DISPONIBLE",cls:"text-emerald-600", icon: "＋" };
      case "ocupado":
        return { text: "RESERVADO",cls:"text-amber-500", icon: "✎" };
      case "no_disponible":
        return { text: "NO DISPONIBLE", cls: "text-slate-400", icon: null };
      default:
        return { text: "", cls: "", icon: null };
    }
  };

  return (
    <div className="mx-auto max-w-sm p-4">
      <h1 className="text-2xl font-semibold mb-3">
        Calendario de {data?.nombre_Fixer ?? "—"}
      </h1>

      <div className="mb-3">
        <label className="block text-sm mb-1">Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            const d = e.target.value;
            setDate(d);
            fetchDay(d);
          }}
          className="w-full rounded-lg border p-2"
        />
      </div>

      {loading && <div className="text-slate-500">Cargando…</div>}
      {err && <div className="text-red-600">{err}</div>}

      {data && (
        <div className="rounded-xl bg-slate-100 p-3">
          <div className="text-sm font-semibold text-slate-600 mb-2">
            {new Date(date).toLocaleDateString("es-BO", {
              day: "2-digit",
              month: "long",
            })}
          </div>

          <div className="space-y-2">
            {data.horarios?.map((item, idx) => {
              if (item.type === "banner") {
                return (
                  <div
                    key={`banner-${idx}`}
                    className="rounded-lg bg-rose-500 text-white text-center text-xs font-semibold py-2"
                  >
                    {item.text}
                  </div>
                );
              }

              const meta = labelByEstado(item.estado_Horario);

              return (
                <div
                  key={item.id_Horario}
                  className={`grid grid-cols-[64px_1fr_28px] items-center rounded-lg border bg-white px-3 py-2 shadow-sm ${
                    item.estado_Horario === "no_disponible" ? "opacity-60" : ""
                  }`}
                >
                  <div className="font-semibold text-slate-800">
                    {item.Hora_Inicio}
                  </div>
                  <div className={`text-sm font-semibold ${meta.cls}`}>
                    {meta.text}
                  </div>
                  <div className="text-xl text-slate-500 text-right">
                    {meta.icon}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
