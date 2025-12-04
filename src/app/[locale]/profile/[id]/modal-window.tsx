type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <>
      {isOpen && (
        <>
          <div
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 h-screen'
            onClick={onClose}
          />
          <div className='fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-2xl shadow-lg'>
            {children}
          </div>
        </>
      )}
    </>
  );
}
