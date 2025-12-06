'use client';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DesktopCalendar from '@/Components/calendar/DesktopCalendar';
import { UserRoleProvider } from '@/app/lib/utils/contexts/UserRoleContext';
import MobileCalendar from '@/Components/calendar/mobile/MobileCalendar';
import MobileList from '@/Components/list/MobileList';
import { ModeSelectionModal, ModeSelectionModalHandles } from '@/Components/appointments/forms/ModeSelectionModal';
import CancelDaysAppointments from '@/Components/appointments/forms/CancelDaysAppointment';
import useDailyConts from '@/app/lib/utils/useDailyConts';
import useSixMonthsAppointments from '@/hooks/useSixMonthsAppointments';
import { AppointmentsProvider } from '@/app/lib/utils/contexts/AppointmentsContext/AppoinmentsContext';
import { AppointmentsStatusProvider } from '@/app/lib/utils/contexts/DayliViewRequesterContext';

import DatePicker from '@/Components/list/DatePicker/DatePicker';

export type UserRole = 'fixer' | 'requester';

export default function CalendarPage() {
    const router = useRouter();
    const modeModalRef = useRef<ModeSelectionModalHandles>(null);

    const [userRole, setUserRole] = useState<UserRole>('fixer');
    const [fixer_id, setFixerId] = useState<string>('');
    const [requester_id, setRequesterId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedRole = sessionStorage.getItem('roluser');
        const role: UserRole = (storedRole === 'requester' || storedRole === 'fixer')
            ? storedRole
            : 'fixer';
        setUserRole(role);

        const userData = JSON.parse(localStorage.getItem('servineo_user') || '{}');
        const userId = userData.id || '';

        if (role === 'requester') {
            setFixerId(sessionStorage.getItem('fixer_id') || '');
            setRequesterId(userId);
        } else {
            setFixerId(userId);
            setRequesterId('');
        }

        setIsLoading(false); // 👈 Marcar como cargado
    }, []);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectDate, setSelectDate] = useState<Date>(new Date());
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const handleDataChange = (newDate: Date) => {
        setSelectedDate(newDate);
    };

    console.log(fixer_id, "fixer");
    console.log(requester_id, "requester");

    const handleOpenAvailabilityModal = () => {
        modeModalRef.current?.open();
    };

    const openCancelModal = () => {
        setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        setIsCancelModalOpen(false);
    };

    // 👇 Solo ejecutar hooks cuando fixer_id esté listo
    const {
        isHourBookedFixer,
        isHourBooked,
        isEnabled,
        isCanceled,
        refetch: refetchSixMonths,
        refetchHour,
        loading,
    } = useSixMonthsAppointments(fixer_id || 'placeholder', today);

    const { getAppointmentsForDay, refetch: refetchConts } = useDailyConts({
        date: today,
        fixer_id: fixer_id || 'placeholder'
    });

    const refetchAll = useCallback(() => {
        if (fixer_id) { // 👈 Solo refetch si hay ID válido
            refetchSixMonths();
            refetchConts();
        }
    }, [refetchSixMonths, refetchConts, fixer_id]);

    const providerValue = useMemo(
        () => ({
            isHourBookedFixer,
            isHourBooked,
            isEnabled,
            isCanceled,
            getAppointmentsForDay,
            refetchAll,
            refetchHour,
            loading,
        }),
        [
            isHourBookedFixer,
            isHourBooked,
            isEnabled,
            isCanceled,
            refetchAll,
            refetchHour,
            getAppointmentsForDay,
            loading,
        ],
    );

    // 👇 Mostrar pantalla de carga mientras se inicializa
    if (isLoading || !fixer_id) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando calendario...</p>
                </div>
            </div>
        );
    }

    return (
        <UserRoleProvider role={userRole} fixer_id={fixer_id} requester_id={requester_id}>
            <AppointmentsProvider
                isHourBookedFixer={providerValue.isHourBookedFixer}
                isHourBooked={providerValue.isHourBooked}
                isEnabled={providerValue.isEnabled}
                isCanceled={providerValue.isCanceled}
                getAppointmentsForDay={providerValue.getAppointmentsForDay}
                refetchAll={providerValue.refetchAll}
                refetchHour={providerValue.refetchHour}
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
                                    className="p-2 m-4 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors self-start"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
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
                                    <h2 className="text-black p-4 text-xl text-center flex-1">
                                        Calendario                                     </h2>
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
                            </div>

                            <div className="hidden md:flex md:items-center md:ml-auto md:mr-4 md:gap-4">
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

                        <div className="hidden md:flex flex-col items-center justify-center gap-4 w-full">
                            <div className="w-full flex justify-center">
                                <DatePicker
                                    selectedDate={selectDate}
                                    onDateChange={setSelectDate}
                                />
                            </div>

                            <div className="w-full flex justify-center">
                                <DesktopCalendar
                                    selectedDate={selectDate}
                                    onDateChange={setSelectDate}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:hidden justify-center gap-4">
                            <MobileCalendar selectedDate={selectedDate} onSelectDate={handleDataChange} />
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
