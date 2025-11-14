import React, {
  useState, forwardRef, useImperativeHandle,
  useRef, useEffect
} from "react";
import LocationModal from "./LocationModal";
import { z } from "zod";

import { EditAppointmentHeader } from "./modules/EditAppointmentHeader";
import { DateTimeSection } from "./modules/DateTimeSection";
import { ClientSection } from "./modules/ClientSection";
import { DescriptionSection } from "./modules/DescriptionSection";
import { LocationSection } from "./modules/LocationSection";
import { MeetingLinkSection } from "./modules/MeetingLinkSection";
import { EditAppointmentActions } from "./modules/EditAppointmentActions";

import { JustificationPopup } from "../forms/popups/JustificationPopup";
import RescheduleForm, { RescheduleFormHandle } from "./RescheduleForm";

const baseSchema = z.object({
  client: z.string().regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Ingrese un nombre de cliente válido").nonempty("Ingrese un nombre de cliente").max(50),
  contact: z.string().regex(/[67]\d{7}$/, "Ingrese un número de teléfono válido").nonempty("Ingrese un número de teléfono"),
  description: z.string().nonempty("Ingrese una descripción de trabajo").max(300),
});

const virtualSchema = baseSchema.extend({
  modality: z.literal("virtual"),
  meetingLink: z.string().regex(/^(https?:\/\/)?(meet\.google\.com|zoom\.us)\/[^\s]+$/, "Ingrese un enlace válido de Meet o Zoom").nonempty("Ingrese un enlace de Meet o Zoom"),
  location: z.undefined().optional(),
});


const presentialSchema = baseSchema.extend({
  modality: z.literal("presential"),
  meetingLink: z.undefined().optional(),
  location: z.object({ lat: z.number(), lon: z.number(), address: z.string().nonempty("Seleccione una ubicación") })
            .nullable()
            .refine((val) => val !== null, { message: "Seleccione una ubicación" }),
});

