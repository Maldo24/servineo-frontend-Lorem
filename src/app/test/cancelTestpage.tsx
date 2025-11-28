'use client';
import { useState } from 'react';
import { Button } from '../../componentsLorem/atoms/button'; // Ajusta la ruta según tu estructura'
import CancelDaysAppointments from '../../componentsLorem/appointments/forms/CancelDaysAppointment';

export default function TestPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading] = useState(false);

 

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Página de Testing</h1>

            <Button
                onClick={() => setIsModalOpen(true)}
                variant="primary"
            >
                Abrir Modal de Cancelación
            </Button>

            <CancelDaysAppointments
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                loading={loading}
            />
        </div>
    );
}
