'use client';
import { useState } from 'react';
import { Button } from '@/components/atoms/button'; // Ajusta la ruta según tu estructura'
import CancelDaysAppointments from '@/components/appointments/forms/CancelDaysAppointment';

export default function TestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmCancel = async (selectedDays: string[]) => {
    setLoading(true);
    console.log('Días seleccionados para cancelar:', selectedDays);
    
    // Simular llamada API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setIsModalOpen(false);
    alert(`Se cancelarán citas en ${selectedDays.length} días`);
  };

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
        onConfirm={handleConfirmCancel}
        loading={loading}
      />
    </div>
  );
}