"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from 'next/navigation';
import DesktopCalendar from "@/components/calendar/DesktopCalendar";
import { UserRoleProvider } from "@/utils/contexts/UserRoleContext";
import MobileCalendar from "@/components/calendar/mobile/MobileCalendar";
import MobileList from "@/components/list/MobileList";
import { ModeSelectionModal, ModeSelectionModalHandles } from '@/components/appointments/forms/ModeSelectionModal';
import CancelDaysAppointments from "@/components/appointments/forms/CancelDaysAppointment";

import useSixMonthsAppointments from '@/hooks/Appointments/useSixMonthsAppointments';
import { AppointmentsProvider } from "@/utils/contexts/AppointmentsContext/AppoinmentsContext";
import { AppointmentsStatusProvider } from "@/utils/contexts/DayliViewRequesterContext";

//const fixer_id = "68ef1993be38c7f1c3c2c777";
const fixer_id = "68e87a9cdae3b73d8040102f";
const requester_id = "68ec99ddf39c7c140f42fcfa";
//const requester_id = "68f3f37a44d9cf8aa91537fb";

function cancelAppointments() {
    console.log("Citas canceladas");
}

export default function CalendarPage() {
    const router = useRouter();
    const modeModalRef = useRef<ModeSelectionModalHandles>(null);

    const [userRole, setUserRole] = useState<'requester' | 'fixer'>('fixer');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const handleDataChange = (newDate: Date) => {
        setSelectedDate(newDate);
    }

    const switchRole = () => {
        if (userRole === 'requester') {
            setUserRole('fixer');
        } else {
            setUserRole('requester');
        }
    }

    const handleOpenAvailabilityModal = () => {
        modeModalRef.current?.open();
    }

    const openCancelModal = () => {
        setIsCancelModalOpen(true);
    }

    const closeCancelModal = () => {
        setIsCancelModalOpen(false);
    }

    const handleConfirmCancel = (selectedDays: string[]) => {
        //por alguna razon que no se explicar mandamos la logica pero xd funcion tonta que no quiero refactorizar 
    }

    const {
        isHourBookedFixer,
        isHourBooked,
        isEnabled,
        isCanceled,
        loading,
    } = useSixMonthsAppointments(fixer_id, today);

    const providerValue = useMemo(() => ({
        isHourBookedFixer,
        isHourBooked,
        isEnabled,
        isCanceled,
        loading

    }), [isHourBooked, isEnabled, isCanceled, loading]);
    return (
        <UserRoleProvider
            role={userRole}
            fixer_id={fixer_id}
            requester_id={requester_id}
        >
            <AppointmentsProvider
                isHourBookedFixer={providerValue.isHourBookedFixer}
                isHourBooked={providerValue.isHourBooked}
                isEnabled={providerValue.isEnabled}
                isCanceled={providerValue.isCanceled}
                loading={providerValue.loading}
            >
                <AppointmentsStatusProvider
                    fixerId={fixer_id}
                    requesterId={requester_id}
                    selectedDate={selectedDate}
                >
                    <div className="flex flex-col bg-white min-h-screen">
                        <div className="flex flex-col md:flex-row md:items-center">
                            <div className="flex items-center">
                                <button
                                    onClick={() => router.back()}
                                    className="p-2 m-4 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors self-start">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 6l12 12M6 18L18 6"
                                            strokeWidth={2}
                                        />
                                    </svg>
                                </button>

                                {userRole === 'fixer' && (
                                    <h2 className="text-black p-4 text-xl text-center flex-1">Mi Calendario</h2>
                                )}
                                {userRole === 'requester' && (
                                    <h2 className="text-black p-4 text-xl text-center flex-1">Calendario Diego Paredes</h2>
                                )}
                            </div>

                            <div className="flex flex-col md:hidden gap-2 px-4 pb-4">
                                {userRole === 'fixer' && (
                                    <div className="flex gap-2">
                                        <button
                                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
                                            onClick={handleOpenAvailabilityModal}
                                        >
                                            Modificar Disponibilidad
                                        </button>
                                        <button
                                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm"
                                            onClick={openCancelModal}
                                        >
                                            Cancelar Citas
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={switchRole}
                                    className="w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer text-sm">
                                    Vista Actual: {userRole}
                                </button>
                            </div>

                            <div className="hidden md:flex md:items-center md:ml-auto md:mr-4 md:gap-4">
                                <button
                                    onClick={switchRole}
                                    className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap">
                                    Vista Actual: {userRole}
                                </button>

                                {userRole === 'fixer' && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
                                            onClick={handleOpenAvailabilityModal}
                                        >
                                            Modificar Disponibilidad
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                                            onClick={openCancelModal}
                                        >
                                            Cancelar Citas
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center md:block hidden">
                            <DesktopCalendar
                                fixer_id={fixer_id}
                                requester_id={requester_id}
                            />
                        </div>

                        <div className="flex flex-col md:hidden justify-center gap-4" >
                            <MobileCalendar
                                fixer_id={fixer_id}
                                selectedDate={selectedDate}
                                onSelectDate={handleDataChange}
                            />
                            <div></div>
                            <MobileList
                                selectedDate={selectedDate}
                                fixerId={fixer_id}
                                requesterId={requester_id}
                                onDateChange={handleDataChange}
                            />
                        </div>

                        <ModeSelectionModal
                            ref={modeModalRef}
                            fixerId={fixer_id}
                        />

                        <CancelDaysAppointments
                            isOpen={isCancelModalOpen}
                            onClose={closeCancelModal}
                            fixer_id={fixer_id}
                        />
                    </div>
                </AppointmentsStatusProvider>
            </AppointmentsProvider>
        </UserRoleProvider>
    );
}