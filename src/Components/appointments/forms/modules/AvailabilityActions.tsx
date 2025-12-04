import { Button } from '@/Components/atoms/button';

interface AvailabilityActionsProps {
  onCancel: () => void;
  confirmPlaceholder: string;
  onConfirm: () => void;
  confirmDisabled?: boolean; // Agregar esta prop
}

export const AvailabilityActions = ({
  confirmPlaceholder = '',
  onCancel,
  onConfirm,
  confirmDisabled = false,
}: AvailabilityActionsProps) => {
  return (
    <div className='flex items-center justify-end gap-2 pt-2'>
      <Button variant='secondary' onClick={onCancel}>
        Cancelar
      </Button>
      <Button variant='primary' onClick={onConfirm} disabled={confirmDisabled}>
        {confirmPlaceholder}
      </Button>
    </div>
  );
};
