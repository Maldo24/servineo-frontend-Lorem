"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import AppointmentForm from "../../appointments/forms/AppointmentForm";
import type { AppointmentFormHandle } from "../../appointments/forms/AppointmentForm";
import EditAppointmentForm from "../../appointments/forms/EditAppointmentForm";
import type { EditAppointmentFormHandle, ExistingAppointment } from "../../appointments/forms/EditAppointmentForm";
import AppointmentDetailsForm, { EditAppointmentFormHandle as DetailsFormHandle } from "@/componentsLorem/appointments/forms/AppointmentDetails";
import DatePicker from "@/componentsLorem/list/DatePicker/DatePicker";
import { useUserRole } from "@/utils/contexts/UserRoleContext";
import { useAppointmentsContext } from "@/utils/contexts/AppointmentsContext/AppoinmentsContext";

const API_BASE = "https://servineo-backend-lorem.onrender.com";

interface PropiedadesHorarioDia {
    fixerId: string;
    requesterId: string;
    selectedDate: Date | string | null;
    onDateChange?: (newDate: Date) => void;
    pickerMode?: boolean;
    onSlotSelect?: (iso: string) => void;
}

type Estado = "disponible" | "reservado" | "cancelado_fixer" | "cancelado_requester" | "no_disponible" | "ocupado" | "inhabilitado";

interface HorarioItem {
    id_Horario: string;
    Hora_Inicio: string;
    estado_Horario: Estado;
}

interface DatosDia {
    horarios?: HorarioItem[];
}

type Icono = "＋" | "✎" | null;

// Convierte string YYYY-MM-DD a objeto Date local
function convertirYMDaFechaLocal(ymd: string) {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, m - 1, d);
}

// Convierte Date o string a formato YYYY-MM-DD
function aYMDDeCualquiera(d: Date | string) {
    const fecha = typeof d === "string" ? convertirYMDaFechaLocal(d) : d;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
}

// Genera array de horas [0, 1, 2, ..., 23]
function rangoHorasEnteras(inicio = 0, fin = 23) {
    const arr: number[] = [];
    for (let h = inicio; h <= fin; h++) arr.push(h);
    return arr;
}

function formatearHora(h: number) {
    return `${String(h).padStart(2, "0")}:00`;
}

// Obtiene fecha/hora actual en Bolivia (UTC-4)
function obtenerAhoraBolivia(): Date {
    const ahora = new Date();
    const utc = ahora.getTime() + (ahora.getTimezoneOffset() * 60000);
    const boliviaTime = new Date(utc - (4 * 60 * 60 * 1000));
    return boliviaTime;
}

// Verifica si una fecha YYYY-MM-DD ya pasó
function esPasadoYMD(d: string) {
    const hoyBolivia = obtenerAhoraBolivia();
    const hoy = aYMDDeCualquiera(hoyBolivia);
    return d < hoy;
}

// Verifica si una hora específica de hoy ya pasó
function esHoraPasadaHoy(ymd: string, hora: number): boolean {
    const ahoraBolivia = obtenerAhoraBolivia();
    const hoyYMD = aYMDDeCualquiera(ahoraBolivia);

    if (ymd !== hoyYMD) return false;

    const horaActual = ahoraBolivia.getHours();
    const minutoActual = ahoraBolivia.getMinutes();

    if (hora < horaActual) return true;
    if (hora === horaActual && minutoActual > 0) return true;

    return false;
}

