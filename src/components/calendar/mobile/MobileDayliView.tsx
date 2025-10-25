// components/calendar/HorarioDelDia.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AppointmentForm from "../../appointments/forms/AppointmentForm";
import type { AppointmentFormHandle } from "../../appointments/forms/AppointmentForm";
import EditAppointmentForm from "../../appointments/forms/EditAppointmentForm";
<<<<<<< Updated upstream
import type { EditAppointmentFormHandle, ExistingAppointment } from "../../appointments/forms/EditAppointmentForm";

const API_BASE = "https://servineo-backend-lorem.onrender.com";
const EP_BOOKED = `${API_BASE}/api/crud_read/schedules/get_by_fixer_current_requester_day`;
const EP_OCCUPIED = `${API_BASE}/api/crud_read/schedules/get_by_fixer_other_requesters_day`;
const NOMBRE_FIXER_POR_DEFECTO = "John";

interface PropiedadesHorarioDia {
  fixerId: string;
  requesterId: string;
  selectedDate: Date | string | null;
}

type Estado = "libre" | "reservado_propio" | "ocupado_otro" | "no_disponible";

interface HorarioItem {
  id_Horario: string;
  Hora_Inicio: string;
  estado_Horario: Estado;
  type?: "banner";
  text?: string;
}

interface DatosDia {
  nombre_Fixer?: string;
  horarios?: HorarioItem[];
=======
import DatePicker from "../../list/DatePicker/DatePicker";
import type {
    EditAppointmentFormHandle,
    ExistingAppointment,
} from "../../appointments/forms/EditAppointmentForm";
const AVAILABILITY_URL =
    "https://servineo-backend-lorem.onrender.com/api/crud_read/appointments/get_meeting_status";
const DEFAULT_FIXER_NAME = "John";
interface DayScheduleProps {
    fixerId: string;
    requesterId: string;
    selectedDate: Date | string | null;
    onDateChange?: (newDate: Date) => void;
}
interface HorarioItem {
    id_Horario: string;
    Hora_Inicio: string;
    estado_Horario: "libre" | "ocupado" | "no_disponible";
    cliente?: string;
    contacto?: string;
    modalidad?: "virtual" | "presencial";
    descripcion?: string;
    lugar?: string;
    meetingLink?: string;
    type?: "banner";
    text?: string;
}

interface DayData {
    nombre_Fixer?: string;
    horarios?: HorarioItem[];
>>>>>>> Stashed changes
}

type Icono = "＋" | "✎" | null;

<<<<<<< Updated upstream
type SchedState = "booked" | "occupied";

interface SchedRow {
  starting_hour: number;
  finishing_hour: number;
  schedule_state: SchedState;
}

function convertirYMDaFechaLocal(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function aYMDDeCualquiera(d: Date | string) {
  const fecha = typeof d === "string" ? convertirYMDaFechaLocal(d) : d;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
}
function rangoHorasEnteras(inicio = 8, fin = 17) {
  const arr: number[] = [];
  for (let h = inicio; h <= fin; h++) arr.push(h);
  return arr;
}
function formatearHora(h: number) {
  return `${String(h).padStart(2, "0")}:00`;
}
function esPasadoYMD(d: string) {
  const hoy = aYMDDeCualquiera(new Date());
  return d < hoy;
}
function esFinDeSemanaYMD(d: string) {
  const fecha = convertirYMDaFechaLocal(d);
  const dia = fecha.getDay();
  return dia === 0 || dia === 6;
}

async function fetchSched(
  urlBase: string,
  params: { fixer_id: string; requester_id: string; searched_date: string },
  signal?: AbortSignal
) {
  const url = new URL(urlBase);
  url.searchParams.set("fixer_id", params.fixer_id);
  url.searchParams.set("requester_id", params.requester_id);
  url.searchParams.set("searched_date", params.searched_date);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} en ${url.pathname} ${text}`);
  }
  const data = await res.json().catch(() => null);
  return Array.isArray(data) ? (data as SchedRow[]) : [];
}

export default function HorarioDelDia({ fixerId, requesterId, selectedDate }: PropiedadesHorarioDia) {
  const fechaFormateadaInicial = selectedDate ? aYMDDeCualquiera(selectedDate as any) : "";
  const [fecha, setFecha] = useState<string>(fechaFormateadaInicial);
  const [cargando, setCargando] = useState<boolean>(false);
  const [datos, setDatos] = useState<DatosDia | null>(null);
  const [error, setError] = useState<string>("");

  const refFormularioCita = useRef<AppointmentFormHandle | null>(null);
  const refFormularioEditarCita = useRef<EditAppointmentFormHandle | null>(null);

  const refAbort = useRef<AbortController | null>(null);
  const refReqSeq = useRef(0);
  const refActiveLoads = useRef(0);

  function setFechaYCancelar(d: string) {
    setFecha(d);
    if (refAbort.current) {
      refAbort.current.abort();
      refAbort.current = null;
    }
  }

  async function obtenerDia(d: string) {
    try {
      if (refAbort.current) refAbort.current.abort();
      const ac = new AbortController();
      refAbort.current = ac;
      const myReq = ++refReqSeq.current;

      refActiveLoads.current += 1;
      setCargando(true);
      setError("");

      const horas = rangoHorasEnteras(8, 17);

      if (esPasadoYMD(d) || esFinDeSemanaYMD(d)) {
        const horarios: HorarioItem[] = horas.map((h) => ({
          id_Horario: `${d}-${String(h).padStart(2, "0")}`,
          Hora_Inicio: formatearHora(h),
          estado_Horario: "no_disponible",
        }));
        if (myReq === refReqSeq.current) setDatos({ nombre_Fixer: NOMBRE_FIXER_POR_DEFECTO, horarios });
        return;
      }

      const [bookedRows, occupiedRows] = await Promise.all([
        fetchSched(EP_BOOKED, { fixer_id: fixerId, requester_id: requesterId, searched_date: d }, ac.signal),
        fetchSched(EP_OCCUPIED, { fixer_id: fixerId, requester_id: requesterId, searched_date: d }, ac.signal),
      ]);

      const bookedSet = new Set<number>();
      const occupiedSet = new Set<number>();
      for (const r of bookedRows) {
        if (r.schedule_state === "booked") bookedSet.add(Number(r.starting_hour));
      }
      for (const r of occupiedRows) {
        if (r.schedule_state === "occupied") occupiedSet.add(Number(r.starting_hour));
      }

      const horarios: HorarioItem[] = [];
      for (const h of horas) {
        const horaMostrar = formatearHora(h);
        const idBase = `${d}-${String(h).padStart(2, "0")}`;

        if (h === 12 || h === 13) {
          horarios.push({ id_Horario: idBase, Hora_Inicio: horaMostrar, estado_Horario: "no_disponible" });
          continue;
        }

        if (occupiedSet.has(h)) {
          horarios.push({ id_Horario: idBase, Hora_Inicio: horaMostrar, estado_Horario: "ocupado_otro" });
        } else if (bookedSet.has(h)) {
          horarios.push({ id_Horario: idBase, Hora_Inicio: horaMostrar, estado_Horario: "reservado_propio" });
        } else {
          horarios.push({ id_Horario: idBase, Hora_Inicio: horaMostrar, estado_Horario: "libre" });
        }
      }

      if (myReq === refReqSeq.current && !ac.signal.aborted) {
        setDatos({ nombre_Fixer: NOMBRE_FIXER_POR_DEFECTO, horarios });
      }
    } catch (e: any) {
      const isAbort =
        e?.name === "AbortError" ||
        e?.name === "CanceledError" ||
        e?.code === "ERR_CANCELED" ||
        (typeof axios.isCancel === "function" && axios.isCancel(e));
      if (!isAbort) setError(e?.message || "Error");
    } finally {
      refActiveLoads.current = Math.max(0, refActiveLoads.current - 1);
      if (refActiveLoads.current === 0) setCargando(false);
      if (refAbort.current) refAbort.current = null;
=======
interface HourApiResponse {
    message: string;
    name: string;
    status: ApiStatus;
}

function ymdToLocalDate(ymd: string) {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function toYMDAny(d: Date | string) {
    const date = typeof d === "string" ? ymdToLocalDate(d) : d;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function hourIntsRange(start = 8, end = 17) {
    const out: number[] = [];
    for (let h = start; h <= end; h++) out.push(h);
    return out;
}

function formatHourDisplay(h: number) {
    return `${String(h).padStart(2, "0")}:00`;
}

function mapApiToEstado(s: ApiStatus): HorarioItem["estado_Horario"] {
    switch (s) {
        case "occupied":
            return "no_disponible";
        case "booked":
            return "ocupado";
        case "available":
            return "libre";
        case "cancelled":
            return "libre";
        default:
            return "no_disponible";
    }
}

async function fetchHour(
    id_fixer: string,
    id_requester: string,
    selected_date: string,
    starting_time: number
): Promise<HourApiResponse> {
    const { data } = await axios.get<HourApiResponse>(AVAILABILITY_URL, {
        params: { id_fixer, id_requester, selected_date, starting_time },
        headers: { Accept: "application/json" },
    });
    return data;
}

export default function DaySchedule({
    fixerId,
    requesterId,
    selectedDate,
    onDateChange,
}: DayScheduleProps) {
    const formattedDate = selectedDate ? toYMDAny(selectedDate as any) : "";
    const [date, setDate] = useState<string>(formattedDate);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<DayData | null>(null);
    const [err, setErr] = useState<string>("");

    const appointmentFormRef = useRef<AppointmentFormHandle | null>(null);
    const editAppointmentFormRef = useRef<EditAppointmentFormHandle | null>(null);
    const refreshTimerRef = useRef<number | null>(null);
    const refreshIntervalRef = useRef<number | null>(null);

    const convertToDate = (selectedDate: Date | string | null): Date => {
        if (!selectedDate) {
            return new Date();
        }

        if (selectedDate instanceof Date) {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth();
            const day = selectedDate.getDate();
            return new Date(year, month, day, 12, 0, 0);
        }

        if (selectedDate.includes('T')) {
            return new Date(selectedDate);
        } else {
            return new Date(`${selectedDate}T12:00:00`);
        }
    };

    const fechaInicial = convertToDate(selectedDate);

    function clearRefreshTimers() {
        if (refreshTimerRef.current) {
            window.clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }
        if (refreshIntervalRef.current) {
            window.clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }
    }

    function kickRefreshBurst(targetDate?: string) {
        const d = targetDate || date;
        if (!d) return;

        clearRefreshTimers();

        refreshTimerRef.current = window.setTimeout(() => fetchDay(d), 1200);

        let attempts = 0;
        refreshIntervalRef.current = window.setInterval(() => {
            attempts++;
            fetchDay(d);
            if (attempts >= 4) {
                clearRefreshTimers();
            }
        }, 2000);
    }
    const labelByEstado = (
        estado: "libre" | "ocupado" | "no_disponible"
    ): { text: string; cls: string; icon: Icon } => {
        switch (estado) {
            case "libre":
                return { text: "DISPONIBLE", cls: "text-emerald-600", icon: "＋" };
            case "ocupado":
                return { text: "RESERVADO", cls: "text-amber-500", icon: "✎" };
            case "no_disponible":
                return { text: "NO DISPONIBLE", cls: "text-slate-400", icon: null };
            default:
                return { text: "", cls: "", icon: null };
        }
    };

    async function fetchDay(d: string) {
        try {
            setLoading(true);
            setErr("");
            const hours = hourIntsRange(8, 17);
            const horarios: HorarioItem[] = [];
            for (const h of hours) {
                const horaDisplay = formatHourDisplay(h);
                const baseId = `${d}-${String(h).padStart(2, "0")}`;
                if (h === 12 || h === 13) {
                    horarios.push({
                        id_Horario: baseId,
                        Hora_Inicio: horaDisplay,
                        estado_Horario: "no_disponible",
                    });
                    continue;
                }
                try {
                    const resp = await fetchHour(fixerId, requesterId, d, h);
                    const estado = mapApiToEstado(resp.status);
                    horarios.push({
                        id_Horario: baseId,
                        Hora_Inicio: horaDisplay,
                        estado_Horario: estado,
                    });
                    if (resp.status === "cancelled") {
                        horarios.push({
                            id_Horario: `${baseId}-banner`,
                            Hora_Inicio: horaDisplay,
                            estado_Horario: "libre",
                            type: "banner",
                            text: "CANCELADO POR EL USUARIO",
                        });
                    }
                } catch {
                    horarios.push({
                        id_Horario: baseId,
                        Hora_Inicio: horaDisplay,
                        estado_Horario: "no_disponible",
                    });
                }
            }
            const nombre_Fixer = DEFAULT_FIXER_NAME;
            setData({ nombre_Fixer, horarios });
        } catch (e) {
            setErr((e as Error).message || "Error");
        } finally {
            setLoading(false);
        }
>>>>>>> Stashed changes
    }

<<<<<<< Updated upstream
  useEffect(() => {
    if (fecha) obtenerDia(fecha);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const d = aYMDDeCualquiera(selectedDate as any);
      setFechaYCancelar(d);
      setCargando(true);
      obtenerDia(d);
    }
  }, [selectedDate, fixerId, requesterId]);

  async function cargarYEditarCita(item: HorarioItem) {
    try {
      const [y, m, d] = fecha.split("-").map(Number);
      const [hh] = (item.Hora_Inicio || "00:00").split(":");
      const horaLocal = parseInt(hh, 10);
      const isoParaEditar = new Date(Date.UTC(y, m - 1, d, horaLocal + 4, 0, 0)).toISOString();

      const url =
        `${API_BASE}/api/crud_read/appointments/get_modal_form` +
        `?fixer_id=${encodeURIComponent(fixerId)}` +
        `&requester_id=${encodeURIComponent(requesterId)}` +
        `&appointment_date=${encodeURIComponent(fecha)}` +
        `&start_hour=${encodeURIComponent(String(horaLocal))}`;

      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) {
        const body = await res.text().catch(() => "<sin cuerpo>");
        alert(`Error ${res.status} al consultar la cita.\n${body}`);
        return;
      }
      const data = await res.json();

      const modality = data?.data?.appointment_type === "presential" ? "presencial" : "virtual";

      const existingAppointment: ExistingAppointment = {
        id: data?.data?._id || data?.data?.id || `${fecha}-${hh}`,
        datetime: isoParaEditar,
        client: data?.data?.current_requester_name || "",
        contact: data?.data?.current_requester_phone || "",
        modality,
        description: data?.data?.appointment_description || "",
        meetingLink: data?.data?.link_id || "",
        lat: data?.data?.latitude != null ? Number(data.data.latitude) : undefined,
        lon: data?.data?.longitude != null ? Number(data.data.longitude) : undefined,
        address: data?.data?.display_name_location || "",
        place: "",
      };

      refFormularioEditarCita.current?.open(existingAppointment);
    } catch (err) {
      alert("Error al cargar los datos de la cita para editar. Revisa consola.");
      console.error(err);
    }
  }

  const etiquetaPorEstado = (estado: Estado): { text: string; icon: Icono; textCls: string; rowCls: string } => {
    switch (estado) {
      case "libre":
        return { text: "DISPONIBLE", icon: "＋", textCls: "text-emerald-600", rowCls: "bg-white" };
      case "reservado_propio":
        return { text: "RESERVADO", icon: "✎", textCls: "text-amber-500", rowCls: "bg-white" };
      case "ocupado_otro":
        return { text: "OCUPADO", icon: null, textCls: "text-white", rowCls: "bg-rose-600" };
      case "no_disponible":
      default:
        return { text: "NO DISPONIBLE", icon: null, textCls: "text-slate-400", rowCls: "bg-white opacity-60" };
    }
  };

  const manejarClickEnSlot = (item: HorarioItem) => {
    const meta = etiquetaPorEstado(item.estado_Horario);
    if (item.estado_Horario === "libre") {
      const fechaActual = new Date(fecha);
      const anio = fechaActual.getUTCFullYear();
      const mes = fechaActual.getUTCMonth();
      const dia = fechaActual.getUTCDate();
      const horaActual = parseInt(item.Hora_Inicio);
      const fechaFinal = new Date(Date.UTC(anio, mes, dia, horaActual + 4, 0, 0));
      refFormularioCita.current?.open(fechaFinal.toISOString(), { eventId: item.id_Horario, title: meta.text });
    } else if (item.estado_Horario === "reservado_propio") {
      cargarYEditarCita(item);
    }
  };

  const noHayHorariosDisponibles =
    !!datos && (datos.horarios ?? []).every((it) => it.estado_Horario !== "libre");

  return (
    <div className="mx-auto max-w-sm p-4 text-black">
      <h1 className="text-2xl font-semibold mb-3">Calendario de {datos?.nombre_Fixer ?? NOMBRE_FIXER_POR_DEFECTO}</h1>
      <div className="mb-3">
        <label className="block text-sm mb-1">Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => {
            const d = e.target.value;
            setFechaYCancelar(d);
            setCargando(true);
            obtenerDia(d);
          }}
          className="w-full rounded-lg border p-2"
        />
      </div>
      {cargando && (
        <div className="mb-2 rounded-md bg-slate-100 text-slate-600 px-3 py-2 text-sm font-medium">
          Cargando…
        </div>
      )}
      {error && <div className="text-red-600">{String(error)}</div>}
      {datos && (
        <div className="rounded-xl bg-slate-100 p-3 text-black">
          <div className="text-sm font-semibold text-slate-600 mb-2">
            {fecha ? convertirYMDaFechaLocal(fecha).toLocaleDateString("es-BO", { day: "2-digit", month: "long" }) : ""}
          </div>
          <div className="space-y-2">
            {datos.horarios?.map((item, idx) => {
              const meta = etiquetaPorEstado(item.estado_Horario);
              const clickeable = item.estado_Horario === "libre" || item.estado_Horario === "reservado_propio";
              return (
                <div
                  key={item.id_Horario || `slot-${idx}`}
                  onClick={() => clickeable && manejarClickEnSlot(item)}
                  className={`grid grid-cols-[64px_1fr_28px] items-center rounded-lg border px-3 py-2 shadow-sm ${meta.rowCls} ${
                    clickeable ? "hover:brightness-95 cursor-pointer" : ""
                  }`}
                >
                  <div className={`font-semibold ${item.estado_Horario === "ocupado_otro" ? "text-white" : "text-slate-800"}`}>
                    {item.Hora_Inicio}
                  </div>
                  <div className={`text-sm font-semibold ${meta.textCls}`}>{meta.text}</div>
                  <div className={`text-xl text-right ${item.estado_Horario === "ocupado_otro" ? "text-white" : "text-slate-500"}`}>
                    {meta.icon}
                  </div>
                </div>
              );
            })}
          </div>
          {noHayHorariosDisponibles && !cargando && (
            <div className="mt-3 text-center text-sm font-semibold text-slate-600">No hay horarios disponibles</div>
          )}
        </div>
      )}
      <AppointmentForm ref={refFormularioCita} fixerId={fixerId} requesterId={requesterId} />
      <EditAppointmentForm ref={refFormularioEditarCita} />
    </div>
  );
=======
    // Handler para cuando cambia la fecha en el DatePicker
    const handleDatePickerChange = (newDate: Date) => {
        const newDateStr = toYMDAny(newDate);
        setDate(newDateStr);
        fetchDay(newDateStr);
        if (onDateChange) {
            onDateChange(newDate);
        }
    };

    useEffect(() => {
        if (date) fetchDay(date);
    }, []);

    useEffect(() => {
        if (selectedDate) {
            const d = toYMDAny(selectedDate as any);
            setDate(d);
            fetchDay(d);
        }
    }, [selectedDate, fixerId, requesterId]);

    useEffect(() => {
        const onFocus = () => {
            if (date) fetchDay(date);
        };
        const onVisibility = () => {
            if (document.visibilityState === "visible" && date) fetchDay(date);
        };

        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [date, fixerId, requesterId]);

    useEffect(() => {
        return () => {
            clearRefreshTimers();
        };
    }, []);

    const handleSlotClick = (item: HorarioItem) => {
        if (item.type === "banner") return;
        const meta = labelByEstado(item.estado_Horario);

        if (meta.icon === "＋") {
            const currentDate = new Date(date);
            const currentYear = currentDate.getUTCFullYear();
            const currentMonth = currentDate.getUTCMonth();
            const currentDay = currentDate.getUTCDate();
            const currentHour = parseInt(item.Hora_Inicio);
            const finalDate = new Date(Date.UTC(currentYear, currentMonth, currentDay, currentHour + 4, 0, 0));
            appointmentFormRef.current?.open(finalDate.toISOString(), {
                eventId: item.id_Horario,
                title: meta.text,
            });

            kickRefreshBurst(date);
        } else if (meta.icon === "✎") {
            const existingAppointment: ExistingAppointment = {
                id: item.id_Horario,
                datetime: `${date}T${item.Hora_Inicio}:00`,
                client: item.cliente || "",
                contact: item.contacto || "",
                modality: item.modalidad || "virtual",
                description: item.descripcion || meta.text,
                place: item.lugar || "",
                meetingLink: item.meetingLink || "",
            };
            editAppointmentFormRef.current?.open(existingAppointment);

            kickRefreshBurst(date);
        }
    };

    return (
        <div className="mx-auto max-w-sm p-4 text-black">
            <h1 className="text-2xl font-semibold mb-3">
                Calendario de {data?.nombre_Fixer ?? DEFAULT_FIXER_NAME}
            </h1>

            <div className="mb-3">
                <label className="block text-sm mb-1">Fecha</label>
                <DatePicker
                    selectedDate={fechaInicial}
                    onDateChange={handleDatePickerChange}
                />
            </div>

            {loading && <div className="text-slate-500">Cargando…</div>}
            {err && <div className="text-red-600">{String(err)}</div>}

            {data && (
                <div className="rounded-xl bg-slate-100 p-3 text-black">
                    <div className="text-sm font-semibold text-slate-600 mb-2">
                        {date
                            ? ymdToLocalDate(date).toLocaleDateString("es-BO", {
                                day: "2-digit",
                                month: "long",
                            })
                            : ""}
                    </div>

                    <div className="space-y-2">
                        {data.horarios?.map((item: HorarioItem, idx: number) => {
                            if (item.type === "banner") {
                                return (
                                    <div
                                        key={item.id_Horario || `banner-${idx}`}
                                        className="rounded-lg bg-rose-500 text-white text-center text-xs font-semibold py-2"
                                    >
                                        {item.text}
                                    </div>
                                );
                            }

                            const meta = labelByEstado(item.estado_Horario);
                            const clickable = meta.icon === "＋" || meta.icon === "✎";

                            return (
                                <div
                                    key={item.id_Horario}
                                    onClick={() => clickable && handleSlotClick(item)}
                                    className={`grid grid-cols-[64px_1fr_28px] items-center rounded-lg border bg-white px-3 py-2 shadow-sm ${item.estado_Horario === "no_disponible"
                                        ? "opacity-60"
                                        : clickable
                                            ? "hover:bg-slate-50 cursor-pointer"
                                            : ""
                                        }`}
                                >
                                    <div className="font-semibold text-slate-800">{item.Hora_Inicio}</div>
                                    <div className={`text-sm font-semibold ${meta.cls}`}>{meta.text}</div>
                                    <div className="text-xl text-slate-500 text-right">{meta.icon}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <AppointmentForm ref={appointmentFormRef} fixerId={fixerId} requesterId={requesterId} />
            <EditAppointmentForm ref={editAppointmentFormRef} />
        </div>
    );
>>>>>>> Stashed changes
}
