'use client';

import { useState } from 'react';
import { PillButton } from '../Pill-button';
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  ExternalLink,
  Calendar,
  Building2,
  Loader2,
} from 'lucide-react';
import { ICertification } from '@/types/fixer-profile';
import { Modal } from '@/Components/Modal';
import { useForm } from 'react-hook-form';
import NotificationModal from '@/Components/Modal-notifications';
import { useTranslations } from 'next-intl';
import {
  useGetCertificationsByFixerQuery,
  useCreateCertificationMutation,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,
} from '@/app/redux/services/certifications';

interface CertificationsSectionProps {
  readOnly?: boolean;
  fixerId?: string;
}

interface NotificationState {
  isOpen: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onConfirm?: () => void;
}

export function CertificationsSection({ readOnly = false, fixerId }: CertificationsSectionProps) {
  const t = useTranslations('CertificationsSection');

  const { data: certs = [], isLoading } = useGetCertificationsByFixerQuery(fixerId || '', {
    skip: !fixerId,
    refetchOnMountOrArgChange: true,
  });

  const [createCertification, { isLoading: isCreating }] = useCreateCertificationMutation();
  const [updateCertification, { isLoading: isUpdating }] = useUpdateCertificationMutation();
  const [deleteCertification, { isLoading: isDeleting }] = useDeleteCertificationMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<ICertification | null>(null);

  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: undefined,
  });

  const { register, handleSubmit, reset, setValue } = useForm<ICertification>();

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (message: string) => {
    setNotification({
      isOpen: true,
      type: 'success',
      title: t('notifications.success'),
      message,
      onConfirm: undefined,
    });
  };

  const showError = (message: string) => {
    setNotification({
      isOpen: true,
      type: 'error',
      title: t('notifications.error'),
      message,
      onConfirm: undefined,
    });
  };

  const handleOpenModal = (cert?: ICertification) => {
    if (readOnly) return;

    if (cert) {
      setEditingCert(cert);
      setValue('name', cert.name);
      setValue('institution', cert.institution);
      setValue(
        'issueDate',
        cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
      );
      setValue(
        'expiryDate',
        cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
      );
      setValue('credentialId', cert.credentialId);
      setValue('credentialUrl', cert.credentialUrl);
    } else {
      setEditingCert(null);
      reset({
        name: '',
        institution: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCert(null);
    reset();
  };

  const onSubmit = async (data: ICertification) => {
    if (!fixerId) return;

    try {
      if (editingCert && editingCert._id) {
        await updateCertification({
          id: editingCert._id,
          data: { ...data, fixerId },
        }).unwrap();
        showSuccess(t('notifications.updateSuccess'));
      } else {
        await createCertification({
          ...data,
          fixerId,
        }).unwrap();
        showSuccess(t('notifications.createSuccess'));
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      showError(t('notifications.saveError'));
    }
  };

  const handleDeleteClick = (id: string) => {
    if (readOnly) return;

    setNotification({
      isOpen: true,
      type: 'warning',
      title: t('notifications.deleteTitle'),
      message: t('notifications.deleteMessage'),
      onConfirm: () => confirmDelete(id),
    });
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteCertification(id).unwrap();
      setTimeout(() => {
        showSuccess(t('notifications.deleteSuccess'));
      }, 300);
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        showError(t('notifications.deleteError'));
      }, 300);
    }
  };

  if (!fixerId) {
    return <div className='p-4 text-center text-gray-500'>{t('errors.noFixerProfile')}</div>;
  }

  if (isLoading)
    return (
      <div className='p-4 text-center flex justify-center'>
        <Loader2 className='animate-spin h-6 w-6' />
      </div>
    );

  return (
    <div className='space-y-6'>
      {/* Encabezado */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
          <Award className='h-5 w-5 text-blue-600' />
          {readOnly ? t('titles.certifications') : t('titles.myCertifications')}
        </h2>
        {!readOnly && (
          <PillButton
            onClick={() => handleOpenModal()}
            className='bg-primary text-white hover:bg-blue-800 flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            {t('buttons.addCertification')}
          </PillButton>
        )}
      </div>

      {/* Lista de Certificaciones */}
      <div className='grid gap-4'>
        {certs.length === 0 && (
          <div className='text-gray-500 text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50'>
            {t('empty')}
          </div>
        )}

        {certs.map((cert) => (
          <div
            key={cert._id}
            className='group relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all hover:border-blue-200'
          >
            <div className='flex justify-between items-start gap-4'>
              <div className='flex gap-4 w-full'>
                {/* Icono */}
                <div className='h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 border border-blue-100'>
                  <Award className='h-6 w-6' />
                </div>

                {/* Contenido */}
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-900 text-lg leading-tight'>{cert.name}</h3>
                  <div className='flex items-center gap-2 text-gray-600 mt-1 font-medium'>
                    <Building2 className='h-4 w-4' />
                    <span>{cert.institution}</span>
                  </div>

                  <div className='flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-500'>
                    <div className='flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded'>
                      <Calendar className='h-3.5 w-3.5' />
                      <span>
                        {t('card.issued')}:{' '}
                        {new Date(cert.issueDate).toLocaleDateString(undefined, {
                          timeZone: 'UTC',
                        })}
                      </span>
                    </div>
                    {cert.expiryDate && (
                      <div className='flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded'>
                        <Calendar className='h-3.5 w-3.5' />
                        <span>
                          {t('card.expires')}:{' '}
                          {new Date(cert.expiryDate).toLocaleDateString(undefined, {
                            timeZone: 'UTC',
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-sm mt-3 font-medium transition-colors'
                    >
                      {t('card.viewCredential')} <ExternalLink className='h-3 w-3' />
                    </a>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              {!readOnly && (
                <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 md:static md:opacity-100'>
                  <button
                    onClick={() => handleOpenModal(cert)}
                    className='p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors'
                    title={t('tooltips.edit')}
                  >
                    <Edit2 className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => cert._id && handleDeleteClick(cert._id)}
                    disabled={isDeleting}
                    className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50'
                    title={t('tooltips.delete')}
                  >
                    {isDeleting ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Trash2 className='h-4 w-4' />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Formulario */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingCert ? t('modal.editTitle') : t('modal.newTitle')}
        size='lg'
        closeOnOverlayClick={!isCreating && !isUpdating}
        className='rounded-2xl border-primary border-2'
      >
        <Modal.Header className='text-center text-primary'>
          {editingCert ? t('modal.editTitle') : t('modal.newTitle')}
        </Modal.Header>
        <Modal.Body>
          <form id='certificationForm' onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.name.label')}
              </label>
              <input
                {...register('name', { required: true })}
                className='w-full rounded-lg border-primary border focus:outline-none py-2 px-3'
                placeholder={t('form.name.placeholder')}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.institution.label')}
              </label>
              <input
                {...register('institution', { required: true })}
                className='w-full rounded-lg border-primary border focus:outline-none py-2 px-3'
                placeholder={t('form.institution.placeholder')}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('form.issueDate.label')}
                </label>
                <input
                  type='date'
                  {...register('issueDate', { required: true })}
                  className='w-full rounded-lg border-primary border focus:outline-none py-2 px-3 bg-white'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('form.expiryDate.label')}{' '}
                  <span className='text-gray-400 font-normal'>({t('form.optional')})</span>
                </label>
                <input
                  type='date'
                  {...register('expiryDate')}
                  className='w-full rounded-lg border-primary border focus:outline-none py-2 px-3 bg-white'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.credentialId.label')}{' '}
                <span className='text-gray-400 font-normal'>({t('form.optional')})</span>
              </label>
              <input
                {...register('credentialId')}
                className='w-full rounded-lg border-primary border focus:outline-none py-2 px-3'
                placeholder={t('form.credentialId.placeholder')}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('form.credentialUrl.label')}{' '}
                <span className='text-gray-400 font-normal'>({t('form.optional')})</span>
              </label>
              <input
                {...register('credentialUrl')}
                type='url'
                className='w-full rounded-lg border-primary border focus:outline-none py-2 px-3'
                placeholder={t('form.credentialUrl.placeholder')}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={handleCloseModal}
              className='border border-primary py-2 px-4 rounded-2xl text-primary hover:text-white hover:bg-primary transition-colors'
            >
              {t('buttons.cancel')}
            </button>
            <PillButton
              type='submit'
              form='certificationForm'
              className='bg-primary text-white hover:bg-blue-800'
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating) && <Loader2 className='animate-spin h-4 w-4 mr-2' />}
              {isCreating || isUpdating ? t('buttons.saving') : t('buttons.save')}
            </PillButton>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Modal de Notificaciones */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onConfirm={notification.onConfirm}
        confirmText={t('buttons.delete')}
        cancelText={t('buttons.cancel')}
      />
    </div>
  );
}
