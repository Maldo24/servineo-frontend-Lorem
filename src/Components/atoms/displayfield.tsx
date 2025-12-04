// atoms/inputs/DisplayField.tsx
interface DisplayFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  className?: string;
}

export const DisplayField = ({
  label,
  value,
  placeholder = 'No especificado',
  className = '',
}: DisplayFieldProps) => {
  return (
    <div className={`block ${className}`}>
      <span className='text-sm font-medium text-gray-700'>{label}</span>
      <div className='mt-1 p-2 bg-gray-50 border border-gray-300 rounded text-gray-900 min-h-[42px] flex items-center'>
        {value || <span className='text-gray-500 italic'>{placeholder}</span>}
      </div>
    </div>
  );
};
