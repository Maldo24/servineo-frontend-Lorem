import { CircularDayButton } from './CircularDayButton';

interface WeekDaysSectionProps {
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
}

export const WeekDaysSection = ({ 
  selectedDays, 
  onDaysChange 
}: WeekDaysSectionProps) => {
  
  const toggleDay = (day: string) => {
    const newSelectedDays = selectedDays.includes(day) 
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    onDaysChange(newSelectedDays);
  };

  const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

  return (
    <div className="mb-6">
      
      <div className="flex justify-between items-center mb-4">
        {days.map(day => (
          <CircularDayButton
            key={day}
            day={day}
            selected={selectedDays.includes(day)}
            onToggle={toggleDay}
          />
        ))}
      </div>
    </div>
  );
};