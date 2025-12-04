'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPromotionsByOfferId, deletePromotion } from '@/services/promotions';
import { getJobInfo } from '@/services/job-info';
import { Promotion } from '@/types/promotion';

export default function JobPromotionsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [jobTitle, setJobTitle] = useState<string>('Detalle del Trabajo');
  const [loading, setLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      try {
        const jobData = await getJobInfo(jobId);
        if (jobData?.title) setJobTitle(jobData.title);
      } catch (e) {
        console.warn('No se pudo cargar info del trabajo.', e);
      }

      const promosData = await getPromotionsByOfferId(jobId);
      setPromotions(Array.isArray(promosData) ? promosData : []);
    } catch (error) {
      console.error('Error general:', error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) loadData();
  }, [jobId, loadData]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const deletePromises = selectedIds.map((id) => deletePromotion(id));
      await Promise.all(deletePromises);

      await loadData();
      setSelectedIds([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      alert('Hubo un error al eliminar algunas promociones');
      console.error('Error deleting promotions:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedPromosTitles = promotions
    .filter((p) => selectedIds.includes(p._id))
    .map((p) => p.title);

  return (
    <div className='min-h-screen bg-white text-black font-sans relative'>
      <div className='max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-24'>
        {' '}
        {/* pb-24 para espacio del botón fijo */}
        <div className='flex items-center justify-between mb-8 border-b border-gray-200 pb-4'>
          <button
            onClick={() => router.back()}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm'
          >
            Volver
          </button>

          <h1 className='text-lg sm:text-2xl font-bold text-gray-900 text-center flex-1 px-2 truncate'>
            Promotions - {loading ? '...' : jobTitle}
          </h1>
          <div className='w-[70px] hidden sm:block'></div>
        </div>
        {loading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'></div>
          </div>
        ) : promotions.length === 0 ? (
          <div className='text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300'>
            <p className='text-gray-500'>No promotions found for this job.</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {promotions.map((promo) => {
              const isSelected = selectedIds.includes(promo._id);
              return (
                <div
                  key={promo._id}
                  onClick={() => toggleSelection(promo._id)}
                  className={`
                    group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200
                    ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'}
                  `}
                >
                  <div className='flex-1 min-w-0 pr-4'>
                    <h3 className='text-base font-bold text-gray-900'>{promo.title}</h3>
                    <p className='text-sm text-gray-600 line-clamp-1'>{promo.description}</p>
                  </div>

                  <div
                    className={`
                    w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors shrink-0
                    ${isSelected ? 'bg-black border-black' : 'bg-white border-gray-400'}
                  `}
                  >
                    {isSelected && (
                      <svg
                        width='14'
                        height='14'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='white'
                        strokeWidth='4'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <polyline points='20 6 9 17 4 12'></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className='fixed bottom-8 left-0 right-0 px-4 flex justify-center z-10'>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={selectedIds.length === 0}
            className={`
              px-8 py-3 rounded-lg font-medium shadow-lg transition-all transform
              ${
                selectedIds.length === 0
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
              }
            `}
          >
            Remove selected promos
          </button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn'>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </button>

            <h3 className='text-lg font-semibold text-center mb-4 text-gray-900'>
              Are you sure to remove this promo/s?
            </h3>

            <div className='bg-gray-50 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto border border-gray-100'>
              <ul className='text-center space-y-1'>
                {selectedPromosTitles.map((title, index) => (
                  <li key={index} className='text-sm text-gray-700 font-medium'>
                    {title}
                  </li>
                ))}
              </ul>
            </div>

            <div className='flex justify-center'>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className='bg-blue-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70'
              >
                {isDeleting ? 'Deleting...' : 'Accept'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
//conclitos resueltos
