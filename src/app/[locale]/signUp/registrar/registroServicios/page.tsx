'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { enviarRegistroManual } from '@/app/redux/services/auth/registro';
import { generarContrasena } from '../Registrardecoder/generadorContrasena';

interface RegistroFormProps {
  onNotify?: (notification: {
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
  }) => void;
  captchaValid: boolean; // <-- NUEVO
}

const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

type RegistroSchema = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmarPassword: string;
};

export default function RegistroForm({ onNotify, captchaValid }: RegistroFormProps) {
  const t = useTranslations('RegistroForm');
  const router = useRouter();

  // Schema con traducciones usando useMemo
  const registroSchema = useMemo(
    () =>
      z
        .object({
          nombre: z
            .string()
            .min(3, t('validation.nombre.min'))
            .max(50, t('validation.nombre.max'))
            .regex(nameRegex, t('validation.nombre.regex')),
          apellido: z
            .string()
            .min(3, t('validation.apellido.min'))
            .max(50, t('validation.apellido.max'))
            .regex(nameRegex, t('validation.apellido.regex')),
          email: z.string().email(t('validation.email.invalid')),
          password: z.string().min(8, t('validation.password.min')),
          confirmarPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmarPassword, {
          message: t('validation.confirmarPassword.match'),
          path: ['confirmarPassword'],
        }),
    [t],
  );

  const [formData, setFormData] = useState<RegistroSchema>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmarPassword: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistroSchema, string>>>({});
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
  const [cargando, setCargando] = useState(false);

  /* --------------------------- HANDLERS --------------------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleGenerarContrasena = () => {
    const nueva = generarContrasena({
      length: 12,
      symbols: true,
      avoidAmbiguous: true,
    });

    setFormData((prev) => ({
      ...prev,
      password: nueva,
      confirmarPassword: nueva,
    }));

    setMostrarTooltip(false);
    setMostrarPassword(true);
    navigator.clipboard.writeText(nueva);

    onNotify?.({
      type: 'info',
      title: t('notifications.passwordGenerated.title'),
      message: t('notifications.passwordGenerated.message'),
    });
  };

  /* --------------------------- SUBMIT --------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaValid) {
      onNotify?.({
        type: 'warning',
        title: 'Completa la verificación',
        message: 'Debes completar el captcha antes de continuar.',
      });
      return;
    }

    const validation = registroSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegistroSchema, string>> = {};

      validation.error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path[0] as keyof RegistroSchema;
        fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);

      onNotify?.({
        type: 'warning',
        title: t('notifications.validationError.title'),
        message: t('notifications.validationError.message'),
      });

      return;
    }

    setCargando(true);
    const nombreCompleto = `${formData.nombre.trim()} ${formData.apellido.trim()}`;

    try {
      const data = await enviarRegistroManual(nombreCompleto, formData.email, formData.password);

      if (data.success) {
        if (data.token) localStorage.setItem('servineo_token', data.token);

        onNotify?.({
          type: 'success',
          title: t('notifications.success.title'),
          message: t('notifications.success.message', { name: nombreCompleto }),
        });

        sessionStorage.setItem(
          'toastMessage',
          t('notifications.success.toast', { name: nombreCompleto }),
        );
        router.push('/signUp/registrar/registrarFoto');
      } else {
        onNotify?.({
          type: 'error',
          title: t('notifications.error.title'),
          message: data.message || t('notifications.error.message'),
        });
      }
    } finally {
      setCargando(false);
    }
  };

  /* --------------------------- UI --------------------------- */

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      {/* Nombre y Apellido */}
      <div className='flex gap-3'>
        <div className='flex-1'>
          <label className='block text-sm font-semibold text-gray-600 mb-2'>
            {t('fields.nombre.label')}*
          </label>
          <input
            name='nombre'
            value={formData.nombre}
            onChange={handleChange}
            placeholder={t('fields.nombre.placeholder')}
            className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
              errors.nombre
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-servineo-400'
            }`}
          />
          {errors.nombre && <p className='text-red-500 text-xs mt-1'>{errors.nombre}</p>}
        </div>

        <div className='flex-1'>
          <label className='block text-sm font-semibold text-gray-600 mb-2'>
            {t('fields.apellido.label')}*
          </label>
          <input
            name='apellido'
            value={formData.apellido}
            onChange={handleChange}
            placeholder={t('fields.apellido.placeholder')}
            className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
              errors.apellido
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-servineo-400'
            }`}
          />
          {errors.apellido && <p className='text-red-500 text-xs mt-1'>{errors.apellido}</p>}
        </div>
      </div>

      {/* Correo */}
      <div>
        <label className='block text-sm font-semibold text-gray-600 mb-2'>
          {t('fields.email.label')}*
        </label>
        <input
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          placeholder={t('fields.email.placeholder')}
          className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
            errors.email
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-servineo-400'
          }`}
        />
        {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
      </div>

      {/* Contraseña */}
      <div>
        <label className='block text-sm font-semibold text-gray-600 mb-2'>
          {t('fields.password.label')}*
        </label>
        <div className='relative'>
          <input
            name='password'
            type={mostrarPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder={t('fields.password.placeholder')}
            className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
              errors.password
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-servineo-400'
            }`}
          />
          <button
            type='button'
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700'
            aria-label={mostrarPassword ? t('aria.hidePassword') : t('aria.showPassword')}
          >
            {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}

        <div className='relative'>
          <button
            type='button'
            onClick={handleGenerarContrasena}
            onMouseEnter={() => setMostrarTooltip(true)}
            onMouseLeave={() => setMostrarTooltip(false)}
            className='text-sm text-servineo-500 hover:underline mt-1'
          >
            {t('buttons.generatePassword')}
          </button>

          {mostrarTooltip && (
            <div className='absolute top-full left-0 mt-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs px-3 py-2 rounded-lg shadow-md animate-fade-in z-10'>
              {t('tooltips.passwordCopy')}
            </div>
          )}
        </div>
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label className='block text-sm font-semibold text-gray-600 mb-2'>
          {t('fields.confirmarPassword.label')}*
        </label>
        <div className='relative'>
          <input
            name='confirmarPassword'
            type={mostrarConfirmarPassword ? 'text' : 'password'}
            value={formData.confirmarPassword}
            onChange={handleChange}
            placeholder={t('fields.confirmarPassword.placeholder')}
            className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
              errors.confirmarPassword
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-servineo-400'
            }`}
          />
          <button
            type='button'
            onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
            className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700'
            aria-label={mostrarConfirmarPassword ? t('aria.hidePassword') : t('aria.showPassword')}
          >
            {mostrarConfirmarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmarPassword && (
          <p className='text-red-500 text-xs mt-1'>{errors.confirmarPassword}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type='submit'
        disabled={cargando}
        className={`w-full flex items-center justify-center gap-2
      ${!captchaValid ? 'bg-primary/60 cursor-not-allowed' : 'bg-primary/90 hover:bg-primary'}
       ${cargando ? 'opacity-60 cursor-not-allowed' : ''}
       text-white font-semibold rounded-xl p-2.5 mt-2 transition-all duration-300
       shadow-md hover:shadow-lg`}
      >
        {cargando ? (
          <>
            <Loader2 className='animate-spin w-5 h-5' />
            {t('buttons.submitting')}
          </>
        ) : (
          t('buttons.submit')
        )}
      </button>
    </form>
  );
}
