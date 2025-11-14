// components/appointments/forms/EditAppointmentForm.tsx
import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import LocationModal from "./LocationModal";
import { set, z } from "zod";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import { useUserRole } from "@/utils/contexts/UserRoleContext";
// Import modules
import { EditAppointmentHeader } from './modules/EditAppointmentHeader';
import { DateTimeDisplaySection } from './modules/DateTimeDisplaySection';
import { DateTimeSection } from './modules/DateTimeSection';
import { ClientSection } from './modules/ClientSection';
import { DescriptionSection } from './modules/DescriptionSection';
import { LocationSection } from './modules/LocationSection';
import { MeetingLinkSection } from './modules/MeetingLinkSection';
import { EditAppointmentActions } from './modules/EditAppointmentActions';
import axios from "axios";

export type AppointmentPayload = {
    datetime: string;
    client: string;
    contact: string;
    modality: "virtual" | "presencial";
    description?: string;
    meetingLink?: string;
    place?: string;
    lat?: number;
    lon?: number;
    address?: string;
};

export type ExistingAppointment = AppointmentPayload & {
    id: string;
};

export type EditAppointmentFormHandle = {
    open: (datetime: Date) => void;
    close: () => void;
};

function genMeetingLink(datetimeISO: string) {
    const id = Math.random().toString(36).slice(2, 9);
    return `https://meet.example.com/${id}?t=${encodeURIComponent(datetimeISO)}`;
}

