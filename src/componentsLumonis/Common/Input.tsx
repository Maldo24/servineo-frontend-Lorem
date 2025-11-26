interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input = ({
  label,
  error,
  className = "",
  containerClassName = "",
  ...props
}: InputProps) => {
  const containerClasses = ["w-full", containerClassName].filter(Boolean).join(' ');
  const inputClasses = [
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
    "text-gray-900 placeholder-gray-400",
    "disabled:bg-gray-100 disabled:cursor-not-allowed",
    "transition-all duration-200",
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;