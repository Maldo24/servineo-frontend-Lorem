import { useState } from 'react';
import { AvailabilityButton } from './AvailabilityButton';

interface DaySelectionProps {
  availableDays: Record<string, number[]>;
  onDaysChange: (days: string[]) => void;
}

export const DaySelectSection: React.FC<DaySelectionProps> = ({ availableDays, onDaysChange }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setSelectedDays(newSelectedDays);
    onDaysChange(newSelectedDays);
  };

  const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  const isDayDisabled = (day: string) => {
    return !availableDays[day] || availableDays[day].length === 0;
  };

  return (
    <div className='mb-4'>
      <div className='flex flex-col gap-2'>
        {days.map((day) => (
          <AvailabilityButton
            key={day}
            label={day}
            selected={selectedDays.includes(day)}
            disabled={isDayDisabled(day)}
            onToggle={() => toggleDay(day)}
          />
        ))}
      </div>
    </div>
  );
};
