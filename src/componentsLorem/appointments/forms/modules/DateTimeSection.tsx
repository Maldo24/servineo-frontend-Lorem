interface DateTimeSectionProps {
  datetime: string;
  modality: "virtual" | "presencial";
  onModalityChange: (value: "virtual" | "presencial") => void;
}

export const DateTimeSection = ({ datetime, modality, onModalityChange }: DateTimeSectionProps) => {
  return (
    <div className="flex gap-4 p-3 rounded items-start">
      <label className="block">
        <span className="text-sm font-medium">Fecha y hora</span>
        <input 
          readOnly 
          value={new Date(datetime).toLocaleString()} 
          className="mt-1 block w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm" 
        />
      </label>
      <div className="flex-1">
        <label className="block">
          <span className="text-sm font-medium">Modalidad</span>
          <select 
            value={modality} 
            onChange={(e) => onModalityChange(e.target.value as "virtual" | "presencial")}
            className="mt-1 block w-full border rounded px-3 py-2 text-sm"
          >
            <option value="virtual">Virtual</option>
            <option value="presencial">Presencial</option>
          </select>
        </label>
      </div>
    </div>
  );
};