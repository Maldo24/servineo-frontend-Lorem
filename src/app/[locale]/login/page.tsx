'use client';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, ApiResponse } from '@/app/redux/services/loginApi';
import { Eye, EyeOff } from 'lucide-react';
import LoginGoogle from '@/Components/login/Proveedores/LoginGoogle';
import { useRouter } from 'next/navigation';
import NotificationModal from '@/Components/Modal-notifications';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@/app/redux/hooks';
import { setUser } from '@/app/redux/slice/userSlice';
import LoginGithub from '@/Components/login/Proveedores/LoginGitHub';
import LoginDiscord from '@/Components/login/Proveedores/LoginDiscord';
// Nuevos modales para 2FA / selección de método
import OpcionesLoginModal from '@/Components/login/SeleccionMetodoModal';
import AuthenticatorSesion from '@/Components/requester/Authenticator/AuthenticatorSesionModal';
import AuthenticatorTOTPModal from '@/Components/requester/Authenticator/AuthenticatorTOTPModal';
import CodigoRecuperacionModal from '@/Components/requester/Authenticator/AuthenticatorCodigoModal';

/* ----------------------------- Interfaces ----------------------------- */
interface LoginFormData {
  email: string;
  password: string;
}

interface BackendUser {
  name: string;
  id?: string;
  _id?: string;
  email?: string;
  picture?: string;
  url_photo?: string;
  displayName?: string;
  [key: string]: unknown;
  role?: string;
}

interface LoginResponse {
  token: string;
  user: BackendUser;
  message?: string;
  // propiedades opcionales que el backend puede devolver para MFA
  requires2FA?: boolean;
  mfaRequired?: boolean;
  mfaMethods?: string[];
  email?: string;
}

