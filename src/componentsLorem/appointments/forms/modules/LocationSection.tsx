export type FormType = 'create'|'edit'|'view'
interface LocationSectionProps {
  address: string;
  error?: string;
  formtype: FormType;
  onOpenLocationModal: () => void;
}

export const LocationSection = ({ address, error, onOpenLocationModal,formtype }: LocationSectionProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div
        onClick={onOpenLocationModal}
        className="text-center py-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
      >
        {
          formtype==='view' ? (
            <p className="text-sm font-medium text-gray-700">
                Ver Ubicacion
            </p>
          ) : null
        }
        {formtype !== 'view' && (
          <p className="text-sm font-medium text-gray-700">
          📍 {address ? "Editar ubicación" : "Seleccionar ubicación"}
          </p>
        )}

        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>

      {address && (
        <p className="text-sm text-green-700 px-2">
          📌 Ubicación: {address}
        </p>
      )}
    </div>
  );
};