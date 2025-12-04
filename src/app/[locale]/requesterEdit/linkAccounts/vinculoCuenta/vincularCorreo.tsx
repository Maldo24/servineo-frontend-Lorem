'use client';

import { useState } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { vincularCorreoContrasena, Client } from '@/app/redux/services/services/api';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

const schema = (t: (key: string) => string) =>
  z
    .object({
      email: z.string().email(t('errors.invalidEmail')),
      password: z
        .string()
        .min(8, t('errors.passwordMinLength'))
        .regex(/[A-Z]/, t('errors.passwordUppercase'))
        .regex(/[a-z]/, t('errors.passwordLowercase'))
        .regex(/[0-9]/, t('errors.passwordNumber'))
        .regex(/[^A-Za-z0-9]/, t('errors.passwordSymbol')),
      repeatPassword: z.string(),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: t('errors.passwordsDoNotMatch'),
      path: ['repeatPassword'],
    });

interface VincularCorreoProps {
  token: string;
  onLinked?: (client?: Client) => void;
}

export default function VincularCorreo({ token, onLinked }: VincularCorreoProps) {
  const t = useTranslations('VincularCorreo');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarRepeatPassword, setMostrarRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schemaValidation = schema(t);

  // Validar dinámicamente al escribir
  const validarCampo = (campo: string, valor: string) => {
    const data = { email, password, repeatPassword, [campo]: valor };
    const result = schemaValidation.safeParse(data);

    if (!result.success) {
      const issues = result.error.issues.filter((i) => i.path[0] === campo);
      if (issues.length > 0) {
        setErrors((prev) => ({ ...prev, [campo]: issues[0].message }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[campo];
          return newErrors;
        });
      }
    } else {
      setErrors({});
    }
  };

  const handleVincular = async () => {
    const result = schemaValidation.safeParse({ email, password, repeatPassword });

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(formattedErrors);
      toast.error(t('toasts.formErrors'));
      return;
    }

    setLoading(true);
    const response = await vincularCorreoContrasena(token, email, password);
    setSuccess(response.success);

    if (response.success) {
      toast.success(response.message);
      onLinked?.(response.client);
      setMostrarFormulario(false);
      setEmail('');
      setPassword('');
      setRepeatPassword('');
      setErrors({});
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  return (
    <div className='w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:bg-gray-50 transition'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 align-middle'>
          <Mail size={28} className='text-gray-800' />
          <div className='flex flex-col'>
            <span className='text-sm font-semibold text-gray-800'>{t('title')}</span>
            <span className='text-xs text-gray-500'>{t('subtitle')}</span>
          </div>
        </div>

        <button
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className='flex items-center justify-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60'
        >
          {mostrarFormulario ? t('buttons.cancel') : t('buttons.link')}
        </button>
      </div>

      {mostrarFormulario && (
        <div className='mt-4 border-t border-gray-200 pt-4'>
          {/* Correo */}
          <div className='mb-3'>
            <input
              type='email'
              placeholder={t('form.email.placeholder')}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validarCampo('email', e.target.value);
              }}
              className={`border rounded-lg px-3 py-2 w-full text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <p className='text-red-600 text-xs mt-1'>{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div className='relative mb-3'>
            <input
              type={mostrarPassword ? 'text' : 'password'}
              placeholder={t('form.password.placeholder')}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validarCampo('password', e.target.value);
              }}
              className={`border rounded-lg px-3 py-2 w-full text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none pr-10 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            <button
              type='button'
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className='absolute right-3 top-2.5 text-gray-500 hover:text-gray-700'
            >
              {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className='text-red-600 text-xs mt-1'>{errors.password}</p>}
          </div>

          {/* Repetir contraseña */}
          <div className='relative mb-3'>
            <input
              type={mostrarRepeatPassword ? 'text' : 'password'}
              placeholder={t('form.repeatPassword.placeholder')}
              value={repeatPassword}
              onChange={(e) => {
                setRepeatPassword(e.target.value);
                validarCampo('repeatPassword', e.target.value);
              }}
              className={`border rounded-lg px-3 py-2 w-full text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none pr-10 ${
                errors.repeatPassword ? 'border-red-500' : ''
              }`}
            />
            <button
              type='button'
              onClick={() => setMostrarRepeatPassword(!mostrarRepeatPassword)}
              className='absolute right-3 top-2.5 text-gray-500 hover:text-gray-700'
            >
              {mostrarRepeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.repeatPassword && (
              <p className='text-red-600 text-xs mt-1'>{errors.repeatPassword}</p>
            )}
          </div>

          {/* Botón confirmar */}
          <button
            onClick={handleVincular}
            disabled={loading}
            className='w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60'
          >
            {loading ? t('buttons.linking') : t('buttons.confirm')}
          </button>

          {success && (
            <p className='mt-3 text-sm text-green-600 font-medium'>{t('success.message')}</p>
          )}
        </div>
      )}
    </div>
  );
}
