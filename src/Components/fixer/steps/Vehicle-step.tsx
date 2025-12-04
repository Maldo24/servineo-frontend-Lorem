'use client';

import { Card } from '@/Components/Card';

interface VehicleStepProps {
  hasVehicle: boolean | null;
  vehicleType?: string;
  onHasVehicleChange: (hasVehicle: boolean) => void;
  onVehicleTypeChange: (type: string) => void;
  error?: string;
}

export function VehicleStep({
  hasVehicle,
  vehicleType = '',
  onHasVehicleChange,
  onVehicleTypeChange,
  error,
}: VehicleStepProps) {
  return (
    <Card title='Vehículo Propio'>
      <div className='space-y-4'>
        <p className='text-sm text-gray-600'>
          ¿Cuenta con vehículo propio para realizar los trabajos?
        </p>

        <div className='space-y-3'>
          <label className='flex items-center gap-3 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors'>
            <input
              type='radio'
              name='hasVehicle'
              checked={hasVehicle === true}
              onChange={() => onHasVehicleChange(true)}
              className='h-4 w-4 text-primary focus:ring-2 focus:ring-blue-500'
            />
            <div>
              <div className='font-medium text-gray-900'>Sí, tengo vehículo</div>
              <div className='text-xs text-gray-500'>
                Puedo transportar herramientas y materiales
              </div>
            </div>
          </label>

          <label className='flex items-center gap-3 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors'>
            <input
              type='radio'
              name='hasVehicle'
              checked={hasVehicle === false}
              onChange={() => onHasVehicleChange(false)}
              className='h-4 w-4 text-primary focus:ring-2 focus:ring-blue-500'
            />
            <div>
              <div className='font-medium text-gray-900'>No tengo vehículo</div>
              <div className='text-xs text-gray-500'>Me movilizo en transporte público</div>
            </div>
          </label>
        </div>

        {hasVehicle === true && (
          <div className='mt-4 animate-fade-in'>
            <label htmlFor='vehicleType' className='block text-sm font-medium text-gray-700 mb-2'>
              Tipo de vehículo
            </label>
            <select
              id='vehicleType'
              value={vehicleType}
              onChange={(e) => onVehicleTypeChange(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Seleccione un tipo</option>
              <option value='moto'>Motocicleta</option>
              <option value='auto'>Automóvil</option>
              <option value='camioneta'>Camioneta</option>
              <option value='furgoneta'>Furgoneta</option>
            </select>
          </div>
        )}

        {error && <p className='text-xs text-red-600'>{error}</p>}
      </div>
    </Card>
  );
}
