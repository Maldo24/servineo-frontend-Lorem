"use client";

import { useEffect, useState } from "react";
import DatePicker from "@/componentsLorem/list/DatePicker/DatePicker";
const API = process.env.NEXT_PUBLIC_BACKEND as string;

import axios from 'axios';

export interface Schedule {
    _id: string;
    appointment_description: string;
    starting_time: string;
    finishing_time: string;
    schedule_state: string;
    display_name_location: string;
    lat: number;
    lon: number;
}

// Define la interfaz para las props
interface MobileWeekViewProps {
    fixerId: string;
    requesterId: string;
    selectedDate: Date;
    onChangeDate: (newDate: Date) => void;
}

// Función para obtener el día del mes (1-31) de una fecha
function getDayOfMonth(date: Date): number {
    return date.getDate();
}

// Función para obtener el mes de una fecha (0-11)
function getMonthFromDate(date: Date): number {
    return date.getMonth();
}

function groupSchedulesByMonthAndDay(fixerSchedules: Schedule[]): Map<string, Schedule[]> {
    const schedulesMap = new Map<string, Schedule[]>();

    fixerSchedules.forEach(schedule => {
        const scheduleDate = new Date(schedule.starting_time);
        const month = scheduleDate.getMonth();
        const day = scheduleDate.getDate();

        // Crear una clave única para el día (mes-día)
        const key = `${month}-${day}`;

        if (!schedulesMap.has(key)) {
            schedulesMap.set(key, []);
        }

        schedulesMap.get(key)!.push(schedule);
    });

    return schedulesMap;
}

// Función para obtener las próximas 4 semanas
function getNextFourWeeks(): { startDate: Date; endDate: Date; days: Date[] }[] {
    const weeks = [];
    const today = new Date();

    // Si es fin de semana (sábado = 6, domingo = 0), empezar desde la próxima semana
    let startDate = new Date(today);
    if (today.getDay() === 0 || today.getDay() === 6) {
        startDate.setDate(today.getDate() + (7 - today.getDay()));
    }

    // Ajustar al lunes de la semana actual o próxima
    startDate.setDate(startDate.getDate() - (startDate.getDay() - 1));

    for (let i = 0; i < 4; i++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (i * 7));

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 4); // Lunes a Viernes

        const days = [];
        for (let j = 0; j < 5; j++) { // Solo días de semana (lunes a viernes)
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + j);
            days.push(day);
        }

        weeks.push({
            startDate: weekStart,
            endDate: weekEnd,
            days: days
        });
    }

    return weeks;
}

// Función para formatear fecha
function formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
    });
}

// Función para obtener el nombre del día
function getDayName(date: Date): string {
    return date.toLocaleDateString('es-ES', { weekday: 'long' });
}

function combineSchedules(
    currentRequesterSchedules: Schedule[],
    otherRequesterSchedules: Schedule[]
): Schedule[] {
    // Combinar ambos arrays
    const combined = [
        ...currentRequesterSchedules,
        ...otherRequesterSchedules
    ];

    for (const schedule of currentRequesterSchedules) {
        if (schedule.schedule_state != 'cancelled') {
            schedule.schedule_state = 'booked';
        }
    }

    for (const schedule of otherRequesterSchedules) {
        schedule.schedule_state = 'occupied';
    }

    // Ordenar por starting_time ascendente (con Z)
    combined.sort((a, b) => a.starting_time.localeCompare(b.starting_time));

    // Convertir a formato sin Z después del sort
    const schedulesWithoutZ = combined.map(schedule => ({
        ...schedule,
        starting_time: schedule.starting_time ? schedule.starting_time.replace('Z', '') : '',
        finishing_time: schedule.finishing_time ? schedule.finishing_time.replace('Z', '') : ''
    }));

    return schedulesWithoutZ;
}

