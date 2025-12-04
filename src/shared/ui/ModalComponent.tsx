interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  Accept: () => void;
}

export const ModalComponent = ({ children, isOpen, onClose, Accept }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 w-full h-full bg-transparent'
      aria-modal
      onClick={
        onClose ||
        (() => {
          isOpen = false;
        })
      }
    >
      <div
        className='flex flex-col gap-6 relative bg-white p-12 rounded-4xl shadow-lg'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-8 right-8 text-gray-600 hover:text-gray-800 cursor-pointer'
          onClick={
            onClose ||
            (() => {
              isOpen = false;
            })
          }
        >
          x
        </button>
        {children}
        <button className='bg-black p-5 text-white rounded-lg' onClick={Accept}>
          Accept
        </button>
      </div>
    </div>
  );
};