export default function HorarioDelDia({
    fixerId,
    requesterId,
    selectedDate,
    onDateChange,
    pickerMode = false,
    onSlotSelect,
}: PropiedadesHorarioDia) {
    const { isFixer, isRequester } = useUserRole();

    const {
        isHourBookedFixer,
        isEnabled,
        isCanceled,
        isHourBooked,
        loading: fixerLoading,
    } = useAppointmentsContext();

    const fechaFormateadaInicial = selectedDate ? aYMDDeCualquiera(selectedDate as any) : "";
    const [fecha, setFecha] = useState<string>(fechaFormateadaInicial);
    const [error, setError] = useState<string>("");

    const refFormularioCita = useRef<AppointmentFormHandle | null>(null);
    const refFormularioEditarCita = useRef<EditAppointmentFormHandle | null>(null);
    const formRef = useRef<DetailsFormHandle>(null);
    const handleDatePickerChange = (newDate: Date) => {
        const newDateStr = aYMDDeCualquiera(newDate);
        setFecha(newDateStr);
        onDateChange?.(newDate);
    };

    useEffect(() => {
        if (selectedDate) {
            const d = aYMDDeCualquiera(selectedDate as any);
            setFecha(d);
        }
    }, [selectedDate]);

    // CÁLCULO REACTIVO DE HORARIOS usando useMemo
    const datos = useMemo<DatosDia | null>(() => {
        if (!fecha) return null;

        const horas = rangoHorasEnteras(0, 23);

        // Si el día completo ya pasó, marcar todo como no disponible
        if (esPasadoYMD(fecha)) {
            const horarios: HorarioItem[] = horas.map((h) => ({
                id_Horario: `${fecha}-${String(h).padStart(2, "0")}`,
                Hora_Inicio: formatearHora(h),
                estado_Horario: "inhabilitado",
            }));
            return { horarios };
        }

        const horarios: HorarioItem[] = [];
        for (const h of horas) {
            const horaMostrar = formatearHora(h);
            const idBase = `${fecha}-${String(h).padStart(2, "0")}`;

            // Si la hora ya pasó hoy, marcar como no disponible
            if (esHoraPasadaHoy(fecha, h)) {
                horarios.push({ id_Horario: idBase, Hora_Inicio: horaMostrar, estado_Horario: "inhabilitado" });
                continue;
            }

            // Crear Date object para la hora actual
            const [year, month, day] = fecha.split("-").map(Number);
            const currentHourDate = new Date(year, month - 1, day, h, 0, 0);

            let estadoHora: Estado = "inhabilitado";

            const bookedFix = isHourBookedFixer(currentHourDate, h);
            const canceled = isCanceled(currentHourDate, h, requesterId);
            const enabled = isEnabled(currentHourDate, h);
            const booked = isHourBooked(currentHourDate, h, requesterId);

            // PICKER MODE 
            if (pickerMode) {
                if (booked === "self" || booked === "other") {
                    estadoHora = "no_disponible";
                } else if (canceled === 'fixer' || canceled === 'requester') {
                    estadoHora = "no_disponible";
                } else if (enabled) {
                    estadoHora = "disponible";
                }
            }
            // VISTA FIXER 
            else if (isFixer) {
                if (bookedFix) {
                    estadoHora = "reservado";
                } else if (canceled === 'fixer' || canceled === 'otherFixer') {
                    estadoHora = "cancelado_fixer";
                } else if (canceled === 'requester' || canceled === 'otherRequester') {
                    estadoHora = "cancelado_requester";
                } else if (enabled) {
                    estadoHora = "disponible";
                }
            }
            // VISTA REQUESTER 
            else if (isRequester) {
                if (booked === "self") {
                    estadoHora = "reservado";
                } else if (booked === "other") {
                    estadoHora = "ocupado";
                } else if (canceled === "otherFixer") {
                    estadoHora = "no_disponible";
                } else if (canceled === "fixer") {
                    estadoHora = "cancelado_fixer";
                } else if (canceled === "requester") {
                    estadoHora = "cancelado_requester";
                } else if (enabled) {
                    estadoHora = "disponible";
                }
            }

            horarios.push({ id_Horario: idBase, Hora_Inicio: horaMostrar, estado_Horario: estadoHora });
        }

        return { horarios };
    }, [fecha, isFixer, isRequester, pickerMode, requesterId, isHourBookedFixer, isEnabled, isCanceled, isHourBooked]);

    async function cargarYEditarCita(item: HorarioItem) {
        try {
            if (!fecha) return;
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
                lat: data?.data?.latitude !== undefined && data?.data?.latitude !== null ? Number(data.data.latitude) : undefined,
                lon: data?.data?.longitude !== undefined && data?.data?.longitude !== null ? Number(data.data.longitude) : undefined,
                address: data?.data?.display_name_location || "",
                place: "",
                fixerId,
                requesterId,
            };

            refFormularioEditarCita.current?.open(existingAppointment);
        } catch (err) {
            alert("Error al cargar los datos de la cita para editar. Revisa consola.");
            console.error(err);
        }
    }

    async function cargarDetallesCita(item: HorarioItem) {
        if (formRef.current) {
            const [y, m, d] = fecha.split("-").map(Number);
            const [hh] = item.Hora_Inicio.split(":");
            const horaLocal = parseInt(hh, 10);

            const now = new Date(y, m - 1, d, horaLocal, 0, 0, 0);
            formRef.current.open(now);
        }
    }

    const etiquetaPorEstado = (
        estado: Estado
    ): { text: string; icon: Icono; textCls: string; rowCls: string } => {
        switch (estado) {
            case "disponible":
                return { text: "DISPONIBLE", icon: "＋", textCls: "text-emerald-600", rowCls: "bg-white" };
            case "reservado":
                return { text: "RESERVADO", icon: "✎", textCls: "text-amber-500", rowCls: "bg-white" };
            case "cancelado_fixer":
                return { text: "CANCELADO POR FIXER", icon: null, textCls: "text-white", rowCls: "bg-rose-600" };
            case "cancelado_requester":
                return { text: "CANCELADO POR REQUESTER", icon: null, textCls: "text-white", rowCls: "bg-rose-600" };
            case "no_disponible":
                return { text: "NO DISPONIBLE", icon: null, textCls: "text-slate-400", rowCls: "bg-white opacity-60" };
            case "ocupado":
                return { text: "OCUPADO", icon: null, textCls: "text-slate-400", rowCls: "bg-white opacity-60" };
            case "inhabilitado":
                return { text: "INHABILITADO", icon: null, textCls: "text-slate-400", rowCls: "bg-white opacity-60" };
        }
    };

    const manejarClickEnSlot = (item: HorarioItem) => {
        // Validar que la hora no haya pasado antes de permitir click
        if (fecha) {
            const [hh] = item.Hora_Inicio.split(":");
            const hora = parseInt(hh, 10);
            if (esHoraPasadaHoy(fecha, hora)) {
                return;
            }
        }

        // Determinar si el slot es clickeable según el modo y rol
        let clickeable = false;

        if (pickerMode) {
            clickeable = item.estado_Horario === "disponible";
        } else if (isFixer) {
            clickeable = item.estado_Horario === "reservado";
        } else if (isRequester) {
            clickeable = item.estado_Horario === "disponible" || item.estado_Horario === "reservado";
        }

        if (!clickeable) return;

        const ymd = fecha || aYMDDeCualquiera(selectedDate || new Date());
        const baseDate = convertirYMDaFechaLocal(ymd);
        const hour = parseInt(item.Hora_Inicio.split(":")[0], 10);

        const slotDateLocal = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hour, 0, 0, 0);
        const iso = slotDateLocal.toISOString();

        if (pickerMode) {
            onSlotSelect?.(iso);
            return;
        }

        if (item.estado_Horario === "disponible") {
            refFormularioCita.current?.open(iso);
            return;
        }

        if (item.estado_Horario === "reservado" && isRequester) {
            cargarYEditarCita(item);
        } else if (item.estado_Horario === "reservado" && isFixer) {
            cargarDetallesCita(item);
        }
    };

    const noHayHorariosDisponibles = !!datos && (datos.horarios ?? []).every((it) => it.estado_Horario !== "disponible");

    const esEstadoCancelado = (estado: Estado) =>
        estado === "cancelado_fixer" || estado === "cancelado_requester";

    return (
        <div className="mx-auto max-w-sm p-4 text-black">
            <h1 className="text-2xl font-semibold mb-3">
                Calendario de Diego Paredes
                {!pickerMode && (
                    <span className="text-xs ml-2 text-slate-500">
                        ({isFixer ? 'Vista Fixer' : 'Vista Requester'})
                    </span>
                )}
            </h1>

            <div className="mb-3">
                <label className="block text-sm mb-1">Fecha</label>
                <DatePicker
                    selectedDate={selectedDate ? (typeof selectedDate === 'string' ? convertirYMDaFechaLocal(selectedDate) : selectedDate) : new Date()}
                    onDateChange={handleDatePickerChange}
                />
            </div>

            {fixerLoading && (
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
                        {datos.horarios && (() => {
                            const horariosVisibles = pickerMode
                                ? datos.horarios.filter(h => h.estado_Horario === "disponible")
                                : datos.horarios;

                            return (
                                <div className="space-y-2">
                                    {horariosVisibles.map((item, idx) => {
                                        const meta = etiquetaPorEstado(item.estado_Horario);

                                        let clickeable = false;
                                        if (pickerMode) {
                                            clickeable = item.estado_Horario === "disponible";
                                        } else if (isFixer) {
                                            clickeable = item.estado_Horario === "reservado";
                                        } else if (isRequester) {
                                            clickeable = item.estado_Horario === "disponible" || item.estado_Horario === "reservado";
                                        }

                                        return (
                                            <div
                                                key={item.id_Horario || `slot-${idx}`}
                                                onClick={() => {
                                                    if (!clickeable) return;
                                                    manejarClickEnSlot(item);
                                                }}
                                                className={`grid grid-cols-[64px_1fr_28px] items-center rounded-lg border px-3 py-2 shadow-sm ${meta.rowCls} ${clickeable ? "hover:brightness-95 cursor-pointer" : ""}`}
                                            >
                                                <div className={`font-semibold ${esEstadoCancelado(item.estado_Horario) ? "text-white" : "text-slate-800"}`}>
                                                    {item.Hora_Inicio}
                                                </div>
                                                <div className={`text-sm font-semibold ${meta.textCls}`}>{meta.text}</div>
                                                <div className={`text-xl text-right ${esEstadoCancelado(item.estado_Horario) ? "text-white" : "text-slate-500"}`}>
                                                    {meta.icon}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>

                    {noHayHorariosDisponibles && !fixerLoading && !pickerMode && (
                        <div className="mt-3 text-center text-sm font-semibold text-slate-600">No hay horarios disponibles</div>
                    )}
                </div>
            )}

            {!pickerMode && (
                <>
                    <AppointmentForm ref={refFormularioCita} fixerId={fixerId} requesterId={requesterId} />
                    <EditAppointmentForm ref={refFormularioEditarCita} />
                    <AppointmentDetailsForm ref={formRef} />
                </>
            )}
        </div>
    );
}
