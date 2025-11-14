'use client';

import { useState, useRef } from "react";
import EditAppointmentForm, { EditAppointmentFormHandle, ExistingAppointment } from "@/componentsLorem/appointments/forms/EditAppointmentForm";
import { useUserRole } from "@/utils/contexts/UserRoleContext";
import type { AppointmentFormHandle } from "@/componentsLorem/appointments/forms/AppointmentForm";
import AppointmentForm from "@/componentsLorem/appointments/forms/AppointmentForm";
import AppointmentDetailsForm, { EditAppointmentFormHandle as DetailsFormHandle } from "@/componentsLorem/appointments/forms/AppointmentDetails";
import { useAppointmentsContext } from "@/utils/contexts/AppointmentsContext/AppoinmentsContext";
const API_BASE = "https://servineo-backend-lorem.onrender.com";

interface HourCellProps {
    date: Date;
    hour: number;
    isPast: boolean;
    isToday: boolean;
    view: 'day' | 'week';
}

/*type Estados =
    'disponible' | 'reservado' | 'inhabilitado'
    | 'ocupado' | 'reservadoOtro' | 'cancelFixer' | 'cancelRequester'
    | 'cancelOtherFixer' | 'cancelOtherRequester';*/
const today = new Date();

export default function HourCell({
    hour,
    date,
    isPast,
    isToday,
    view
}: HourCellProps) {
    const refFormularioCita = useRef<AppointmentFormHandle | null>(null);
    const formRef = useRef<DetailsFormHandle>(null);
    const refFormularioEditarCita = useRef<EditAppointmentFormHandle | null>(null);

    const { isHourBookedFixer, isHourBooked, isEnabled, isCanceled } = useAppointmentsContext();

    const { isFixer, isRequester, requester_id, fixer_id } = useUserRole();



    const isBookedFixer = isHourBookedFixer(date, hour);
    const isBooked = isHourBooked(date, hour, requester_id);
    const isEnable = isEnabled(date, hour);
    const isCancel = isCanceled(date, hour, requester_id);


    const todayColor = () => {
        if (isToday && view === 'week') return "bg-blue-300";
        if (isToday && view === 'day' && today.getHours() === hour) return "bg-blue-300";
        else return "bg-white";
    }


    const getEstado = () => {
        if (isBooked === 'self') return 'reservado';
        if (isBooked === 'other') return 'reservadoOtro';
        if (isBookedFixer) return 'ocupado';
        if (!isEnable) return 'inhabilitado';

        if (isCancel === 'fixer') {
            return 'cancelFixer';
        } else if (isCancel === 'requester') {
            return 'cancelRequester';
        } else if (isCancel === 'otherFixer') {
            return 'cancelOtherFixer';
        } else if (isCancel === 'otherRequester')
            return 'cancelOtherRequester';


        return 'disponible'

    }

    const estado = getEstado();
    const getColor = () => {

        if (estado === 'disponible')
            return "bg-[#16A34A]"

        if (estado === 'cancelFixer' || estado === 'cancelOtherRequester' || estado === 'cancelRequester')
            return "bg-[#FF3E17]"

        if (estado === 'reservado' || estado === 'ocupado' || estado === 'reservadoOtro')
            return "bg-[#FFC857]";

        if (estado === 'inhabilitado' || estado === 'cancelOtherFixer')
            return "bg-[#64748B]";
    }

    const getText = () => {
        if (isFixer) {
            if (estado === 'disponible')
                return 'Disponible';
            if (estado === 'cancelOtherFixer' || estado === 'cancelFixer')
                return "Cancelado por Fixer";

            if (estado === 'cancelOtherRequester' || estado === 'cancelRequester')
                return "Cancelado por requester"

            if (estado === 'reservado' || estado === 'ocupado' || estado === 'reservadoOtro')
                return "Reservado";

            if (estado === 'inhabilitado')
                return "Inhabilitado";

        } else {
            if (estado === 'disponible' || estado === 'cancelOtherRequester')
                return "Disponible";
            if (estado === 'cancelFixer')
                return "Cancelado por Fixer";
            if (estado === 'cancelRequester')
                return "Cancelado por Requester";

            if (estado === 'reservado')
                return "Reservado";


            if (estado === 'ocupado' || estado === 'reservadoOtro')
                return "Ocupado";
            if (estado === 'inhabilitado')
                return 'Inhabilitado';

            if (estado === 'cancelOtherFixer')
                return 'No Disponible';


        }
        return "";
    }

    const createISOWithOffset = (date: Date, hour: number) => {
        const fechaActual = new Date(date);
        const anio = fechaActual.getUTCFullYear();
        const mes = fechaActual.getUTCMonth();
        const dia = fechaActual.getUTCDate();
        const fechaFinal = new Date(Date.UTC(anio, mes, dia, hour + 4, 0, 0));
        return fechaFinal.toISOString();
    };


    const handleOpenForm = () => {
        if (formRef.current) {
            const now = new Date(date);
            now.setHours(hour, 0, 0, 0);
            formRef.current.open(now);
        }
    }

    // Función para cargar y editar cita (copiada de HorarioDelDia)
    async function cargarYEditarCita() {
        try {
            const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const isoParaEditar = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hour + 4, 0, 0)).toISOString();

            const url =
                `${API_BASE}/api/crud_read/appointments/get_modal_form` +
                `?fixer_id=${encodeURIComponent(fixer_id)}` +
                `&requester_id=${encodeURIComponent(requester_id)}` +
                `&appointment_date=${encodeURIComponent(ymd)}` +
                `&start_hour=${encodeURIComponent(String(hour))}`;

            const res = await fetch(url, { headers: { Accept: "application/json" } });
            if (!res.ok) {
                const body = await res.text().catch(() => "<sin cuerpo>");
                alert(`Error ${res.status} al consultar la cita.\n${body}`);
                return;
            }
            const data = await res.json();

            const modality = data?.data?.appointment_type === "presential" ? "presencial" : "virtual";

            const existingAppointment: ExistingAppointment = {
                id: data?.data?._id || data?.data?.id || `${ymd}-${hour}`,
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
                fixerId: fixer_id,
                requesterId: requester_id,
            };

            refFormularioEditarCita.current?.open(existingAppointment);
        } catch (err) {
            alert("Error al cargar los datos de la cita para editar. Revisa consola.");
            console.error(err);
        }
    }

    const handleClick = () => {
        if (isRequester) {
            if (estado === 'disponible' || estado === 'cancelOtherRequester') {
                const localISOString = createISOWithOffset(date, hour);
                refFormularioCita.current?.open(localISOString);

            } else if (estado === 'reservado') {
                cargarYEditarCita();

            }
        } else {
            if (estado === 'ocupado' || estado == 'reservado' || estado === 'reservadoOtro') {
                handleOpenForm();
            }
        }

    }

    const showHourCell = () => {
        if (isPast) return false;
        if (isFixer) {
            if (estado === 'disponible') return false;

        }
        return true;
    }

    return (
        <div className={`flex items-center ${todayColor()} h-15 border-b border-r border-black`}>
            <div className="w-full">
                {showHourCell() && (
                    <div
                        className={`mx-3 py-3 rounded-md text-center text-white ${getColor()} cursor-pointer`}
                        onClick={handleClick}
                    >
                        <p>{getText()}</p>
                    </div>
                )}
            </div>

            <AppointmentForm
                ref={refFormularioCita}
                fixerId={fixer_id}
                requesterId={requester_id}
            />

            <EditAppointmentForm ref={refFormularioEditarCita} />

            <AppointmentDetailsForm ref={formRef} />
        </div>
    );
}
