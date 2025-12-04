import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

const Accordion = ({
  title,
  children,
  isOpen: isOpenProp,
  onToggle,
  className = '',
}: AccordionProps) => {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isControlled = isOpenProp !== undefined;
  const isOpen = isControlled ? isOpenProp : isOpenInternal;

  const toggle = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setIsOpenInternal(!isOpen);
    }
  };

  const headerClasses = [
    'flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-left',
    'bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200',
    isOpen ? 'rounded-b-none' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const contentClasses = [
    'overflow-hidden transition-all duration-200 ease-in-out',
    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      <button type='button' className={headerClasses} onClick={toggle}>
        <span className='text-gray-700'>{title}</span>
        <ChevronDown
          className={[
            'w-4 h-4 text-gray-500 transform transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </button>
      <div className={contentClasses}>
        <div className='p-4 bg-white border border-t-0 border-gray-200 rounded-b-lg'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