const EditAppointmentForm = forwardRef<EditAppointmentFormHandle>((_props, ref) => {
    const [open, setOpen] = useState(false);
    const [appointmentId, setAppointmentId] = useState<string>("");
    const [datetime, setDatetime] = useState<string>("");
    const [client, setClient] = useState<string>("");
    const [contact, setContact] = useState<string>("+591 ");
    const [modality, setModality] = useState<"virtual" | "presencial">("virtual");
    const [description, setDescription] = useState<string>("");
    const [lat, setLat] = useState<number>();
    const [lon, setLon] = useState<number>();
    const [address, setAddress] = useState<string>("");
    const [meetingLink, setMeetingLink] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [originalAppointment, setOriginalAppointment] = useState<ExistingAppointment | null>(null);

    const [day, setDay] = useState<string>("");
    const [month, setMonth] = useState<string>("");
    const [hour, setHour] = useState<number>(0);

    const dialogRef = useRef<HTMLDivElement | null>(null);
    const firstFieldRef = useRef<HTMLInputElement | null>(null);
    const { fixer_id: fixerId } = useUserRole();
    const [changesDetected, setChangesDetected] = useState<boolean>(false);
    useEffect(() => {
        if (!originalAppointment) {
            setChangesDetected(false);
            return;
        }

        const originalDate = new Date(originalAppointment.datetime);
        const originalDay = originalDate.getDate().toString().padStart(2, '0');
        const originalMonth = (originalDate.getMonth() + 1).toString().padStart(2, '0');
        const originalHour = originalDate.getHours();

        const hasDateTimeChanges = day !== originalDay || month !== originalMonth || hour !== originalHour;
        const hasClientChanges = client.trim() !== originalAppointment.client;
        const hasContactChanges = contact.trim() !== originalAppointment.contact;
        const hasDescriptionChanges = (description || "").trim() !== (originalAppointment.description || "").trim();
        const hasModalityChanges = modality !== originalAppointment.modality;

        let hasLocationOrLinkChanges = false;
        if (modality === "presencial") {
            hasLocationOrLinkChanges = (lat ?? 0) !== (originalAppointment.lat ?? 0) ||
                (lon ?? 0) !== (originalAppointment.lon ?? 0) ||
                (address || "") !== (originalAppointment.address || "");
        } else {
            hasLocationOrLinkChanges = (meetingLink || "").trim() !== (originalAppointment.meetingLink || "").trim();
        }

        const anyChange = hasDateTimeChanges || hasClientChanges || hasContactChanges ||
            hasDescriptionChanges || hasModalityChanges || hasLocationOrLinkChanges;

        setChangesDetected(anyChange);
    }, [day, month, hour, client, contact, description, modality, lat, lon, address, meetingLink, originalAppointment]);


    useImperativeHandle(ref, () => ({
        open: async (datetime: Date) => {
            const API = process.env.NEXT_PUBLIC_BACKEND as string;
            const appointment_date = datetime.toISOString().split('T')[0]
            const start_hour = datetime.getHours().toString();
            console.log('Date', appointment_date);
            console.log('Hora', start_hour);
            const url = `${API}/api/crud_read/appointments/get_appointment_by_fixer_hour?fixer_id=${fixerId}&date=${appointment_date}&hour=${start_hour}`;

            const res = await fetch(url);
            if (!res.ok) {
                let errorText = await res.text();
                console.error('Respuesta no OK:', res.status, errorText);
                throw new Error(`No se encuentra este dato: ${res.status} - ${errorText}`);
            }

            const data = await res.json();
            console.log('Datos recibidos para editar cita:', data);
            /*if(data.appointment[0].schedule_state === 'cancelled' || data.appointment[0].cancelled_fixer){
                alert('No se puede editar una cita cancelada.');
                return;
            }*/   
            if (data.appointment[0].appointment_type != "virtual") {
                if (data.appointment[0].appointment_type != "presencial") {
                    data.appointment[0].appointment_type = "presencial"
                }
            }
            setAppointmentId(data.appointment[0]._id);
            setDatetime(datetime.toISOString());
            setClient(data.appointment[0].current_requester_name);
            setContact(data.appointment[0].current_requester_phone);
            setModality(data.appointment[0].appointment_type);
            setDescription(data.appointment[0].appointment_description || "");
            setLat(Number(data.appointment[0].lat));
            setLon(Number(data.appointment[0].lon));
            setAddress(data.appointment[0].display_name_location || "");
            setMeetingLink(data.appointment[0].link_id || "");
            setOriginalAppointment(data.appointment[0]);

            const dateObj = new Date(data.appointment[0].datetime);
            setDay(dateObj.getDate().toString().padStart(2, '0'));
            setMonth((dateObj.getMonth() + 1).toString().padStart(2, '0'));
            setHour(dateObj.getHours())

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
        setAppointmentId("");
        setClient("");
        setContact("+591 ");
        setModality("virtual");
        setDescription("");
        setLat(0);
        setLon(0);
        setAddress("");
        setMeetingLink("");
        setDay("");
        setMonth("");
        setHour(0);
        setMsg(null);
        setErrors({});
    }
    async function handleDeleteAppointment() {
        try {
            const API = process.env.NEXT_PUBLIC_BACKEND as string;
            //const url = `${API}/api/crud_update/appointments/update_cancell_appointment_fixer`;
            console.log('Eliminando cita con ID:', appointmentId);
            const response = await axios.put(
                `${API}/api/crud_update/appointments/update_cancell_appointment_fixer?appointment_id=${appointmentId}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            console.error('Error al eliminar la cita:', error);
        }
        handleClose()
    }

    const handleLocationConfirm = (locationData: { lat: number; lon: number; address: string }) => {
    };


    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />
                <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="edit-appointment-title"
                    className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto overflow-auto" style={{ maxHeight: "90vh" }}>
                    <div className="p-4 sm:p-6 text-black">
                        <EditAppointmentHeader 
                            onClose={handleClose} 
                            title="Detalles de la Cita"
                        />

                        <DateTimeDisplaySection
                            datetime={datetime}
                            modality={modality}
                            onModalityChange={setModality}
                        />

                        <ClientSection
                            client={client}
                            contact={contact}
                            errors={errors}
                            ref={firstFieldRef}
                            onClientChange={setClient}
                            onContactChange={setContact}
                            readonly={true}
                        />

                        <DescriptionSection
                            description={description}
                            error={errors.description}
                            onChange={setDescription}
                            readOnly={true}
                        />

                        {modality === "presencial" ? (
                            <LocationSection
                                address={address}
                                error={errors.location}
                                onOpenLocationModal={() => setShowLocationModal(true)}
                                formtype="view"
                            />
                        ) : (
                            <MeetingLinkSection
                                meetingLink={meetingLink}
                                error={errors.meetingLink}
                                onChange={setMeetingLink}
                                readonly={true}
                            />
                        )}
                        <LocationModal
                            open={showLocationModal}
                            onClose={() => setShowLocationModal(false)}
                            onConfirm={handleLocationConfirm}
                            initialCoords={
                                lat !== undefined && lon !== undefined
                                    ? {
                                        lat: lat,
                                        lon: lon,
                                        address: address
                                    }
                                    : undefined
                            }
                            formtype="view"
                        />

                        {msg && <p className="text-sm text-red-600">{msg}</p>}

                        <EditAppointmentActions
                            loading={loading}
                            changesDetected={changesDetected}
                            onCancel={handleClose}
                            onDelete={handleDeleteAppointment}
                            submitDisabled={modality === "presencial" && !address}
                            formType="view"
                        />
                    </div>
                </div>
            </div>
        </>
    );
});

export default EditAppointmentForm;
