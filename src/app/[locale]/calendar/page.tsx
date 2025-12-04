'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

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
import { useSearchParams } from 'next/navigation';


import DatePicker from '@/Components/list/DatePicker/DatePicker';




//segundo
//const requester_id = '68f518e5ef03787169f81b22';

export default function CalendarPage() {
    const router = useRouter();
    const modeModalRef = useRef<ModeSelectionModalHandles>(null);
    const searchParams = useSearchParams();
    const userRole = searchParams.get('role') as 'requester' | 'fixer';

    const input1Ref = useRef<HTMLInputElement>(null);
    const input2Ref = useRef<HTMLInputElement>(null);

    const [fixer_id, setFixerId] = useState<string>('692fcd08dc02551862744940');
    const [requester_id, setRequesterId] = useState<string>('692fdb88e984cce53d54cfb4');

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


    const switchID = () => {
        if (input1Ref.current && input2Ref.current) {
            setFixerId(input1Ref.current.value);
            setRequesterId(input2Ref.current.value);
            refetchAll();
        }

    };

    const handleOpenAvailabilityModal = () => {
        modeModalRef.current?.open();
    };

    const openCancelModal = () => {
        setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        setIsCancelModalOpen(false);
    };

    /*   Esto quedara como vestigio del lorem 
       *   const handleConfirmCancel = (selectedDays: string[]) => {
              //por alguna razon que no se explicar mandamos la logica pero xd funcion tonta que no quiero refactorizar 
          }*/

    const {
        isHourBookedFixer,
        isHourBooked,
        isEnabled,
        isCanceled,
        refetch: refetchSixMonths,
        refetchHour,
        loading,
    } = useSixMonthsAppointments(fixer_id, today);

    const { getAppointmentsForDay, refetch: refetchConts } = useDailyConts({ date: today, fixer_id });

    const refetchAll = useCallback(() => {
        refetchSixMonths();
        refetchConts();
    }, [refetchSixMonths, refetchConts]);

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
                                        Calendario Diego Paredes
                                    </h2>
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
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <label className="text-sm mb-1">fixerID</label>
                                        <input
                                            type="text"
                                            ref={input1Ref}
                                            placeholder="id fixer"
                                            defaultValue={fixer_id}
                                            className="border p-2 rounded"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm mb-1">RequesterID</label>
                                        <input
                                            type="text"
                                            ref={input2Ref}
                                            defaultValue={requester_id}
                                            placeholder="id requester"
                                            className="border p-2 rounded"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={switchID}
                                    className="w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer text-sm"
                                >
                                    Aceptar
                                </button>
                            </div>
                            <div className="hidden md:flex md:items-center md:ml-auto md:mr-4 md:gap-4">
                                <div className="flex w-150">
                                    <label>fixerID</label>
                                    <input
                                        type="text"
                                        ref={input1Ref}
                                        defaultValue={fixer_id}
                                        placeholder="id fixer"
                                        className="border p-2 w-70 rounded"
                                    />
                                    <label>requesterID</label>
                                    <input
                                        type="text"
                                        ref={input2Ref}
                                        defaultValue={requester_id}
                                        placeholder="id requester"
                                        className="border p-2 w-70 rounded"
                                    />
                                </div>
                                <button
                                    onClick={switchID}
                                    className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
                                >
                                    Aceptar
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
        </UserRoleProvider >
    );
}
