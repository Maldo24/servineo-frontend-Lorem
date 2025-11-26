"use client";
import { useState, useEffect } from "react";
import { getSixMonthAppointments, Appointment } from '../../utils/Appointments/getSixMonthAppointments';
import useSixMonthsAppointments from '../../hooks/Appointments/useSixMonthsAppointments';

import useDailyConts from "../../utils/useDailyConts";
const fixer_id = "68e87a9cdae3b73d8040102f";
const requester_id = "68ec99ddf39c7c140f42fcfa";
const today = new Date().toISOString().split('T')[0];

const todidi = new Date();
const todi = new Date(2025, 11, 9);
console.log(todi);
export default function CalendarPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSixMonthAppointments(fixer_id, today);
            setAppointments(data);
            console.log('✅ Datos recibidos:', data);
        } catch (err) {
            setError('Error al cargar');
            console.error('❌ Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 👇 ESTO ES LO QUE LE FALTABA
    useEffect(() => {
        fetchAppointments();
    }, []); // Se ejecuta una vez al montar el componente
    const { isHourBooked } = useSixMonthsAppointments(fixer_id, todi);

    return (
        <div className="text-black" >
            <h2> Test de getSixMonthAppointments</h2>

            <button onClick={fetchAppointments} disabled={loading}>
                {loading ? 'Cargando...' : 'Recargar datos'}
            </button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <div>
                <h3>Resultados:</h3>
                <p>Total de citas: {appointments.length}</p>

                {loading && <p>⏳ Cargando...</p>}

                {!loading && appointments.length === 0 && (
                    <p>⚠️ No hay citas</p>
                )}

                {appointments.length > 0 && (
                    <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                        {JSON.stringify(appointments, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}
