"use client";

import { WeekAvailabilityModal, WeekAvailabilityModalHandles } from '@/components/appointments/forms/WeekAvailabilityModal';
import { DaySelectionModal, DaySelectionModalHandles } from '@/components/appointments/forms/DaySelectionModal';
import { DayAvailabilityModal, DayAvailabilityModalHandles } from '../../components/appointments/forms/DayAvailabilityModal';
import { ModeSelectionModal, ModeSelectionModalHandles } from '@/components/appointments/forms/ModeSelectionModal';
import { UserRoleProvider } from "@/utils/contexts/UserRoleContext";

import { useRef } from 'react';

const fixer_id = "68e87a9cdae3b73d8040102f";
const requester_id = "68ec99ddf39c7c140f42fcfa";
const userRole = 'fixer';

export const TestPage = () => {
  const weekModalRef = useRef<WeekAvailabilityModalHandles>(null);
  const dayModalRef = useRef<DaySelectionModalHandles>(null);
  const modeModalRef = useRef<ModeSelectionModalHandles>(null);

  return (
    <UserRoleProvider
      role={userRole}
      fixer_id={fixer_id}
      requester_id={requester_id}
    >
      <div className="p-4 space-y-4">
        <div className="space-x-2">
          <button 
            onClick={() => modeModalRef.current?.open()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Abrir Modal de Modo
          </button>

          <button 
            onClick={() => weekModalRef.current?.open()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Abrir Modal Semanal
          </button>
          
          <button 
            onClick={() => dayModalRef.current?.open()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Abrir Modal de Días
          </button>
        </div>
        
        <WeekAvailabilityModal ref={weekModalRef} />
        <DaySelectionModal ref={dayModalRef} />
        <ModeSelectionModal ref={modeModalRef} />
      </div>
    </UserRoleProvider>
  );
};

export default TestPage;