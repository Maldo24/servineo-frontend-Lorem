import {AvailabilityButton} from '@/componentsLorem/appointments/forms/modules/AvailabilityButton'

interface SelectHourSectionProps{
  selectedHours: number[];
  onHoursChange: (hours: number[]) => void;
}

export const SelectHourSection = ({ 
  selectedHours, 
  onHoursChange 
}: SelectHourSectionProps) => {
  
  const toggleHour = (hour: number) => {
    const newSelectedHours = selectedHours.includes(hour) 
      ? selectedHours.filter(h => h !== hour)
      : [...selectedHours, hour];

    onHoursChange(newSelectedHours);
  };

  const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  return (
    <div className="mb-6">
      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
        <div className="flex flex-col gap-2">
          {hours.map(hour => (
            <AvailabilityButton
              key={hour}
              label={hour.toString()}
              selected={selectedHours.includes(hour)}
              onToggle={() => toggleHour(hour)}
              disabled={false}
              isDay={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};