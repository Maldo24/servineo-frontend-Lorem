'use client';

import { useState } from 'react';
import { PillButton } from '../Pill-button';
import { Plus, Edit2, Trash2, Building2, Calendar, Briefcase, Loader2 } from 'lucide-react';
import { IExperience } from '@/types/fixer-profile';
import { Modal } from '@/Components/Modal';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import NotificationModal from '@/Components/Modal-notifications';
import {
  useGetExperiencesByFixerQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} from '@/app/redux/services/experiencesApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Type guards para errores de API
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

function isErrorWithData(error: unknown): error is { data: { message?: string } } {
  return (
    typeof error === 'object' &&
    error != null &&
    'data' in error &&
    typeof (error as { data: unknown }).data === 'object'
  );
}

interface ExperienceSectionProps {
  readOnly?: boolean;
  fixerId?: string;
}

export function ExperienceSection({ readOnly = false, fixerId }: ExperienceSectionProps) {
  const t = useTranslations('ExperienceSection');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<IExperience | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Omit<IExperience, '_id' | 'createdAt' | 'updatedAt'>>();

  const isCurrent = watch('isCurrent');

  const {
    data: experiences = [],
    isLoading,
    isError,
    refetch,
  } = useGetExperiencesByFixerQuery(fixerId!, {
    skip: !fixerId,
  });

  const [createExperience, { isLoading: isCreating }] = useCreateExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();

  const handleOpenModal = (exp?: IExperience) => {
    if (readOnly) return;
    if (exp) {
      setEditingExp(exp);
      setValue('jobTitle', exp.jobTitle);
      setValue('organization', exp.organization);
      setValue('jobType', exp.jobType);
      setValue('isCurrent', exp.isCurrent);
      setValue('startDate', exp.startDate.split('T')[0]);
      setValue('endDate', exp.endDate ? exp.endDate.split('T')[0] : '');
    } else {
      setEditingExp(null);
      reset({
        jobTitle: '',
        jobType: 'Tiempo completo',
        organization: '',
        isCurrent: false,
        startDate: '',
        endDate: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExp(null);
    reset();
  };

  const onSubmit = async (data: Omit<IExperience, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!fixerId) return;

    try {
      if (editingExp?._id) {
        await updateExperience({ id: editingExp._id, data }).unwrap();
        setNotification({
          isOpen: true,
          type: 'success',
          title: t('notifications.success'),
          message: t('notifications.updateSuccess'),
        });
      } else {
        await createExperience({ ...data, fixerId }).unwrap();
        setNotification({
          isOpen: true,
          type: 'success',
          title: t('notifications.success'),
          message: t('notifications.createSuccess'),
        });
      }

      handleCloseModal();
      refetch();
    } catch (error) {
      let errorMessage = t('notifications.genericError');

      if (isFetchBaseQueryError(error)) {
        errorMessage = 'error' in error ? String(error.error) : JSON.stringify(error.data);
      } else if (isErrorWithData(error) && error.data.message) {
        errorMessage = error.data.message;
      } else if (isErrorWithMessage(error)) {
        errorMessage = error.message;
      }

      setNotification({
        isOpen: true,
        type: 'error',
        title: t('notifications.error'),
        message: errorMessage,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (readOnly) return;
    setPendingDelete(id);
    setNotification({
      isOpen: true,
      type: 'warning',
      title: t('notifications.deleteTitle'),
      message: t('notifications.deleteMessage'),
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteExperience(pendingDelete).unwrap();
      refetch();
      setNotification({
        isOpen: true,
        type: 'success',
        title: t('notifications.deleteSuccessTitle'),
        message: t('notifications.deleteSuccess'),
      });
      setPendingDelete(null);
    } catch (error) {
      let errorMessage = t('notifications.genericError');

      if (isFetchBaseQueryError(error)) {
        errorMessage = 'error' in error ? String(error.error) : JSON.stringify(error.data);
      } else if (isErrorWithData(error) && error.data.message) {
        errorMessage = error.data.message;
      } else if (isErrorWithMessage(error)) {
        errorMessage = error.message;
      }

      setNotification({
        isOpen: true,
        type: 'error',
        title: t('notifications.error'),
        message: errorMessage,
      });
      setPendingDelete(null);
    }
  };

  const cancelDelete = () => {
    setPendingDelete(null);
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  if (isLoading) return <div className='text-center p-8'>{t('loading')}</div>;
  if (isError) return <div className='text-center p-8 text-red-600'>{t('errors.loadError')}</div>;

  return (
    <div className='space-y-6'>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => {
          setNotification((prev) => ({ ...prev, isOpen: false }));
        }}
        type={notification.type as 'success' | 'error' | 'info' | 'warning'}
        title={notification.title}
        message={notification.message}
        autoClose={notification.type !== 'warning'}
        autoCloseDelay={5000}
        onConfirm={pendingDelete ? confirmDelete : undefined}
        onCancel={pendingDelete ? cancelDelete : undefined}
      />

      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
          <Building2 className='h-5 w-5 text-blue-600' />
          {readOnly ? t('titles.experience') : t('titles.myExperience')}
        </h2>
        {!readOnly && (
          <PillButton
            onClick={() => handleOpenModal()}
            className='bg-primary text-white hover:bg-blue-800 flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            {t('buttons.addExperience')}
          </PillButton>
        )}
      </div>

      {experiences.length === 0 ? (
        <div className='text-center p-8 text-gray-500'>
          {readOnly ? t('empty.readOnly') : t('empty.editable')}
        </div>
      ) : (
        <div className='relative border-l-2 border-gray-200 ml-3 space-y-8 py-2'>
          {experiences.map((exp) => (
            <div key={exp._id} className='relative pl-8 group'>
              <div className='absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-sm' />

              <div className='bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all hover:border-blue-200'>
                <div className='flex justify-between items-start gap-4'>
                  <div className='space-y-2'>
                    <div>
                      <h3 className='font-semibold text-gray-900 text-lg'>{exp.jobTitle}</h3>
                      <div className='flex items-center gap-2 text-gray-600 font-medium'>
                        <Briefcase className='h-4 w-4' />
                        <span>{exp.organization}</span>
                      </div>
                    </div>

                    <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
                      <span className='inline-flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md'>
                        <Calendar className='h-3.5 w-3.5' />
                        {new Date(exp.startDate).toLocaleDateString()} -{' '}
                        {exp.isCurrent
                          ? t('card.present')
                          : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString()
                            : ''}
                      </span>
                      <span className='px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-medium text-xs uppercase tracking-wide'>
                        {exp.jobType}
                      </span>
                    </div>
                  </div>

                  {!readOnly && (
                    <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <button
                        onClick={() => handleOpenModal(exp)}
                        className='p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors'
                        title={t('tooltips.edit')}
                      >
                        <Edit2 className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id!)}
                        className='p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors'
                        title={t('tooltips.delete')}
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingExp ? t('modal.editTitle') : t('modal.newTitle')}
        size='lg'
        closeOnOverlayClick={!isCreating}
        className='rounded-2xl border-primary border-2'
      >
        <Modal.Header className='text-center text-primary'>
          {editingExp ? t('modal.editTitle') : t('modal.newTitle')}
        </Modal.Header>
        <Modal.Body>
          <form id='experienceForm' onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.jobTitle.label')} *
              </label>
              <input
                {...register('jobTitle', { required: t('form.jobTitle.required') })}
                className={`w-full rounded-lg border ${errors.jobTitle ? 'border-red-500' : 'border-primary'} focus:outline-none py-2 px-3`}
                placeholder={t('form.jobTitle.placeholder')}
              />
              {errors.jobTitle && (
                <p className='mt-1 text-sm text-red-600'>{errors.jobTitle.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.organization.label')} *
              </label>
              <input
                {...register('organization', { required: t('form.organization.required') })}
                className={`w-full rounded-lg border ${errors.organization ? 'border-red-500' : 'border-primary'} focus:outline-none py-2 px-3`}
                placeholder={t('form.organization.placeholder')}
              />
              {errors.organization && (
                <p className='mt-1 text-sm text-red-600'>{errors.organization.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.jobType.label')} *
              </label>
              <select
                {...register('jobType', { required: t('form.jobType.required') })}
                className={`w-full rounded-lg border ${errors.jobType ? 'border-red-500' : 'border-primary'} focus:outline-none py-2 px-3 bg-white`}
              >
                <option value=''>{t('form.jobType.select')}</option>
                <option value='Tiempo completo'>{t('form.jobType.options.fullTime')}</option>
                <option value='Medio tiempo'>{t('form.jobType.options.partTime')}</option>
                <option value='Contrato'>{t('form.jobType.options.contract')}</option>
                <option value='Freelance'>{t('form.jobType.options.freelance')}</option>
              </select>
              {errors.jobType && (
                <p className='mt-1 text-sm text-red-600'>{errors.jobType.message}</p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('form.startDate.label')} *
                </label>
                <input
                  type='date'
                  {...register('startDate', { required: t('form.startDate.required') })}
                  className={`w-full rounded-lg border ${errors.startDate ? 'border-red-500' : 'border-primary'} focus:outline-none py-2 px-3 bg-white`}
                />
                {errors.startDate && (
                  <p className='mt-1 text-sm text-red-600'>{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('form.endDate.label')}
                </label>
                <input
                  type='date'
                  {...register('endDate', { required: !isCurrent })}
                  disabled={isCurrent}
                  className='w-full rounded-lg border border-primary focus:outline-none py-2 px-3 bg-white disabled:bg-gray-100 disabled:text-gray-400'
                />
              </div>
            </div>

            <div className='flex items-center gap-2 py-2'>
              <input
                type='checkbox'
                id='isCurrent'
                {...register('isCurrent')}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <label htmlFor='isCurrent' className='text-sm font-medium text-gray-700'>
                {t('form.isCurrent.label')}
              </label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={handleCloseModal}
              className='border border-primary py-2 px-4 rounded-2xl text-primary hover:text-white hover:bg-primary transition-colors'
              disabled={isCreating}
            >
              {t('buttons.cancel')}
            </button>
            <PillButton
              type='submit'
              form='experienceForm'
              className='bg-primary text-white hover:bg-blue-800 flex items-center gap-2'
              disabled={isCreating}
            >
              {isCreating && <Loader2 className='h-4 w-4 animate-spin' />}
              {isCreating ? t('buttons.saving') : t('buttons.save')}
            </PillButton>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
