import { useState } from 'react';
import Modal from '@/app/[locale]/profile/[id]/modal-window';
import { CreatePromotion } from '@/types/promotion';

interface CreatePromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatePromotion) => Promise<void>;
  id: string;
  fixerId: string;
}

const CreatePromoModal = ({ isOpen, onClose, onSave, id, fixerId }: CreatePromoModalProps) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title cannot be empty';
    } else if (title.length > 30) {
      newErrors.title = 'Title cannot exceed 30 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description cannot be empty';
    } else if (description.length > 100) {
      newErrors.description = 'Description cannot exceed 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({ title, description, offerId: id, fixerId, price: '0' });
      setTitle('');
      setDescription('');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating promotion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setErrors({});
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (errors.title) {
      setErrors({ ...errors, title: undefined });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    if (errors.description) {
      setErrors({ ...errors, description: undefined });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='flex flex-col gap-6 relative bg-white p-12 rounded-4xl shadow-lg'>
        <button
          className='absolute top-8 right-8 text-gray-600 hover:text-gray-800 cursor-pointer'
          onClick={handleClose}
        >
          x
        </button>

        <div className='flex flex-col gap-4 w-[500px] max-w-full'>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <label htmlFor='promo-title' className='font-bold text-sm text-gray-800'>
                Promo title:
              </label>
              <span className={`text-xs ${title.length > 30 ? 'text-red-500' : 'text-gray-500'}`}>
                {title.length}/30
              </span>
            </div>
            <input
              id='promo-title'
              type='text'
              value={title}
              autoComplete='off'
              onChange={handleTitleChange}
              className={`border text-black border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 ${
                errors.title ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              maxLength={31}
            />
            {errors.title && <span className='text-xs text-red-500'>{errors.title}</span>}
          </div>

          <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <label htmlFor='promo-description' className='font-bold text-sm text-gray-800'>
                Promo description:
              </label>
              <span
                className={`text-xs ${description.length > 100 ? 'text-red-500' : 'text-gray-500'}`}
              >
                {description.length}/100
              </span>
            </div>
            <textarea
              id='promo-description'
              value={description}
              autoComplete='off'
              onChange={handleDescriptionChange}
              className={`border text-black border-gray-300 rounded-xl p-3 h-32 resize-none focus:outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              maxLength={101}
            />
            {errors.description && (
              <span className='text-xs text-red-500'>{errors.description}</span>
            )}
          </div>
        </div>

        <button
          className='bg-blue-600 hover:bg-blue-700 p-3 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save promo'}
        </button>
      </div>
    </Modal>
  );
};

export default CreatePromoModal;
