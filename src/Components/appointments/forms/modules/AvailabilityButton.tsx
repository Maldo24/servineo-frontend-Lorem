import React from 'react';

interface DayButtonProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  isDay?: boolean;
  onToggle: () => void;
}

export const AvailabilityButton: React.FC<DayButtonProps> = ({
  label,
  selected,
  disabled = false,
  isDay = true,
  onToggle,
}) => {
  const getButtonStyles = () => {
    if (disabled) {
      return 'bg-[#64748B] text-white border-[#64748B] cursor-not-allowed';
    }
    if (selected) {
      return 'bg-[#2B6AE0] text-white border-[#2B6AE0] hover:bg-[#1E5BC7]';
    }
    return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
  };

  const getCheckboxStyles = () => {
    if (disabled) {
      return 'border-white bg-white opacity-30';
    }
    if (selected) {
      return 'border-white bg-white';
    }
    return 'border-gray-400 bg-white';
  };

  const completeHourLabel = (hour: string) => {
    const startHour = parseInt(hour);
    const endHour = startHour + 1;

    const formatHour = (h: number) => {
      return h.toString().padStart(2, '0');
    };

    return `${formatHour(startHour)}:00 - ${formatHour(endHour)}:00`;
  };

  return (
    <button
      type='button'
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={`
      relative flex items-center justify-between 
      w-full px-4 py-2 rounded-lg border-2  {/* py-3 → py-2 */}
      transition-all duration-200 
      font-medium text-sm
      ${getButtonStyles()}
      ${!disabled ? 'cursor-pointer' : ''}
    `}
    >
      {isDay ? (
        <span className={`font-medium ${disabled ? 'text-white opacity-90' : ''}`}>
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
      ) : (
        <span className={`font-medium `}>{completeHourLabel(label)}</span>
      )}

      <div
        className={`
      w-4 h-4 border-2 rounded-sm flex items-center justify-center {/* w-5/h-5 → w-4/h-4 */}
      transition-all duration-200
      ${getCheckboxStyles()}
    `}
      >
        {selected && !disabled && (
          <svg
            width='10'
            height='10'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#2B6AE0'
            strokeWidth='3'
          >
            <path d='M20 6L9 17l-5-5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        )}
      </div>
    </button>
  );
};
