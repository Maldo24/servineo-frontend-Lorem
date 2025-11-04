'use client';

import React, { useContext } from "react";
import { useState, useRef } from "react";
import EditAppointmentForm from "@/components/appointments/forms/EditAppointmentForm";
import { useUserRole } from "@/utils/contexts/UserRoleContext";
import useAppointmentsByDate from "@/hooks/useDailyAppointments";
import type { AppointmentFormHandle } from "@/components/appointments/forms/AppointmentForm";
import AppointmentForm from "@/components/appointments/forms/AppointmentForm";
import AppointmentDetailsForm, { EditAppointmentFormHandle } from "@/components/appointments/forms/AppointmentDetails";


interface HourCellProps {
    date: Date;
    hour: number;
    isPast: boolean;
    isToday: boolean;
    fixer_id: string;
    requester_id: string;
    isHourBooked: (hour: number) => boolean;

    view: 'day' | 'week';
}

const today = new Date();

export default function HourCell({
    hour,
    date,
    isPast,
    isToday,
    fixer_id,
    isHourBooked,
    requester_id,
    view
}: HourCellProps) {
    const refFormularioCita = useRef<AppointmentFormHandle | null>(null);
    const formRef = useRef<EditAppointmentFormHandle>(null);


    const isBooked = isHourBooked(hour);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editDateTime, setEditDateTime] = useState<Date | null>(null);

    const todayColor = () => {
        if (isToday && view === 'week') return "bg-blue-300";
        if (isToday && view === 'day' && today.getHours() === hour) return "bg-blue-300";
        else return "bg-white";
    }

    const getColor = () => {
        if (isBooked) return "bg-[#FFC857]";
        else if (isRequester) {
            if (isWeekend) return "bg-[#DADADA]"
            return "bg-[#16A34A]"
        }
    }

    const getText = () => {
        if (isBooked) return "Ocupado";
        else if (isRequester) return "Inhabilitado"

        return "Disponible";
    }


    const createISOWithOffset = (date: Date, hour: number) => {
        const fechaActual = new Date(date);
        const anio = fechaActual.getUTCFullYear();
        const mes = fechaActual.getUTCMonth();
        const dia = fechaActual.getUTCDate();
        const fechaFinal = new Date(Date.UTC(anio, mes, dia, hour + 4, 0, 0));

        return fechaFinal.toISOString();


    };

    const isWeekend = date.getDay() === 6 || date.getDay() === 0;

    const { isFixer, isRequester, fixer_id: fixi } = useUserRole();
    const handleOpenForm = () => {
        if (formRef.current) {
            const now = new Date(date);
            now.setHours(hour, 0, 0, 0);

            formRef.current.open(now);
        }
    }
    const handleClick = () => {
        if (isRequester) {
            if (isBooked) {
                const appointmentDateTime = new Date(date);
                appointmentDateTime.setHours(hour, 0, 0, 0);
                setEditDateTime(appointmentDateTime);
                setIsEditModalOpen(true);
            } else {
                const localISOString = createISOWithOffset(date, hour);
                refFormularioCita.current?.open(localISOString);
            }

        } else if (isFixer) {
            handleOpenForm();
        }
    }



    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditDateTime(null);
    }

    return (
        <div className={`flex items-center ${todayColor()} h-15 border-b border-r border-black`}>
            <div className="w-full">
                {!isPast && (
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

            {isEditModalOpen && editDateTime && (
                <EditAppointmentForm
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    datetime={editDateTime}
                    fixerId={fixer_id}
                    requesterId={requester_id}
                />
            )}

            <AppointmentDetailsForm ref={formRef} />

        </div>
    );
}
