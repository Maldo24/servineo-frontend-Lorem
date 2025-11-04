import { Button } from "@/components/atoms/button";

interface ModeSelectionActionsProps{
    fixerId: string;
    openWeek: () => void;
    openDaySelection: () => void;
}

export const ModeSelectionActions = ({
    fixerId,
    openWeek,
    openDaySelection  
}: ModeSelectionActionsProps ) => {

    return(
        <div className="space-y-4">
            <div className="text-center mb-6">
                <p className="text-gray-600 text-sm">
                    Elige cómo quieres configurar tu disponibilidad
                </p>
            </div>

            <div className="space-y-3">
                <Button
                    onClick={openWeek}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                    Configuración Semanal
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                    Define días laborales y horarios para toda la semana
                </p>

                <div className="border-t border-gray-200 my-2"></div>

                <Button
                    onClick={openDaySelection}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                    Configuración por Días
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                    Selecciona días específicos para modificar sus horarios
                </p>
            </div>
        </div>
    );
}