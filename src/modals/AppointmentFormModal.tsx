// src/modals/AppointmentFormModal.tsx
"use client";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import LocationModal, { FormType } from "./LocationModal";
import AppointmentSummaryModal from "./AppointmentSummaryModal";
import { appointmentSchema, AppointmentFormData } from "../schemas/appointments.schema";
import { useAppointment } from "../hooks/useAppointment";
import { formatHourForDisplay } from "../utils/datetime";

interface AppointmentFormModalProps {
  fixerId: string;
  requesterId: string;
  mode: FormType;
}

export type AppointmentFormHandle = {
  open: (datetimeISO: string) => void;
  close: () => void;
};

const AppointmentFormModal = forwardRef<AppointmentFormHandle, AppointmentFormModalProps>(
  ({ fixerId, requesterId, mode }, ref) => {
    const { handleCreateAppointment, loading, error } = useAppointment();
    const [open, setOpen] = useState(false);
    const [datetimeISO, setDatetimeISO] = useState("");
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lon: number; address: string } | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [summaryData, setSummaryData] = useState<any>(null);

    const {
      register,
      handleSubmit,
      watch,
      reset,
      formState: { errors },
    } = useForm<AppointmentFormData>({
      resolver: zodResolver(appointmentSchema),
      defaultValues: {
        modality: "virtual",
      },
    });

    useImperativeHandle(ref, () => ({
      open: (dt: string) => {
        setDatetimeISO(dt);
        setOpen(true);
      },
      close: () => setOpen(false),
    }));

    const onSubmit = async (data: AppointmentFormData) => {
      if (data.modality === "presential" && !location) {
        alert("Debes seleccionar una ubicación válida");
        return;
      }

      const formData = { ...data, location: data.modality === "presential" ? location : undefined };
      try {
        const response = await handleCreateAppointment(fixerId, requesterId, datetimeISO, formData);
        setSummaryData({
          name: data.client,
          date: new Date(datetimeISO).toLocaleDateString(),
          time: formatHourForDisplay(datetimeISO),
          modality: data.modality,
          locationOrLink: data.modality === "virtual" ? data.meetingLink! : location!.address,
          description: data.description,
        });
        setShowSummary(true);
      } catch (err) {
        console.error(err);
      }
    };

    if (!open) return null;

    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-4">Crear Cita</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block font-medium">Nombre</label>
                <input {...register("client")} className="w-full border p-2 rounded" />
                {errors.client && <p className="text-red-500 text-sm">{errors.client.message}</p>}
              </div>
              <div>
                <label className="block font-medium">Teléfono</label>
                <input {...register("contact")} className="w-full border p-2 rounded" />
                {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
              </div>
              <div>
                <label className="block font-medium">Modalidad</label>
                <select {...register("modality")} className="w-full border p-2 rounded">
                  <option value="virtual">Virtual</option>
                  <option value="presential">Presencial</option>
                </select>
              </div>
              {watch("modality") === "virtual" && (
                <div>
                  <label className="block font-medium">Enlace de reunión</label>
                  <input {...register("meetingLink")} className="w-full border p-2 rounded" />
                  {errors.meetingLink && <p className="text-red-500 text-sm">{errors.meetingLink.message}</p>}
                </div>
              )}
              {watch("modality") === "presential" && (
                <div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => setShowLocationModal(true)}
                  >
                    Seleccionar Ubicación
                  </button>
                  {location && <p className="mt-2">Ubicación seleccionada: {location.address}</p>}
                  {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                </div>
              )}
              <div>
                <label className="block font-medium">Descripción</label>
                <textarea {...register("description")} className="w-full border p-2 rounded" rows={3} />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setOpen(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>Crear</button>
              </div>
            </form>
          </div>
        </div>

        {/* Location Modal */}
        <LocationModal
          open={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onConfirm={(loc) => { setLocation(loc); setShowLocationModal(false); }}
          initialCoords={location}
          formType="create"
        />

        {/* Summary Modal */}
        <AppointmentSummaryModal
          open={showSummary}
          onClose={() => { setShowSummary(false); setOpen(false); reset(); }}
          data={summaryData!}
        />
      </>
    );
  }
);

export default AppointmentFormModal;