export default function MobileWeekView({ fixerId, requesterId, selectedDate, onChangeDate }: MobileWeekViewProps) {
    const month = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
    const [schedulesMap, setSchedulesMap] = useState<Map<string, Schedule[]>>(new Map());
    const [loading, setLoading] = useState(true);

    async function fetchWeekSchedule() {
        try {
            setLoading(true);

            const [currentRequesterResponse, otherRequesterResponse] = await Promise.all([
                axios.get(`${API}/api/crud_read/schedules/get_by_fixer_current_requester_month`, {
                    params: {
                        fixer_id: fixerId,
                        requester_id: requesterId,
                        month: month + 1
                    }
                }),
                axios.get(`${API}/api/crud_read/schedules/get_by_fixer_other_requesters_month`, {
                    params: {
                        fixer_id: fixerId,
                        requester_id: requesterId,
                        month: month + 1
                    }
                })
            ]);

            const currentRequesterFixerSchedules = currentRequesterResponse.data;
            const otherRequesterFixerSchedules = otherRequesterResponse.data;

            const fixerSchedules: Schedule[] = combineSchedules(currentRequesterFixerSchedules, otherRequesterFixerSchedules);
            const schedulesByMonthAndDay = groupSchedulesByMonthAndDay(fixerSchedules);

            console.log("Schedules grouped by month and day:", schedulesByMonthAndDay);
            setSchedulesMap(schedulesByMonthAndDay);

        } catch (err) {
            console.error("Error al generar los slots para el fixer:", err);
        } finally {
            setLoading(false);
        }
    }

    // Determinar el estado del día basado en la cantidad de horarios para esa fecha específica
    function getDayStatus(day: Date): { text: string; color: string; available: boolean } {
        const month = getMonthFromDate(day);
        const dayOfMonth = getDayOfMonth(day);
        const key = `${month}-${dayOfMonth}`;

        const daySchedules = schedulesMap.get(key) || [];

        if (daySchedules.length >= 1) {
            return { text: "Ocupado", color: "text-slate-400", available: false };
        } else {
            return { text: "Horarios Disponibles", color: "text-emerald-600", available: true };
        }
    }

    useEffect(() => {
        fetchWeekSchedule();
    }, [month, fixerId]);

    const weeks = getNextFourWeeks();

    if (loading) {
        return (
            <div className="mx-auto max-w-sm p-4 bg-white">
                <div className="flex justify-center items-center h-32">
                    <p className="text-black">Cargando horarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-sm p-4 bg-white min-h-screen">
            <h1 className="text-2xl font-semibold mb-3 text-black">
                Calendario de usuario
            </h1>
            <div className="mb-3">
                <label className="block text-sm mb-1 text-black">Fecha</label>
                <DatePicker
                    selectedDate={selectedDate}
                    onDateChange={onChangeDate}
                />
            </div>

            {/* Renderizado de las semanas */}
            <div className="space-y-6">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                        {/* Título de la semana */}
                        <h3 className="text-lg font-semibold mb-3 text-center text-black">
                            {formatDate(week.startDate)} - {formatDate(week.endDate)}
                        </h3>

                        {/* Días de la semana */}
                        <div className="space-y-2">
                            {week.days.map((day, dayIndex) => {
                                const dayStatus = getDayStatus(day);
                                return (
                                    <div
                                        key={dayIndex}
                                        className="flex justify-between items-center p-2 border-b border-gray-200 bg-white rounded-lg"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium capitalize text-black">
                                                {getDayName(day)}
                                            </span>
                                            <span className="text-sm text-gray-700">
                                                {formatDate(day)}
                                            </span>
                                        </div>

                                        {dayStatus.available ? (
                                            <button
                                                className={`font-bold ${dayStatus.color} cursor-default`}
                                                disabled
                                            >
                                                {dayStatus.text}
                                            </button>
                                        ) : (
                                            <span className={`font-bold ${dayStatus.color}`}>
                                                {dayStatus.text}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
