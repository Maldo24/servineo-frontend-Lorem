import { getJobForFixerInfo } from '@/services/job-info';
import { ModalComponent } from '@/shared/ui/ModalComponent';
import { JobDetails } from '@/types/job';
import { useEffect, useState } from 'react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  dataId: string;
  fixerId: string;
}

export const DetailsModal = ({ isOpen, onClose, onAccept, dataId, fixerId }: ReviewModalProps) => {
  const [data, setData] = useState<JobDetails | null>(null);

  useEffect(() => {
    if (!dataId || !fixerId) return;

    const fetchJobDetails = async () => {
      try {
        const response = await getJobForFixerInfo(dataId, fixerId);
        setData({
          title: response.title,
          date: response.createdAt ? new Date(response.createdAt).toLocaleDateString() : '',
          rating: response.rating,
          description: response.description,
          serviceType: response.type ?? '',
          comment: response.comment,
        });
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
    fetchJobDetails();
  }, [dataId, fixerId]);

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} Accept={onAccept}>
      <div className='flex flex-col gap-4 w-[500px] max-w-[90%] text-left bg-white rounded-xl p-6'>
        <div className='flex justify-between items-start'>
          <div>
            <h2 className='text-lg font-semibold text-gray-800'>{data?.title}</h2>
            <p className='text-sm text-gray-400'>Date: {data?.date}</p>
          </div>
          <div className='flex gap-1'>
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`${i < (data?.rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'} text-xl`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className='text-sm text-gray-700 leading-relaxed'>
          <p className='font-semibold mb-1'>Descripción</p>
          <p>{data?.description}</p>
        </div>

        <div className='text-sm text-gray-700'>
          <p className='font-semibold mb-1'>Tipo de servicio:</p>
          <p>{data?.serviceType}</p>
        </div>

        <div className='text-sm text-gray-700'>
          <p className='font-semibold mb-1'>Comentario:</p>
          <p>{data?.comment}</p>
        </div>
      </div>
    </ModalComponent>
  );
};
