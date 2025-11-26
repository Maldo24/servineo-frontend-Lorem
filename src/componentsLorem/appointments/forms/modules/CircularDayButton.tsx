interface CircularDayButtonProps {
  day: string;
  selected: boolean;
  onToggle: (day: string) => void;
  className?: string;
}

export const CircularDayButton = ({ 
  day, 
  selected, 
  onToggle, 
  className = "" 
}: CircularDayButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(day)}
      className={`
        w-12 h-12 rounded-full border-2 flex items-center justify-center
        text-sm font-light transition-colors
        ${selected 
          ? 'bg-[#2B6AE0] border-[#2B6AE0] text-white' 
          : 'bg-white border-[#D9D9D9] text-gray-700 hover:border-gray-400'
        }
        ${className}
      `}
    >
      {day}
    </button>
  );
};