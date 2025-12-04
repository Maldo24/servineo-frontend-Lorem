'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  initialRegistrationSchema,
  type InitialRegistrationData,
} from '@/app/lib/validations/fixer-schemas';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface FixerRegisterFormProps {
  onSubmit: (data: InitialRegistrationData) => void;
  submitButtonText?: string;
  defaultValues?: Partial<InitialRegistrationData>;
}

export default function FixerRegisterForm({
  onSubmit,
  submitButtonText,
  defaultValues = {},
}: FixerRegisterFormProps) {
  const t = useTranslations('becomeFixer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InitialRegistrationData>({
    resolver: zodResolver(initialRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      ...defaultValues,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      name: defaultValues.name || '',
      email: defaultValues.email || '',
      phone: defaultValues.phone || '',
    });
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data: InitialRegistrationData) => {
    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      {/* NAME */}
      <div className='space-y-1'>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
          {t('fields.name.label')} <span className='text-red-500'>*</span>
        </label>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <div className='relative'>
              <input
                {...field}
                maxLength={30}
                className='w-full rounded-full bg-gray-200 px-4 py-2 text-sm'
                placeholder={t('fields.name.placeholder')}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 30);
                  field.onChange(value);
                }}
              />
              <span className='absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500'>
                {field.value?.length || 0}/30
              </span>
            </div>
          )}
        />
        {errors.name && <p className='text-xs text-red-600'>{errors.name.message}</p>}
      </div>

      {/* EMAIL */}
      <div className='space-y-1'>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
          {t('fields.email.label')} <span className='text-red-500'>*</span>
        </label>
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type='email'
              className='w-full rounded-full bg-gray-200 px-4 py-2 text-sm'
              placeholder={t('fields.email.placeholder')}
            />
          )}
        />
        {errors.email && <p className='text-xs text-red-600'>{errors.email.message}</p>}
      </div>

      {/* PHONE */}
      <div className='space-y-1'>
        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
          {t('fields.phone.label')} <span className='text-red-500'>*</span>
        </label>
        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <div className='relative'>
              <input
                {...field}
                type='tel'
                className='w-full rounded-full bg-gray-200 px-4 py-2 text-sm pr-20'
                placeholder={t('fields.phone.placeholder')}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d\s+-]/g, '');
                  field.onChange(value);
                }}
              />
              <span className='absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400'>
                {field.value ? field.value.replace(/\D/g, '').length : 0} {t('digits')}
              </span>
            </div>
          )}
        />
        {errors.phone && <p className='text-xs text-red-600'>{errors.phone.message}</p>}
      </div>

      {/* BUTTON */}
      <button
        type='submit'
        disabled={isSubmitting}
        className='w-full rounded-full bg-primary text-white py-2.5 text-sm font-semibold'
      >
        {isSubmitting ? t('buttons.submitting') : submitButtonText || t('buttons.submit')}
      </button>
    </form>
  );
}
