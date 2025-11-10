'use client';

import React, { createContext, useContext, useMemo, ReactNode } from 'react';

interface AppointmentsContextType {
    isHourBookedFixer: (date: Date, hour: number) => boolean;
    isHourBooked: (date: Date, hour: number, requester_id: string) => 'self' | 'other' | 'notBooked';
    isEnabled: (date: Date, hour: number) => boolean;
    isCanceled: (date: Date, hour: number, requester_id: string) => 'fixer' | 'requester' | 'other' | 'notCancel';
    loading: boolean;

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
    isHourBooked: (date: Date, hour: number, requester_id: string) => 'self' | 'other' | 'notBooked';
    isEnabled: (date: Date, hour: number) => boolean;
    isCanceled: (date: Date, hour: number, requester_id: string) => 'fixer' | 'requester' | 'other' | 'notCancel';
    loading: boolean;

}

export function AppointmentsProvider({
    children,
    isHourBookedFixer, //todos los booked para ese fixer
    isHourBooked, //self si esta ocupado por el propio requester // other si esta ocupado por otros requesters
    isEnabled, //horarios disponibles
    isCanceled, //fixer si cancelo el fixer //requester si cancelo el requeste // other si cancelo el fixer a otros
    loading
}: AppointmentsProviderProps) {
    const value = useMemo(
        () => ({ isHourBookedFixer, isHourBooked, isEnabled, isCanceled, loading }),  // ← AGREGAR
        [isHourBookedFixer, isHourBooked, isEnabled, isCanceled, loading]  // ← AGREGAR
    );

    return (
        <AppointmentsContext.Provider value={value}>
            {children}
        </AppointmentsContext.Provider>
    );
}
