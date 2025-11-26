interface HeaderProps {
  onClose: () => void;
  headerText: string;
}

export const AvailabilityHeader = ({ headerText, onClose }: HeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-gray-600"
        >
          <path d="M8 2v4"/>
          <path d="M16 2v4"/>
          <rect width="18" height="18" x="3" y="4" rx="2"/>
          <path d="M3 10h18"/>
        </svg>

        <h3 id="edit-appointment-title" className="text-lg font-semibold text-black">
          {headerText}
        </h3>
        
      </div>
      <button 
        aria-label="Cerrar" 
        className="text-gray-500 hover:text-gray-700" 
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
};