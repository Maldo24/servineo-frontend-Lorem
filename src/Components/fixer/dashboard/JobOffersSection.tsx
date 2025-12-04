'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Briefcase, Upload, X, MoreVertical } from 'lucide-react';

import { PillButton } from '../Pill-button';
import { Modal } from '@/Components/Modal';
import NotificationModal from '@/Components/Modal-notifications';
import { JobOfferCard } from '@/Components/Job-offers/JobOfferCard';
import Image from 'next/image';
import { boliviaCities } from '@/app/lib/validations/Job-offer-Schemas';
import { t } from 'i18next';
//import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/app/redux/hooks';

import {
  useGetJobsByFixerQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useToggleJobStatusMutation,
} from '@/app/redux/services/jobApi';

import {
  jobOfferSchema,
  jobCategories,
  type JobOfferFormData,
} from '@/app/lib/validations/Job-offer-Schemas';

import type { IJobOffer } from '@/types/fixer-profile';

interface NotificationState {
  isOpen: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onConfirm?: () => void;
}

type JobStateFilter = 'active' | 'inactive';

export function JobOffersSection({
  readOnly = false,
  effectiveeffectiveUserId = '',
}: {
  readOnly?: boolean;
  effectiveeffectiveUserId?: string;
}) {
  const { user } = useAppSelector((state) => state.user);
  const effectiveeffectiveeffectiveUserId = effectiveeffectiveUserId || user?._id || '';

  const { data: apiOffers, isLoading } = useGetJobsByFixerQuery(effectiveeffectiveeffectiveUserId, {
    skip: !effectiveeffectiveeffectiveUserId,
  });
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();
  const [toggleJobStatus] = useToggleJobStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<IJobOffer | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [notify, setNotify] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const [filter, setFilter] = useState<JobStateFilter>('active');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobOfferFormData>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      price: 0,
      city: 'Cochabamba',
      contactPhone: user?.telefono || '',
      title: '',
      description: '',
      category: '',
      tags: [] as string[],
    },
  });

  const currentTags = watch('tags') || [];

  const showNotify = (
    type: NotificationState['type'],
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => {
    setNotify({ isOpen: true, type, title, message, onConfirm });
  };

  // ⭐ Filtrar según estado real del backend
  const filteredOffers = (apiOffers || []).filter(
    (offer) => {
      const isActive = offer.status ?? false;
      return filter === 'active' ? isActive : !isActive;
    },
  );

  // -------------------------
  // 🔥 CREAR / EDITAR OFERTA
  // -------------------------
  const onSubmit = async (data: JobOfferFormData) => {
    if (!user?._id) return showNotify('error', 'Error', 'No se identificó al usuario.');

    if (!editingOffer && selectedImages.length === 0) {
      return showNotify('warning', 'Faltan imágenes', 'Debes subir al menos una foto.');
    }

    try {
      const formData = new FormData();
      formData.append('fixerId', user._id);
      formData.append('fixerName', user.name || 'Usuario');
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('price', data.price.toString());
      formData.append('city', data.city);
      formData.append('contactPhone', data.contactPhone);
      formData.append('tags', JSON.stringify(data.tags));
      formData.append('rating', editingOffer?.rating ? editingOffer.rating.toString() : '5');

      selectedImages.forEach((file) => formData.append('photos', file));

      if (editingOffer) {
        await updateJob({ jobId: editingOffer._id, formData }).unwrap();
        showNotify('success', 'Actualizado', 'Oferta actualizada correctamente.');
      } else {
        await createJob(formData).unwrap();
        showNotify('success', 'Publicado', 'Oferta creada correctamente.');
      }

      reset();
      setSelectedImages([]);
      setPreviewUrls([]);
      setEditingOffer(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      showNotify('error', 'Error', 'Error al procesar la solicitud.');
    }
  };

  // -------------------------
  // 🔥 ELIMINAR OFERTA
  // -------------------------
  const confirmDelete = (jobId: string) => {
    if (!effectiveeffectiveUserId) return;
    showNotify('warning', '¿Eliminar oferta?', 'Esta acción no se puede deshacer.', async () => {
      try {
        await deleteJob({ jobId, fixerId: effectiveeffectiveUserId }).unwrap();
        setTimeout(() => showNotify('success', 'Eliminado', 'Oferta eliminada.'), 300);
      } catch (error: unknown) {
        showNotify('error', 'Error', 'No se pudo eliminar la oferta.');
        console.error(error);
      }
    });
  };

  // -------------------------
  // 🔥 TOGGLE STATUS REAL
  // -------------------------
  const handleToggleActive = async (jobId: string) => {
    try {
      await toggleJobStatus({ jobId }).unwrap();
      setOpenMenuId(null);
    } catch (err) {
      console.error(err);
      showNotify('error', 'Error', 'No se pudo cambiar el estado.');
    }
  };

  if (isLoading) return <div className='p-10 text-center animate-pulse'>Cargando ofertas...</div>;

  return (
    <div className='space-y-6'>
      {/* HEADER */}
      <div className='flex items-center justify-between gap-4'>
        <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
          <Briefcase className='h-5 w-5 text-blue-600' />
          Mis Ofertas de Trabajo
        </h2>

        <div className='flex items-center gap-3'>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as JobStateFilter)}
            className='border border-gray-300 rounded-full px-3 py-1.5 text-sm text-gray-700 bg-white shadow-sm'
          >
            <option value='active'>Ofertas activas</option>
            <option value='inactive'>Ofertas inactivas</option>
          </select>

          {!readOnly && (
            <PillButton
              onClick={() => {
                reset();
                setSelectedImages([]);
                setPreviewUrls([]);
                setEditingOffer(null);
                setIsModalOpen(true);
              }}
              className='bg-primary text-white hover:bg-blue-800 flex items-center gap-2'
            >
              <Plus className='h-4 w-4' /> Nueva Oferta
            </PillButton>
          )}
        </div>
      </div>

      {/* GRID DE OFERTAS */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredOffers.map((offer) => {
          const id = offer._id;
          const isActive = offer.status ?? true;

          return (
            <div key={id} className='relative h-full'>
              <div className='h-full rounded-2xl shadow bg-white flex flex-col overflow-visible'>
                <JobOfferCard
                  offer={{
                    _id: offer._id,
                    fixerId: offer.fixerId,
                    fixerName: offer.fixerName,
                    title: offer.title,
                    description: offer.description,
                    category: offer.category,
                    tags: offer.tags || [],
                    price: offer.price,
                    city: offer.city,
                    contactPhone: offer.contactPhone,
                    createdAt: offer.createdAt || new Date().toISOString(),
                    rating: offer.rating,
                    photos: offer.photos || [],
                    allImages: offer.photos || [],
                    imagenUrl: offer.photos?.[0] || '',
                    status: offer.status,
                  }}
                  onEdit={
                    !readOnly
                      ? () => {
                          setEditingOffer(offer);
                          setValue('title', offer.title);
                          setValue('description', offer.description);
                          setValue('category', offer.category);
                          setValue('price', offer.price);
                          setValue('city', offer.city);
                          setValue('contactPhone', offer.contactPhone);
                          setValue('tags', offer.tags || []);
                          setPreviewUrls(offer.photos || []);
                          setSelectedImages([]);
                          setIsModalOpen(true);
                        }
                      : undefined
                  }
                  onDelete={!readOnly ? () => confirmDelete(id) : undefined}
                  readOnly={readOnly}
                  className='flex-1'
                />

                {/* FOOTER: ESTADO + MENÚ */}
                <div className='border-t px-3 py-2 flex items-center justify-between'>
                  {/* Estado */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      isActive
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {isActive ? 'Activa' : 'Inactiva'}
                  </span>

                  {/* Menú */}
                  {!readOnly && (
                    <div className='relative'>
                      <button
                        type='button'
                        onClick={() => setOpenMenuId((prev) => (prev === id ? null : id))}
                        className='p-1 rounded-full border border-gray-200 bg-white shadow hover:bg-gray-50'
                      >
                        <MoreVertical size={16} className='text-gray-600' />
                      </button>

                      {openMenuId === id && (
                        <div className='absolute right-0 top-full mt-1 w-40 bg-white border rounded-lg shadow-lg text-xs z-[100]'>
                          <button
                            type='button'
                            onClick={() => handleToggleActive(id)}
                            className='w-full text-left px-3 py-2 hover:bg-gray-50'
                          >
                            {isActive ? 'Desactivar trabajo' : 'Activar trabajo'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Sin ofertas */}
        {(!apiOffers || apiOffers.length === 0) && (
          <div className='col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed'>
            No hay ofertas publicadas aún.
          </div>
        )}
      </div>

      {/* ---------------------- */}
      {/* MODAL DE CREAR/EDITAR */}
      {/* ---------------------- */}
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOffer(null);
          reset();
          setSelectedImages([]);
          setPreviewUrls([]);
        }}
        title={editingOffer ? t('modal.editTitle') : t('modal.newTitle')}
        size='lg'
        closeOnOverlayClick={!isCreating && !isUpdating}
        className='rounded-2xl border-primary border-2'
      >
        <Modal.Body>
          <form id='offerForm' onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Título */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.title.label')}
              </label>
              <input
                {...register('title')}
                className='w-full rounded-lg border-primary border p-2'
                placeholder={t('form.title.placeholder')}
              />
              {errors.title && <p className='text-red-500 text-xs'>{errors.title.message}</p>}
            </div>

            {/* Categoría */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.category.label')}
              </label>
              <select
                {...register('category')}
                className='w-full rounded-lg border-primary border p-2 bg-white'
              >
                <option value=''>{t('form.category.select')}</option>
                {jobCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className='text-red-500 text-xs'>{errors.category.message}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('form.tags.label')}
              </label>

              <div className='flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
                {currentTags.map((tag) => (
                  <span
                    key={tag}
                    className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-primary border'
                  >
                    {tag}
                    <button
                      type='button'
                      onClick={() => {
                        const newTags = currentTags.filter((t) => t !== tag);
                        setValue('tags', newTags);
                      }}
                      className='hover:text-red-500'
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {currentTags.length === 0 && (
                  <span className='text-xs text-gray-400 italic'>{t('form.tags.empty')}</span>
                )}
              </div>

              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (!currentTags.includes(value) && currentTags.length < 5) {
                    setValue('tags', [...currentTags, value]);
                  }
                  e.target.value = '';
                }}
                className='w-full rounded-lg border-primary border p-2 bg-white mt-1'
              >
                <option value=''>{t('form.tags.addTag')}</option>
                {jobCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {errors.tags && <p className='text-red-500 text-xs'>{errors.tags.message}</p>}
            </div>

            {/* Descripción */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.description.label')}
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className='w-full rounded-lg border-primary border p-2'
                placeholder={t('form.description.placeholder')}
              />
              {errors.description && (
                <p className='text-red-500 text-xs'>{errors.description.message}</p>
              )}
            </div>

            {/* Precio + Ciudad */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('form.price.label')}
                </label>
                <input
                  type='number'
                  {...register('price', { valueAsNumber: true })}
                  className='w-full rounded-lg border-primary border p-2'
                />
                {errors.price && <p className='text-red-500 text-xs'>{errors.price.message}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('form.city.label')}
                </label>
                <select
                  {...register('city')}
                  className='w-full rounded-lg border-primary border p-2 bg-white'
                >
                  {boliviaCities.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
                {errors.city && <p className='text-red-500 text-xs'>{errors.city.message}</p>}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.contactPhone.label')}
              </label>
              <input
                {...register('contactPhone')}
                className='w-full rounded-lg border-primary border p-2'
              />
              {errors.contactPhone && (
                <p className='text-red-500 text-xs'>{errors.contactPhone.message}</p>
              )}
            </div>

            {/* Imágenes */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('form.images.label')}
              </label>

              <div className='grid grid-cols-4 gap-2'>
                {previewUrls.map((url, idx) => (
                  <div key={idx} className='relative aspect-square group'>
                    <Image
                      src={url}
                      alt='preview'
                      fill
                      className='object-cover rounded-lg border'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
                        setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100'
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {previewUrls.length < 5 && (
                  <label className='flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg aspect-square cursor-pointer hover:bg-gray-50'>
                    <Upload className='text-gray-400' />
                    <input
                      type='file'
                      className='hidden'
                      accept='image/*'
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const filtered = files.filter((file) => file.size <= 5 * 1024 * 1024);

                        setSelectedImages((prev) => [...prev, ...filtered]);
                        setPreviewUrls((prev) => [
                          ...prev,
                          ...filtered.map((f) => URL.createObjectURL(f)),
                        ]);
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className='flex justify-end gap-2'>
            <button
              onClick={() => {
                reset();
                setIsModalOpen(false);
                setEditingOffer(null);
                setSelectedImages([]);
                setPreviewUrls([]);
              }}
              className='border border-primary py-2 px-4 rounded-2xl text-primary hover:bg-primary hover:text-white'
            >
              {t('buttons.cancel')}
            </button>

            <PillButton
              type='submit'
              form='offerForm'
              className='bg-primary text-white hover:bg-blue-800'
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? t('buttons.saving') : t('buttons.save')}
            </PillButton>
          </div>
        </Modal.Footer>
      </Modal>

      {/* NOTIFICACIONES */}
      <NotificationModal
        isOpen={notify.isOpen}
        onClose={() => setNotify((prev) => ({ ...prev, isOpen: false }))}
        type={notify.type}
        title={notify.title}
        message={notify.message}
        onConfirm={notify.onConfirm}
        confirmText='Confirmar'
        autoClose={!notify.onConfirm}
      />
    </div>
  );
}
