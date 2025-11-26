import { forwardRef, useImperativeHandle, useState, useRef, useContext } from 'react';
import { AvailabilityHeader } from './modules/AvailabilityHeader'
import { ModeSelectionActions } from './modules/ModeSelectionActions'
import { WeekAvailabilityModal, WeekAvailabilityModalHandles } from './WeekAvailabilityModal';
import { DaySelectionModal, DaySelectionModalHandles } from './DaySelectionModal';
import { useUserRole } from "@/utils/contexts/UserRoleContext";

export interface ModeSelectionModalHandles {
    open: () => void;
    close: () => void;
}

interface ModeSelectionModalProps {
    fixerId?: string;
}

export const ModeSelectionModal = forwardRef<ModeSelectionModalHandles, ModeSelectionModalProps>(
    ({ fixerId }, ref) => {
        const { role, fixer_id: contextFixerId } = useUserRole();
        const [isOpen, setIsOpen] = useState(false);
        const weekModalRef = useRef<WeekAvailabilityModalHandles>(null);
        const dayModalRef = useRef<DaySelectionModalHandles>(null);

        // Usar el fixerId del contexto si no se proporciona como prop
        const actualFixerId = fixerId || contextFixerId || '68f55bf8f5c96a8e785049b9';

        useImperativeHandle(ref, () => ({
            open: () => {
                // Solo permitir abrir si el usuario es fixer
                if (role === 'fixer') {
                    setIsOpen(true);
                }
            },
            close: () => handleClose()
        }), [role]);

        const handleClose = () => {
            setIsOpen(false);
        }

        const handleOpenWeek = () => {
            setIsOpen(false);
            weekModalRef.current?.open();
        }

        const handleOpenDaySelection = () => {
            setIsOpen(false);
            dayModalRef.current?.open();
        }

        // Si el usuario no es fixer, no renderizar nada
        if (role !== 'fixer') return null;

        return (
            <>
                <div className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}>
                    <div className={`max-w-md w-full bg-white rounded-lg shadow-lg p-6 ${isOpen ? 'scale-100' : 'scale-95'
                        }`}>
                        <AvailabilityHeader
                            headerText='Seleccionar Disponibilidad'
                            onClose={handleClose}
                        />

                        <p className="text-black font-semibold mb-4">Selecciona el modo de configuración</p>

                        <ModeSelectionActions
                            openWeek={handleOpenWeek}
                            openDaySelection={handleOpenDaySelection}
                            fixerId={actualFixerId}
                        />
                    </div>
                </div>

                <WeekAvailabilityModal ref={weekModalRef} fixerId={actualFixerId} />
                <DaySelectionModal ref={dayModalRef} fixerId={actualFixerId} />
            </>
        )
    }
);

ModeSelectionModal.displayName = 'ModeSelectionModal';

export default ModeSelectionModal;