const appointmentSchema = z.discriminatedUnion("modality", [virtualSchema, presentialSchema]);

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
  fixerId: string;
  requesterId: string;
};
export type EditAppointmentFormHandle = {
  open: (appointmentData: ExistingAppointment) => void;
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
  const [contact, setContact] = useState<string>("");
  const [modality, setModality] = useState<"virtual" | "presencial">("virtual");
  const [description, setDescription] = useState<string>("");
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lon, setLon] = useState<number | undefined>(undefined);
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
  const [changesDetected, setChangesDetected] = useState<boolean>(false);

  // Justificación + Reprogramación
  const [justifyOpen, setJustifyOpen] = useState(false);
  const [reprogReason, setReprogReason] = useState("");
  const rescheduleRef = useRef<RescheduleFormHandle>(null);

  useEffect(() => {
    if (!originalAppointment) { setChangesDetected(false); return; }
    const originalDate = new Date(originalAppointment.datetime);
    const originalDay = originalDate.getDate().toString().padStart(2, "0");
    const originalMonth = (originalDate.getMonth() + 1).toString().padStart(2, "0");
    const originalHour = originalDate.getHours();
    const hasDateTimeChanges = day !== originalDay || month !== originalMonth || hour !== originalHour;
    const hasClientChanges = client.trim() !== originalAppointment.client;
    const hasContactChanges = contact.trim() !== originalAppointment.contact;
    const hasDescriptionChanges = (description || "").trim() !== (originalAppointment.description || "").trim();
    const hasModalityChanges = modality !== originalAppointment.modality;
    let hasLocationOrLinkChanges = false;
    if (modality === "presencial") {
      hasLocationOrLinkChanges =
        (lat ?? 0) !== (originalAppointment.lat ?? 0) ||
        (lon ?? 0) !== (originalAppointment.lon ?? 0) ||
        (address || "") !== (originalAppointment.address || "");
    } else {
      hasLocationOrLinkChanges = (meetingLink || "").trim() !== (originalAppointment.meetingLink || "").trim();
    }
    setChangesDetected(
      hasDateTimeChanges || hasClientChanges || hasContactChanges || hasDescriptionChanges || hasModalityChanges || hasLocationOrLinkChanges
    );
  }, [day, month, hour, client, contact, description, modality, lat, lon, address, meetingLink, originalAppointment]);

  useImperativeHandle(ref, () => ({
    open: (appointmentData: ExistingAppointment) => {
      const normalized: "virtual" | "presencial" =
        appointmentData.modality === "virtual" ? "virtual" : "presencial";

      setAppointmentId(appointmentData.id);
      setDatetime(appointmentData.datetime);
      setClient(appointmentData.client);
      setContact(appointmentData.contact? appointmentData.contact : `${appointmentData.contact ?? ""}`);
      setModality(normalized);
      setDescription(appointmentData.description || "");

      const latNum = appointmentData.lat ?? undefined;
      setLat(Number.isFinite(latNum as number) ? (latNum as number) : undefined);
      const lonNum = appointmentData.lon ?? undefined;
      setLon(Number.isFinite(lonNum as number) ? (lonNum as number) : undefined);

      setAddress(appointmentData.address || "");
      setMeetingLink(appointmentData.meetingLink || "");
      setOriginalAppointment(appointmentData);

      const dateObj = new Date(appointmentData.datetime);
      setDay(dateObj.getDate().toString().padStart(2, "0"));
      setMonth((dateObj.getMonth() + 1).toString().padStart(2, "0"));
      setHour(dateObj.getHours());

      setOpen(true);
      setTimeout(() => firstFieldRef.current?.focus(), 40);
    },
    close: () => handleClose(),
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
    setContact("");
    setModality("virtual");
    setDescription("");
    setLat(undefined);
    setLon(undefined);
    setAddress("");
    setMeetingLink("");
    setDay("");
    setMonth("");
    setHour(0);
    setMsg(null);
    setErrors({});
    setJustifyOpen(false);
    setReprogReason("");
  }

  const handleLocationConfirm = (locationData: { lat: number; lon: number; address: string }) => {
    setLat(locationData.lat);
    setLon(locationData.lon);
    setAddress(locationData.address);
    setShowLocationModal(false);
  };

  // Guardar cambios normales del formulario
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErrors({});

    if (!day || !month || day.length !== 2 || month.length !== 2) { setMsg("Ingrese día y mes válidos (DD/MM)"); return; }
    const dayNum = parseInt(day); const monthNum = parseInt(month);
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) { setMsg("Ingrese una fecha válida (DD: 1-31, MM: 1-12)"); return; }

    const originalDate = new Date(originalAppointment?.datetime || datetime);
    const currentYear = originalDate.getFullYear();
    const newDatetime = new Date(currentYear, monthNum - 1, dayNum, hour, 0);
    if (newDatetime <= new Date()) { setMsg("La cita debe ser en una fecha y hora futura"); return; }

    const formData: any = {
      client: client.trim(),
      contact: contact.trim(),
      description: description.trim(),
      modality: modality === "presencial" ? "presential" : "virtual",
    };

    if (modality === "presencial") {
      formData.location =
        lat !== undefined && lon !== undefined && Number.isFinite(lat) && Number.isFinite(lon) && address
          ? { lat, lon, address: address.trim() }
          : null;
    } else {
      formData.meetingLink = meetingLink.trim() || genMeetingLink(datetime);
    }

    const validation = appointmentSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const key = Array.isArray(err.path) && err.path.length ? (err.path[0] as string) : "general";
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const payload: any = {};
    if (!originalAppointment) return setMsg("Error: datos originales no disponibles");

    if (client.trim() !== originalAppointment.client) payload.current_requester_name = client.trim();
    if (contact.trim() !== originalAppointment.contact) payload.current_requester_phone = contact.trim();
    if ((description || "") !== (originalAppointment.description || "")) payload.appointment_description = description.trim();
    if (modality !== originalAppointment.modality) payload.appointment_type = modality === "presencial" ? "presential" : "virtual";

    if (modality === "presencial") {
      if (!address) return setMsg("Selecciona una ubicación.");
      if (lat !== undefined && lat !== (originalAppointment.lat ?? undefined)) payload.lat = String(lat);
      if (lon !== undefined && lon !== (originalAppointment.lon ?? undefined)) payload.lon = String(lon);
      if (address !== (originalAppointment.address ?? "")) payload.display_name_location = address;
    } else {
      const linkToUse = meetingLink.trim() || genMeetingLink(datetime);
      if (meetingLink.trim()) {
        const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/i;
        if (!urlRegex.test(meetingLink.trim())) return setMsg("Ingrese un enlace válido.");
      }
      if ((meetingLink || "") !== (originalAppointment.meetingLink || "")) payload.link_id = linkToUse;
    }

    if (Object.keys(payload).length === 0) { setMsg("No hay cambios para guardar."); return; }

    try {
      setLoading(true);
      const API = process.env.NEXT_PUBLIC_BACKEND as string;
      const res = await fetch(`${API}/api/crud_update/appointments/update_by_id?id=${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg(data?.error || data?.message || "Error al actualizar"); setLoading(false); return; }

      setMsg("¡Cita actualizada!");
      setTimeout(() => { setLoading(false); handleClose(); }, 700);
    } catch (err) {
      console.error(err);
      setMsg("Error en la conexión.");
      setLoading(false);
    }
  }

  // Flujo de cancelación/reprogramación
  const handleAskJustification = () => {
    if (!justifyOpen) setJustifyOpen(true);
  };
  const handleSubmitJustification = (reason: string) => {
    setReprogReason(reason);
    setJustifyOpen(false);
    // Abre el formulario de reprogramación (prefill desde backend con pastDate)
    rescheduleRef.current?.open();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-appointment-title"
          className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto overflow-auto"
          style={{ maxHeight: "90vh" }}
        >
          <div className="p-4 sm:p-6">
            <EditAppointmentHeader onClose={handleClose} />

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-black">
              <DateTimeSection datetime={datetime} modality={modality} onModalityChange={setModality} />

              <ClientSection
                client={client}
                contact={contact}
                errors={errors}
                ref={firstFieldRef}
                onClientChange={setClient}
                onContactChange={setContact}
                readonly={false}
              />

              <DescriptionSection description={description} error={errors.description} onChange={setDescription} />

              {modality === "presencial" ? (
                <LocationSection
                  address={address}
                  error={errors.location}
                  onOpenLocationModal={() => setShowLocationModal(true)}
                  formtype="edit"
                />
              ) : (
                <MeetingLinkSection meetingLink={meetingLink} error={errors.meetingLink} onChange={setMeetingLink} />
              )}

              <LocationModal
                open={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onConfirm={handleLocationConfirm}
                initialCoords={
                  Number.isFinite(lat as number) && Number.isFinite(lon as number) && lat !== undefined && lon !== undefined
                    ? { lat: lat as number, lon: lon as number, address }
                    : undefined
                }
              />

              {msg && <p className="text-sm text-red-600">{msg}</p>}

              <EditAppointmentActions
                loading={loading}
                changesDetected={changesDetected}
                onCancel={handleClose}
                appointmentStart={originalAppointment ? new Date(originalAppointment.datetime) : undefined}
                submitDisabled={modality === "presencial" && !address}
                onRequestReprogram={handleAskJustification} // ← el hijo pide al padre abrir Justificación
              />
            </form>
          </div>
        </div>
      </div>

      {/* ÚNICO modal de justificación */}
      <JustificationPopup
        open={justifyOpen}
        onClose={() => setJustifyOpen(false)}
        onSubmit={handleSubmitJustification}
        title="Justificación"
      />

      {/* Reprogramación: pre-llenado desde backend usando pastDate */}
      <RescheduleForm
        ref={rescheduleRef}
        fixerId={originalAppointment?.fixerId ?? ""}
        requesterId={originalAppointment?.requesterId ?? ""}
        pastDate={originalAppointment?.datetime ?? ""}
        motivo={reprogReason}
      />
    </>
  );
});

export default EditAppointmentForm;
