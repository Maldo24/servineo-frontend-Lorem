'use client';
import React, { createContext, useContext, useMemo, ReactNode } from 'react';

interface AppointmentsContextType {
    isHourBookedFixer: (date: Date, hour: number) => boolean;
    isHourBooked: (date: Date, hour: number, requester_id: string) => 'self' | 'other' | 'notBooked';
    isEnabled: (date: Date, hour: number) => boolean;
    isCanceled: (date: Date, hour: number, requester_id: string) => 'fixer' | 'requester' | 'otherFixer' | 'otherRequester' | 'notCancel';
    getAppointmentsForDay: (day: number, month: number, year: number) => 'full' | 'partial' | 'available' | 'disabled';
    loading: boolean;
    refetchAll: () => void;
    refetchHour: (date: Date, hour: number) => void;
}

const AppointmentsContext = createContext<AppointmentsContextType | null>(null);

export function useAppointmentsContext() {
    const context = useContext(AppointmentsContext);
    if (!context) {
        throw new Error('useAppointmentsContext must be within AppointmentsProvider');
    }
    return context;
}

interface AppointmentsProviderProps {
    children: ReactNode;
    isHourBookedFixer: (date: Date, hour: number) => boolean;
    isHourBooked: (date: Date, hour: number, requester_id: string) =>
        'self' | 'other' | 'notBooked';
    isEnabled: (date: Date, hour: number) => boolean;
    isCanceled: (date: Date, hour: number, requester_id: string) =>
        'fixer' | 'requester' | 'otherFixer' | 'otherRequester' | 'notCancel';
    getAppointmentsForDay: (day: number, month: number, year: number) => 'full' | 'partial' | 'available' | 'disabled';
    loading: boolean;
    refetchAll: () => void;
    refetchHour: (date: Date, hour: number) => void;
}

export function AppointmentsProvider({
    children,
    isHourBookedFixer,
    isHourBooked,
    isEnabled,
    isCanceled,
    getAppointmentsForDay,
    loading,
    refetchAll,
    refetchHour
}: AppointmentsProviderProps) {
    const value = useMemo(
        () => ({
            isHourBookedFixer,
            isHourBooked,
            isEnabled,
            isCanceled,
            getAppointmentsForDay,
            loading,
            refetchAll,
            refetchHour
        }),
        [isHourBookedFixer, isHourBooked, isEnabled, isCanceled, getAppointmentsForDay, loading, refetchAll, refetchHour]
    );

    return (
        <AppointmentsContext.Provider value={value}>
            {children}
        </AppointmentsContext.Provider>
    );
}
