import Modal from '../../[locale]/profile/[id]/modal-window';
import { useRegisterJob } from '../hooks/useRegisterJob';
import { useState, useEffect } from 'react';

type RegisterJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
};

const kilometers = 3;
const distance = 3.53 * kilometers;
const center = -0.0792 * kilometers ** 3 + 0.8576 * kilometers ** 2 - 4.0616 * kilometers + 7.2885;

export default function RegisterJobModal({ isOpen, onClose, id }: RegisterJobModalProps) {
  const { data } = useRegisterJob(id);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else if (isOpen) {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!userLocation) {
      alert('Cannot save: User location not available');
      return;
    }

    setIsSaving(true);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='w-[40rem] h-[30rem] bg-white py-4 border-2 rounded-2xl border-gray-900 text-black'>
        <div className='overflow-y-auto h-[27rem] font-sans px-8'>
          <h2 className='text-2xl font-bold text-center mb-4'>Registration</h2>

          <div className='mb-4'>
            <p className='text-sm font-semibold mb-1'>Detail:</p>
            <p className='text-sm'>{`Title: ${data?.title}`}</p>
          </div>

          <div className='mb-4'>
            <p className='text-sm font-semibold mb-1'>Description:</p>
            <p className='text-sm'>{data?.description}</p>
          </div>

          <div className='mb-4'>
            <p className='text-sm font-semibold'>
              Date: <span className='font-normal'>{data?.createdAt}</span>
            </p>
          </div>

          <div className='mb-4'>
            <p className='text-sm font-semibold mb-2'>Location:</p>
            <div className='w-full h-48 bg-blue-50 rounded-2xl border-2 border-gray-900 overflow-hidden relative flex justify-center'>
              <div
                style={{
                  width: `${distance}rem`,
                  height: `${distance}rem`,
                  transform: `translateY(${center}rem)`,
                }}
                className='absolute border border-black rounded-full bg-transparent flex justify-center items-center pointer-events-none z-10'
              ></div>
              <iframe
                src={`https://www.google.com/maps?q=${data?.UbicacionOriginal === 'DESCONOCIDO' ? data.UbicacionOriginal : '-17.389889414299798, -66.22317583795535'}&z=13&output=embed`}
                width='100%'
                height='100%'
                style={{ border: 0, pointerEvents: 'auto' }}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className='mb-4'>
            <p className='text-sm font-semibold'>{`Estado: ${data?.status}`}</p>
          </div>
          {locationError && (
            <div className='mb-4'>
              <p className='text-sm font-semibold text-red-600'>{`Location Error: ${locationError}`}</p>
            </div>
          )}

          <div className='flex justify-end gap-3'>
            <button
              onClick={onClose}
              className='px-5 py-2 text-sm font-medium bg-white border border-gray-900 rounded-md hover:bg-gray-50 transition-colors'
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              disabled={!userLocation || isSaving}
              className='px-5 py-2 text-sm font-medium bg-black text-white border border-gray-900 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {isSaving ? 'Saving...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
