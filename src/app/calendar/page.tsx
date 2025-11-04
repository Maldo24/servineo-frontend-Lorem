"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import DesktopCalendar from "@/components/calendar/DesktopCalendar";
import { UserRoleProvider } from "@/utils/contexts/UserRoleContext";
import MobileCalendar from "@/components/calendar/mobile/MobileCalendar";
import MobileList from "@/components/list/MobileList";
import { ModeSelectionModal, ModeSelectionModalHandles } from '@/components/appointments/forms/ModeSelectionModal';
import CancelDaysAppointments from "@/components/appointments/forms/CancelDaysAppointment"; // Asegúrate de que la ruta sea correcta


const fixer_id = "68e87a9cdae3b73d8040102f";
const requester_id = "68ec99ddf39c7c140f42fcfa"

function cancelAppointments() {
    console.log("Citas canceladas");
}

export default function CalendarPage() {
    const router = useRouter();
    const modeModalRef = useRef<ModeSelectionModalHandles>(null);

    const [userRole, setUserRole] = useState<'requester' | 'fixer'>('fixer');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // Estado para controlar el modal
    const today = new Date();

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

    
    return (
        <UserRoleProvider
            role={userRole}
            fixer_id={fixer_id}
            requester_id={requester_id}
        >
            <div className="flex flex-col bg-white min-h-screen">
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
                    {userRole === 'fixer' && (<h2 className="text-black p-4 text-2x text-center">Mi Calendario</h2>
                    )}
                    {userRole === 'requester' && (<h2 className="text-black p-4 text-2x text-center">Calendario Diego Paredes</h2>
                    )}
                    <button
                        onClick={switchRole}
                        className="ml-auto w-60 bg-green-700 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                        Vista Actual: {userRole}
                    </button>

                    {userRole === 'fixer' && (
                        <div className="flex items-center ml-4">
                            <button 
                                className="w-60 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                                onClick={handleOpenAvailabilityModal}
                            >
                                Modificar Disponibilidad
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors ml-2"  onClick={openCancelModal}>
                                Cancelar
                            </button>
                        </div>
                    )}

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

                {/* Modal de cancelación */}
                <CancelDaysAppointments
                    isOpen={isCancelModalOpen}
                    onClose={closeCancelModal}
                    fixer_id={fixer_id}

                />
            </div>
        </UserRoleProvider>
    );
}