interface NotificationState {
  isOpen: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

/* ------------------------------ Component ----------------------------- */
export default function LoginPage() {
  const t = useTranslations('Login');
  const [mostrarPass, setMostrarPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // ✅ Schema de Zod usando useMemo para que no se recree en cada render
  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t('errors.invalidEmail')),
        password: z.string().min(6, t('errors.passwordMinLength')),
      }),
    [t],
  );

  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Estado para los nuevos modales de autenticación/métodos
  const [modalActivo, setModalActivo] = useState<
    'none' | 'opciones' | 'sesion' | 'totp' | 'codigo'
  >('none');
  const [emailTOTP, setEmailTOTP] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const manejarLogin = async (data: LoginFormData): Promise<void> => {
    setLoading(true);
    try {
      const res: ApiResponse<LoginResponse> = await api.post('/login', data);

      if (res.success && res.data) {
        const datos = res.data;

        const normalizedUser = {
          ...datos.user,
          _id: (datos.user._id || datos.user.id) as string,
          id: (datos.user.id || datos.user._id) as string,
          name: (datos.user.name || datos.user.displayName || 'Usuario') as string,
          email: datos.user.email as string,
          url_photo: (datos.user.picture || datos.user.url_photo || null) as string | undefined,
          role: (datos.user.role || 'requester') as 'requester' | 'fixer' | 'admin',
        };
        // Detectar si el backend requiere MFA/2FA y abrir los modales correspondientes
        const needs2FA = Boolean(
          datos.requires2FA ||
          datos.mfaRequired ||
          (datos.mfaMethods && datos.mfaMethods.length > 0),
        );

        if (needs2FA) {
          const emailFor2FA = datos.email || datos.user?.email || data.email;
          setEmailTOTP(emailFor2FA ?? '');

          const methods = datos.mfaMethods || [];

          if (methods.includes('passwordless') || methods.includes('session')) {
            setModalActivo('sesion');
          } else if (
            methods.includes('totp') ||
            methods.includes('otp') ||
            methods.includes('totp_sms')
          ) {
            setModalActivo('totp');
          } else {
            setModalActivo('opciones');
          }

          setNotification({
            isOpen: true,
            type: 'info',
            title: 'Verificación adicional requerida',
            message: datos.message || 'Se requiere un paso adicional para verificar tu cuenta.',
          });

          // No guardar token/localStorage hasta completar el flujo de MFA
          return;
        }

        // Si no requiere 2FA, proceder normalmente
        if (datos.token) {
          localStorage.setItem('servineo_token', datos.token);
        }
        localStorage.setItem('servineo_user', JSON.stringify(normalizedUser));

        dispatch(setUser(normalizedUser));

        const mensajeExito = datos.message || t('success.welcome', { name: normalizedUser.name });

        setNotification({
          isOpen: true,
          type: 'success',
          title: t('success.title'),
          message: mensajeExito,
        });

        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        const mensajeError =
          res.message ||
          (res.data as unknown as { message?: string })?.message ||
          (res as unknown as { error?: string })?.error ||
          t('errors.invalidCredentials');

        setNotification({
          isOpen: true,
          type: 'error',
          title: t('errors.loginError'),
          message: mensajeError,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.connectionError');
      setNotification({
        isOpen: true,
        type: 'error',
        title: t('errors.connectionErrorTitle'),
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMensajeChange = (mensaje: string): void => {
    setNotification({
      isOpen: true,
      type: 'error',
      title: t('errors.googleError'),
      message: mensaje,
    });
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;

        const apiOrigin = new URL(apiUrl).origin;
        if (event.origin !== apiOrigin) return;

        const data = event.data || {};
        const { type, token, user, message } = data;

        if (type === 'GITHUB_AUTH_SUCCESS') {
          if (token && user) {
            localStorage.setItem('servineo_token', token);
            localStorage.setItem('servineo_user', JSON.stringify(user));

            const nombre = (user as { name?: string }).name || 'Usuario';

            setNotification({
              isOpen: true,
              type: 'success',
              title: 'Inicio de sesión exitoso',
              message: `¡Bienvenido, ${nombre}!`,
            });

            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          } else {
            setNotification({
              isOpen: true,
              type: 'error',
              title: 'Error al iniciar sesión',
              message: 'Respuesta inválida desde GitHub. Inténtalo nuevamente.',
            });
          }
        }

        if (type === 'GITHUB_AUTH_ERROR') {
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Error al iniciar sesión',
            message: message || 'No se pudo iniciar sesión con GitHub.',
          });
        }
      } catch (err) {
        console.error('Error procesando mensaje de GitHub:', err);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 🔹 Manejo de login con Discord (redirect a /login?provider=discord&code=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const search = window.location.search;
    const params = new URLSearchParams(search);
    const provider = params.get('provider');
    const code = params.get('code');
    const error = params.get('error');

    // Solo nos interesa cuando viene de Discord
    if (provider !== 'discord') return;

    if (error) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error de autenticación',
        message: error,
      });
      window.history.replaceState({}, '', '/login');
      return;
    }

    if (!code) return;

    const loginDiscord = async () => {
      try {
        setLoading(true);

        const res: ApiResponse<LoginResponse> = await api.post('/login/discord', { code });

        if (res.success && res.data) {
          const datos = res.data;

          localStorage.setItem('servineo_token', datos.token);
          localStorage.setItem('servineo_user', JSON.stringify(datos.user));

          const mensajeExito = datos.message || `¡Bienvenido, ${datos.user.name}!`;

          setNotification({
            isOpen: true,
            type: 'success',
            title: 'Inicio de sesión exitoso',
            message: mensajeExito,
          });

          // limpiar parámetros de la URL
          window.history.replaceState({}, '', '/login');

          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          const mensajeError =
            res.message ||
            (res.data as unknown as { message?: string })?.message ||
            (res as unknown as { error?: string })?.error ||
            'No se pudo iniciar sesión con Discord.';

          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Error al iniciar sesión',
            message: mensajeError,
          });

          window.history.replaceState({}, '', '/login');
        }
      } catch (err: unknown) {
        console.error('[LOGIN] Error en loginDiscord:', err);
        const message = err instanceof Error ? err.message : 'No se pudo conectar con el servidor.';
        setNotification({
          isOpen: true,
          type: 'error',
          title: 'Error de conexión',
          message,
        });
      } finally {
        setLoading(false);
      }
    };

    loginDiscord();
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <main className='relative min-h-screen flex items-center justify-center px-6 text-foreground'>
        {/* Fondo ultra sutil */}
        <div className='pointer-events-none absolute inset-0 -z-10'>
          <div className='absolute inset-0 bg-background' />
          <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent' />
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')]" />
        </div>

        {/* Card de Login */}
        <div className='w-full max-w-sm bg-card/95 backdrop-blur-sm rounded-3xl shadow-lg p-10 border border-border/70'>
          <h1 className='text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary/80 to-primary/60 bg-clip-text text-transparent'>
            {t('title')} <span className='sr-only'>Servineo</span>
          </h1>
          <p className='text-center text-sm text-muted-foreground mb-8'>{t('mode')}</p>

          {/* Formulario */}
          <form onSubmit={handleSubmit(manejarLogin)} className='flex flex-col gap-5'>
            {/* Correo */}
            <div>
              <label className='block text-sm font-semibold text-foreground/80 mb-2'>
                {t('form.email.label')}*
              </label>
              <input
                type='email'
                placeholder={t('form.email.placeholder')}
                {...register('email')}
                className='w-full rounded-xl p-3.5 text-foreground bg-background border border-border
                           focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition'
                autoComplete='email'
              />
              {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className='block text-sm font-semibold text-foreground/80 mb-2'>
                {t('form.password.label')}*
              </label>
              <div className='relative'>
                <input
                  type={mostrarPass ? 'text' : 'password'}
                  placeholder={t('form.password.placeholder')}
                  {...register('password')}
                  className='w-full rounded-xl p-3.5 pr-10 text-foreground bg-background border border-border
                             focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition'
                  autoComplete='current-password'
                />
                <button
                  type='button'
                  onClick={() => setMostrarPass(!mostrarPass)}
                  className='absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary/80 transition'
                  aria-label={mostrarPass ? t('aria.hidePassword') : t('aria.showPassword')}
                >
                  {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>
              )}
            </div>

            {/* 🆕 UN SOLO BOTÓN que abre el modal de opciones */}
            <p className='text-center text-sm text-muted-foreground'>
              <button
                type='button'
                onClick={() => setModalActivo('opciones')}
                className='text-primary/90 hover:text-primary font-medium hover:underline transition'
              >
                {t('links.forgotPassword')}
              </button>
            </p>

            {/* Botón ingresar */}
            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-xl p-3.5 mt-2 font-semibold text-primary-foreground
                         bg-primary/90 hover:bg-primary transition-all duration-300
                         shadow-sm hover:shadow disabled:opacity-60'
            >
              {loading ? t('buttons.loading') : t('buttons.login')}
            </button>
          </form>

          {/* Separador */}
          <div className='flex items-center my-8'>
            <div className='flex-1 h-px bg-border/70' />
            <span className='px-2 text-muted-foreground text-sm'>{t('separator')}</span>
            <div className='flex-1 h-px bg-border/70' />
          </div>

          {/* Botón Google */}
          <div className='flex flex-col items-center gap-3 mt-4'>
            <LoginGoogle onMensajeChange={handleMensajeChange} />

            {/* Botón GitHub */}
            <LoginGithub onMensajeChange={handleMensajeChange} />

            {/* Botón Discord */}
            <LoginDiscord onMensajeChange={handleMensajeChange} />
          </div>

          {/* Registro */}
          <p className='mt-8 text-center text-sm text-muted-foreground'>
            {t('links.noAccount')}{' '}
            <button
              onClick={() => router.push('../signUp')}
              className='text-primary/90 hover:text-primary font-medium underline-offset-2 hover:underline'
            >
              {t('links.register')}
            </button>
          </p>
        </div>

        {/* 🔔 Notificación personalizada */}
        <NotificationModal
          isOpen={notification.isOpen}
          onClose={() => setNotification({ ...notification, isOpen: false })}
          type={notification.type}
          title={notification.title}
          message={notification.message}
        />
        {/* 🆕 MODAL DE OPCIONES */}
        <OpcionesLoginModal
          showModal={modalActivo === 'opciones'}
          onClose={() => setModalActivo('none')}
          onSelectForgotPassword={() => router.push('/login/forgotpass')}
          onSelectPasswordless={() => setModalActivo('sesion')}
        />

        {/* Modal Sesión */}
        {modalActivo === 'sesion' && (
          <AuthenticatorSesion
            showModal={true}
            setShowModal={() => setModalActivo('none')}
            emailTOTP={emailTOTP}
            setEmailTOTP={setEmailTOTP}
            abrirTOTP={() => setModalActivo('totp')}
          />
        )}

        {/* Modal TOTP */}
        {modalActivo === 'totp' && (
          <AuthenticatorTOTPModal
            showModal={true}
            setShowModal={() => setModalActivo('none')}
            regresarSesionModal={() => setModalActivo('sesion')}
            email={emailTOTP}
            abrirModalCodigo={() => setModalActivo('codigo')}
          />
        )}

        {/* Modal Código de recuperación */}
        {modalActivo === 'codigo' && (
          <CodigoRecuperacionModal
            showModal={true}
            cerrarModal={() => setModalActivo('none')}
            volverATOTP={() => setModalActivo('totp')}
            email={emailTOTP}
          />
        )}
      </main>
    </GoogleOAuthProvider>
  );
}
