import React from "react";

import { useAppointmentsContext } from "@/utils/contexts/AppointmentsContext/AppoinmentsContext";

interface AppointmentSummaryModalProps {
    open: boolean;
    onClose: () => void;
    data: {
        title: string;
        name: string;
        date: string;
        time: string;
        modality: "virtual" | "presential";
        locationOrLink: string;
        description?: string;
    };
}



const AppointmentSummaryModal: React.FC<AppointmentSummaryModalProps> = ({ open, onClose, data }) => {
    if (!open) return null;

    const { refetchAll, refetchHour } = useAppointmentsContext();

    const handleAccept = () => {
        const [month, day, year] = data.date.split('/').map(Number);
        const dateObject = new Date(year, month - 1, day);
        const hour = parseInt(data.time.split(':')[0], 10);

        console.log('Refrescando - Fecha:', dateObject, 'Hora:', hour);

        refetchHour(dateObject, hour);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto p-6 z-10">
                <div className="flex flex-col items-center">
                    {/* Icono de check centrado y verde */}
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">{data.title}</h2>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Nombre:</span>
                        <span>{data.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Fecha:</span>
                        <span>{data.date}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Hora:</span>
                        <span>{data.time}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Modalidad:</span>
                        <span>{data.modality === "virtual" ? "Virtual" : "Presencial"}</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-500">
                            {data.modality === "virtual" ? "🔗 Enlace:" : "Ubicación:"}
                        </span>
                        <span className="text-right break-words max-w-[60%]">{data.locationOrLink}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-500 block mb-1">Descripción:</span>
                        <p className="bg-gray-100 rounded p-2 text-sm">{data.description}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-between gap-2">
                    <button
                        onClick={() => {
                            onClose();
                            refetchAll();
                        }}
                        className="px-4 py-2 bg-[#2B6AE0] text-white rounded hover:brightness-110 text-sm"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentSummaryModal;

