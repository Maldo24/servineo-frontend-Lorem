'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ✅ Validación con Zod
const forgotSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo no puede estar vacío')
    .email('Debe ingresar un correo válido'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

const BASE_API = `${process.env.NEXT_PUBLIC_API_URL}/api/controlC`;

export default function RecuperacionCorreoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ✅ React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const email = watch('email');

  useEffect(() => {
    if (serverError) {
      const id = setTimeout(() => setServerError(null), 5000);
      return () => clearTimeout(id);
    }
  }, [serverError]);

  //  Lógica del envío (mantiene todo igual)
  const handleEnviar = async (data: ForgotFormData) => {
    setServerError(null);
    setLoading(true);

    const fallback = setTimeout(() => setServerError('Estamos tardando más de lo normal…'), 3000);

    try {
      const res = await fetch(`${BASE_API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      const responseData = await res.json();

      if (res.ok && responseData.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('servineo_last_email', data.email);
        }
        router.push('/login/forgotpass/resend');
      } else if (res.status === 404) {
        setServerError('El correo no está asociado a ninguna cuenta.');
      } else if (res.status === 429) {
        setServerError('Ya existe una solicitud en curso. Intenta nuevamente en 1 minuto.');
      } else {
        setServerError(responseData.message || 'Error al solicitar el enlace.');
      }
    } catch {
      setServerError('Error de conexión con el servidor.');
    } finally {
      clearTimeout(fallback);
      setLoading(false);
    }
  };

  const emailValid = !errors.email && !!email;

  return (
    <main className='relative min-h-screen flex items-center justify-center px-6 text-foreground'>
      {/* Fondo ultra sutil */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-background' />
        <div className='absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent' />
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')]" />
      </div>

      <div className='w-full max-w-sm bg-card/95 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-border/70'>
        <h1 className='text-2xl font-semibold mb-2 bg-gradient-to-r from-primary/80 to-primary/60 bg-clip-text text-transparent'>
          Recuperación de acceso
        </h1>
        <p className='text-sm text-muted-foreground mb-6'>
          Te enviaremos un correo electrónico con un enlace para ingresar a tu cuenta.
        </p>

        {/* ✅ Form con React Hook Form */}
        <form onSubmit={handleSubmit(handleEnviar)} className='flex flex-col gap-4'>
          <label htmlFor='email' className='text-sm font-medium text-foreground/80'>
            Correo electrónico
          </label>
          <input
            id='email'
            type='email'
            placeholder='Ingresa tu correo'
            {...register('email')}
            className={`w-full rounded-xl p-3.5 text-foreground bg-background border ${
              errors.email || serverError
                ? 'border-destructive focus:ring-destructive/30'
                : 'border-border focus:ring-primary/40 focus:border-primary/40'
            } focus:outline-none focus:ring-2 transition`}
            aria-invalid={!!errors.email || !!serverError}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete='email'
          />

          {/* Errores de validación */}
          {errors.email && (
            <p
              id='email-error'
              role='status'
              aria-live='polite'
              className='text-sm text-destructive'
            >
              {errors.email.message}
            </p>
          )}

          {/* Errores del servidor */}
          {serverError && !errors.email && (
            <p
              id='server-error'
              role='status'
              aria-live='polite'
              className='text-sm text-destructive'
            >
              {serverError}
            </p>
          )}

          <button
            type='submit'
            disabled={!emailValid || loading}
            className={`w-full font-semibold rounded-xl p-3.5 mt-2 transition-all duration-300
              ${
                !emailValid || loading
                  ? 'bg-primary/30 text-primary-foreground/70 cursor-not-allowed shadow-none'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow'
              }`}
          >
            {loading ? 'Enviando...' : 'Enviar correo electrónico'}
          </button>
        </form>

        <div className='mt-6 text-center text-sm text-muted-foreground'>
          <Link href='/login' className='text-primary hover:underline font-medium'>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </main>
  );
}
