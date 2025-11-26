"use client";

import { useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';

import { AvailabilityActions } from './modules/AvailabilityActions';
import { AvailabilityHeader } from './modules/AvailabilityHeader';
import { WeekDaysSection } from './modules/WeekDaysSection';
import { useAppointmentsContext } from '@/utils/contexts/AppointmentsContext/AppoinmentsContext';

import useMessage from '@/hooks/useMessage';
import Message from '@/componentsLorem/ui/Message';
import { useAmp } from 'next/amp';

const API = process.env.NEXT_PUBLIC_BACKEND as string;

interface AvailabilityResponse {
    message: string;
    availability: {
        lunes: number[];
        martes: number[];
        miercoles: number[];
        jueves: number[];
        viernes: number[];
        sabado: number[];
        domingo: number[];
    };
}

interface WeekAvailabilityModalProps {
    fixerId?: string;
    onClose?: () => void;
}

export interface WeekAvailabilityModalHandles {
    open: () => void;
    close: () => void;
}

export const WeekAvailabilityModal = forwardRef<WeekAvailabilityModalHandles, WeekAvailabilityModalProps>(
    ({ fixerId, onClose }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [selectedDays, setSelectedDays] = useState<string[]>([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const { showMessage, hideMessage, messageState } = useMessage();


        const { refetchAll } = useAppointmentsContext();
        useImperativeHandle(ref, () => ({
            open: () => {
                setIsOpen(true);
                loadPreviousConfiguration();
            },
            close: () => handleClose()
        }), []);

        const loadPreviousConfiguration = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get<AvailabilityResponse>(
                    `${API}/api/crud_read/appointments/get_fixer_availability?fixer_id=${fixerId}`
                );

                const availability = response.data.availability;

                const daysWithAvailability = Object.entries(availability)
                    .filter(([_, hours]) => hours.length > 0)
                    .map(([day, _]) => day);

                const abbreviatedDays = daysWithAvailability.map((day: string) => {
                    switch (day.toLowerCase()) {
                        case 'lunes': return 'Lun';
                        case 'martes': return 'Mar';
                        case 'miercoles': return 'Mie';
                        case 'jueves': return 'Jue';
                        case 'viernes': return 'Vie';
                        case 'sabado': return 'Sab';
                        case 'domingo': return 'Dom';
                        default: return day;
                    }
                });

                setSelectedDays(abbreviatedDays);

            } catch (err) {
                setError('Error al cargar la configuración previa');
                console.error('Error loading availability:', err);
            } finally {
                setLoading(false);
            }
        };

        const handleClose = () => {
            setIsOpen(false);
            setSelectedDays([]);
            setError(null);
            onClose?.();
        };

        const handleConfirm = async () => {

            if (selectedDays.length) {
                const daysFullName = selectedDays.map(day => {
                    switch (day) {
                        case 'Lun': return 'lunes';
                        case 'Mar': return 'martes';
                        case 'Mie': return 'miercoles';
                        case 'Jue': return 'jueves';
                        case 'Vie': return 'viernes';
                        case 'Sab': return 'sabado';
                        case 'Dom': return 'domingo';
                        default: return day.toLowerCase();
                    }
                });

                // console.log('Días seleccionados:', daysFullName);

                const availabilityData: Record<string, number[]> = {
                    lunes: [],
                    martes: [],
                    miercoles: [],
                    jueves: [],
                    viernes: [],
                    sabado: [],
                    domingo: []
                };

                daysFullName.forEach(day => {
                    availabilityData[day] = [8, 9, 10, 11, 14, 15, 16, 17];
                });

                const allDays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
                allDays.forEach(day => {
                    if (!daysFullName.includes(day)) {
                        availabilityData[day] = [];
                    }
                });

                try {
                    const response = await axios.put(`${API}/api/crud_update/appointments/update_fixer_availability`, {
                        fixer_id: fixerId,
                        availability: availabilityData
                    });

                    if (response.data.updated) {
                        showMessage({
                            message: 'Días guardados correctamente',
                            type: 'success',
                            title: 'Éxito!',
                            onCloseCallback: () => {
                                handleClose();
                            }
                        });
                    } else {
                        setError('Error al actualizar la disponibilidad');
                    }
                } catch (err) {
                    console.error('Error guardando configuración:', err);
                    setError('Error al guardar la configuración');
                } finally {
                    refetchAll();
                }
            } else {
                setError('Selecciona al menos un día');
            }
        };

        const handleCancel = () => {
            handleClose();
        };

        const handleDaysChange = (days: string[]) => {
            setSelectedDays(days);
            setError(null);
        };

        if (!isOpen) return null;

        return (
            <>
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                        <AvailabilityHeader
                            headerText='Seleccionar Disponibilidad'
                            onClose={handleClose}
                        />

                        <p className="text-black font-semibold mb-4">Días de trabajo de la semana</p>

                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2">Cargando configuración...</span>
                            </div>
                        ) : error ? (
                            <div className="text-red-600 text-center py-4">
                                {error}
                                <div className="flex gap-2 justify-center mt-3">
                                    <button
                                        onClick={loadPreviousConfiguration}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        Reintentar
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <WeekDaysSection
                                    selectedDays={selectedDays}
                                    onDaysChange={handleDaysChange}
                                />

                                <p className="text-sm text-gray-700 mb-4">
                                    *Los días seleccionados (azules) se aplicarán como laborales para todas las semanas de cada mes.
                                </p>

                                <AvailabilityActions
                                    confirmPlaceholder='Guardar'
                                    onCancel={handleCancel}
                                    onConfirm={handleConfirm}
                                />
                            </>
                        )}
                    </div>
                </div>
                <Message {...messageState} />
            </>
        );
    }
);

WeekAvailabilityModal.displayName = 'WeekAvailabilityModal';
