'use client';

import { useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
//import Image from 'next/image';
import { StepIndicator } from './Step-indicator';
import { Card } from '../Card';
import { PillButton } from './Pill-button';
import { CIStep } from './steps/Ci-step';
import { LocationStep } from './steps/Location-step';
import { ServicesStep, type Service } from './steps/Services-step';
import { PaymentStep } from './steps/Payment-step';
import { VehicleStep } from './steps/Vehicle-step';
import { TermsStep } from './steps/Terms-Step';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { ProfilePhotoStep } from './steps/Profile-photo-step';
import { useConvertToFixerMutation } from '@/app/redux/services/become';
import { IUser } from '@/types/user';
import { fixerProfileSchema, type FixerProfileData } from '@/app/lib/validations/fixer-schemas';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import NotificationModal from '../Modal-notifications';

const DEFAULT_SERVICES: Service[] = [
  { id: 'svc-plumbing', name: 'Plomería' },
  { id: 'svc-electric', name: 'Electricidad' },
  { id: 'svc-carpentry', name: 'Carpintería' },
  { id: 'svc-paint', name: 'Pintura' },
];

interface FixerEnableWizardProps {
  user: IUser;
}

// Type guards para manejar errores
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

function isErrorWithData(error: unknown): error is { data: { message?: string; error?: string } } {
  return (
    typeof error === 'object' &&
    error != null &&
    'data' in error &&
    typeof (error as { data: unknown }).data === 'object'
  );
}

function isSerializedError(error: unknown): error is SerializedError {
  return (
    typeof error === 'object' &&
    error != null &&
    ('name' in error || 'message' in error || 'code' in error)
  );
}

export function FixerEnableWizard({ user }: FixerEnableWizardProps) {
  const [convertToFixer] = useConvertToFixerMutation();
  const [step, setStep] = useState(0);
  const total = 7; // 0 to 6
  const [success, setSuccess] = useState(false);

  // Estados para el modal de notificación
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
    title: '',
    message: '',
  });

  const methods = useForm<FixerProfileData>({
    resolver: zodResolver(fixerProfileSchema),
    defaultValues: {
      ci: '',
      workLocation: { lat: -16.5, lng: -68.15 },
      servicios: [],
      metodoPago: {
        hasEfectivo: false,
        qr: false,
        tarjetaCredito: false,
      },
      accountInfo: '',
      experience: { descripcion: '' },
      vehiculo: {
        hasVehiculo: false,
        tipoVehiculo: undefined,
      },
      acceptTerms: false,
      url_photo: user.url_photo || '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const url_photo = watch('url_photo');
  const ci = watch('ci');
  const workLocation = watch('workLocation');
  const servicios = watch('servicios');
  const metodoPago = watch('metodoPago');
  const accountInfo = watch('accountInfo');
  const vehiculo = watch('vehiculo');
  const acceptTerms = watch('acceptTerms');

  const [availableServices, setAvailableServices] = useState<Service[]>(
    DEFAULT_SERVICES.map((s) => ({ id: s.id, name: s.name })),
  );

  const validateStep = async () => {
    let fieldsToValidate: (keyof FixerProfileData)[] = [];

    switch (step) {
      case 0:
        fieldsToValidate = ['url_photo'];
        break;
      case 1:
        fieldsToValidate = ['ci'];
        break;
      case 2:
        fieldsToValidate = ['workLocation'];
        break;
      case 3:
        fieldsToValidate = ['servicios'];
        break;
      case 4:
        fieldsToValidate = ['metodoPago', 'accountInfo'];
        break;
      case 5:
        fieldsToValidate = ['vehiculo'];
        break;
      case 6:
        fieldsToValidate = ['acceptTerms'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const goNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep((s) => Math.min(total - 1, s + 1));
    }
  };

  const goPrev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handleToggleService = (id: string) => {
    const current = servicios || [];
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setValue('servicios', updated, { shouldValidate: true });
  };

  const handleAddCustomService = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = `custom-${Date.now()}`;
    setAvailableServices((prev) => [...prev, { id, name: trimmed, custom: true }]);
    setValue('servicios', [...(servicios || []), id], { shouldValidate: true });
  };

  const handleEditService = (id: string, name: string) => {
    setAvailableServices((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const handleDeleteService = (id: string) => {
    setAvailableServices((prev) => prev.filter((s) => s.id !== id));
    setValue(
      'servicios',
      (servicios || []).filter((x) => x !== id),
      { shouldValidate: true },
    );
  };

  const handleTogglePayment = (method: 'cash' | 'qr' | 'card') => {
    const current = { ...metodoPago };
    if (method === 'cash') current.hasEfectivo = !current.hasEfectivo;
    if (method === 'qr') current.qr = !current.qr;
    if (method === 'card') current.tarjetaCredito = !current.tarjetaCredito;

    setValue('metodoPago', current, { shouldValidate: true });
  };

  const getPaymentArray = () => {
    const arr: ('cash' | 'qr' | 'card')[] = [];
    if (metodoPago?.hasEfectivo) arr.push('cash');
    if (metodoPago?.qr) arr.push('qr');
    if (metodoPago?.tarjetaCredito) arr.push('card');
    return arr;
  };

  const onSubmit: SubmitHandler<FixerProfileData> = async (data) => {
    try {
      if (!user._id) {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Error',
          message: 'No se pudo identificar al usuario. Por favor, intenta nuevamente.',
        });
        return;
      }

      const payload = {
        id: user._id?.toString(),
        profile: {
          telefono: user.telefono,
          ci: data.ci.trim(),
          services: data.servicios
            .filter((id): id is string => id.startsWith('svc-'))
            .map((id) => {
              const service = DEFAULT_SERVICES.find((s) => s.id === id);
              return { name: service?.name ?? 'Servicio desconocido' };
            }),
          vehicle: data.vehiculo.hasVehiculo
            ? {
                hasVehiculo: true,
                tipoVehiculo: data.vehiculo.tipoVehiculo || undefined,
              }
            : { hasVehiculo: false },
          paymentMethods: (() => {
            const methods: { type: string }[] = [];
            if (data.metodoPago.hasEfectivo) methods.push({ type: 'efectivo' });
            if (data.metodoPago.qr) methods.push({ type: 'qr' });
            if (data.metodoPago.tarjetaCredito) methods.push({ type: 'tarjeta' });
            return methods;
          })(),
          location: {
            lat: Number(data.workLocation.lat),
            lng: Number(data.workLocation.lng),
            direccion: data.workLocation.direccion?.trim() || '',
          },
          terms: {
            accepted: data.acceptTerms,
          },
        },
      };

      await convertToFixer(payload).unwrap();
      setSuccess(true);
      setModalState({
        isOpen: true,
        type: 'success',
        title: '¡Registro Exitoso!',
        message: `${user.name}, tu perfil de FIXER ha sido creado exitosamente. Tu cuenta está en revisión y pronto podrás comenzar a recibir solicitudes.`,
      });
    } catch (error) {
      console.error('Error registering fixer:', error);

      let errorMessage = 'Ocurrió un error al registrar tu perfil. Por favor, intenta nuevamente.';

      if (isErrorWithData(error)) {
        const data = error.data;
        errorMessage = data.message || data.error || errorMessage;
      } else if (isFetchBaseQueryError(error)) {
        errorMessage = `Error de conexión (${error.status}). Verifica tu conexión a internet.`;
      } else if (isSerializedError(error)) {
        errorMessage = error.message || errorMessage;
      }

      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Error al Registrar',
        message: errorMessage,
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className='mx-auto w-full max-w-3xl animate-fade-in'>
        <StepIndicator step={step} total={total} />
        {success ? (
          <Card title='¡Listo!'>
            <div className='space-y-4 text-center'>
              <div className='flex justify-center'>
                <CheckCircle2 className='h-16 w-16 text-green-600 animate-scale-in' />
              </div>
              <p className='text-lg font-semibold text-gray-900'>
                {user.name} ahora está habilitado como FIXER.
              </p>
              <div className='text-sm text-gray-600 space-y-1'>
                <p>CI: {ci}</p>
                <p>
                  Ubicación: {workLocation?.lat.toFixed(5)}, {workLocation?.lng.toFixed(5)}
                </p>
                <p>Servicios: {servicios?.length}</p>
                <p>Métodos de pago: {getPaymentArray().join(', ')}</p>
                <p>Vehículo: {vehiculo?.hasVehiculo ? `Sí (${vehiculo.tipoVehiculo})` : 'No'}</p>
                <p className='text-xs text-gray-500 mt-4'>Estado: En revisión (pending)</p>
              </div>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {step === 0 && (
              <ProfilePhotoStep
                photoUrl={url_photo}
                onPhotoChange={(url) => setValue('url_photo', url, { shouldValidate: true })}
                error={errors.url_photo?.message}
              />
            )}

            {step === 1 && (
              <CIStep
                ci={ci}
                onCIChange={(val) => setValue('ci', val, { shouldValidate: true })}
                error={errors.ci?.message}
              />
            )}

            {step === 2 && (
              <LocationStep
                location={workLocation}
                onLocationChange={(val) => setValue('workLocation', val, { shouldValidate: true })}
                error={errors.workLocation?.message || errors.workLocation?.lat?.message}
              />
            )}

            {step === 3 && (
              <ServicesStep
                services={availableServices}
                selectedServiceIds={servicios}
                onToggleService={handleToggleService}
                onAddCustomService={handleAddCustomService}
                onEditService={handleEditService}
                onDeleteService={handleDeleteService}
                error={errors.servicios?.message}
              />
            )}

            {step === 4 && (
              <PaymentStep
                payments={getPaymentArray()}
                accountInfo={accountInfo || ''}
                onTogglePayment={handleTogglePayment}
                onAccountInfoChange={(val) =>
                  setValue('accountInfo', val, { shouldValidate: true })
                }
                paymentsError={errors.metodoPago?.root?.message}
                accountError={errors.accountInfo?.message}
              />
            )}

            {step === 5 && (
              <VehicleStep
                hasVehicle={vehiculo?.hasVehiculo}
                vehicleType={vehiculo?.tipoVehiculo}
                onHasVehicleChange={(val) => {
                  setValue('vehiculo.hasVehiculo', val, { shouldValidate: true });
                  if (!val) setValue('vehiculo.tipoVehiculo', undefined);
                }}
                onVehicleTypeChange={(val) =>
                  setValue('vehiculo.tipoVehiculo', val, { shouldValidate: true })
                }
                error={
                  errors.vehiculo?.hasVehiculo?.message || errors.vehiculo?.tipoVehiculo?.message
                }
              />
            )}

            {step === 6 && (
              <TermsStep
                accepted={acceptTerms}
                onAcceptChange={(val) => setValue('acceptTerms', val, { shouldValidate: true })}
                error={errors.acceptTerms?.message}
              />
            )}

            {errors.root && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm'>
                {errors.root.message}
              </div>
            )}

            <div className='flex items-center justify-between'>
              <PillButton
                type='button'
                disabled={step === 0}
                onClick={goPrev}
                className='bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4' />
                Atrás
              </PillButton>
              {step < total - 1 ? (
                <PillButton
                  type='button'
                  onClick={goNext}
                  className='bg-primary text-white hover:bg-blue-800 flex items-center gap-2'
                >
                  Siguiente
                  <ArrowRight className='h-4 w-4' />
                </PillButton>
              ) : (
                <PillButton
                  type='submit'
                  disabled={isSubmitting || !acceptTerms}
                  className='bg-primary text-white hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2'
                >
                  {isSubmitting ? 'Registrando...' : 'Registrar'}
                  <CheckCircle2 className='h-4 w-4' />
                </PillButton>
              )}
            </div>
          </form>
        )}

        {/* Modal de Notificaciones */}
        <NotificationModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
          type={modalState.type}
          title={modalState.title}
          message={modalState.message}
          autoClose={modalState.type === 'success'}
          autoCloseDelay={4000}
        />
      </div>
    </FormProvider>
  );
}
