interface EditAppointmentHeaderProps {
  onClose: () => void;
  title?: string;
}

export const EditAppointmentHeader = ({
  onClose,
  title = 'Editar Cita',
}: EditAppointmentHeaderProps) => {
  return (
    <div className='flex items-start justify-between'>
      <h3 id='edit-appointment-title' className='text-lg font-semibold text-black'>
        {title}
      </h3>
      <button aria-label='Cerrar' className='text-gray-500 hover:text-gray-700' onClick={onClose}>
        ✕
      </button>
    </div>
  );
};
