'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/Components/requester/auth/usoAutentificacion';
import { CredentialResponse } from '@react-oauth/google';
import GoogleButton from '@/Components/requester/botonRegistro/buttonGoogle';
import { enviarTokenGoogle, GoogleAuthResponse } from '@/app/redux/services/auth/registro';

interface RegistroGoogleProps {
  onSuccessClose?: () => void;
  onNotify?: (notification: {
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
  }) => void;

  captchaValid: boolean;
}

export default function RegistroGoogle({
  onSuccessClose,
  onNotify,
  captchaValid,
}: RegistroGoogleProps) {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!captchaValid) {
      onNotify?.({
        type: 'warning',
        title: 'Completa la verificación',
        message: 'Debes confirmar que no eres un robot antes de continuar.',
      });
      return;
    }
    const token = credentialResponse?.credential;
    if (!token) {
      onNotify?.({
        type: 'error',
        title: 'Token no recibido',
        message: 'No se recibió el token de Google.',
      });
      return;
    }

    try {
      const data: GoogleAuthResponse = await enviarTokenGoogle(token);
      console.log('Respuesta del backend:', data);

      if (data.status === 'error') {
        onNotify?.({
          type: 'error',
          title: 'Error',
          message: data.message || 'Error al autenticar con Google.',
        });
        return;
      }

      if (data.firstTime) {
        onNotify?.({
          type: 'info',
          title: 'Bienvenido',
          message: 'Primera vez en Servineo. Completa tu perfil para continuar.',
        });

        sessionStorage.setItem('google_token_temp', token);
        if (onSuccessClose) onSuccessClose();

        setTimeout(() => router.push('/signUp/registrar/registroUbicacion'), 2500);
        return;
      }

      if (data.token) localStorage.setItem('servineo_token', data.token);
      if (data.user) {
        localStorage.setItem('servineo_user', JSON.stringify(data.user));
        setUser(data.user);
      }

      onNotify?.({
        type: 'success',
        title: 'Inicio de sesión exitoso',
        message: `Bienvenido nuevamente, ${data.user?.name || 'usuario'}`,
      });

      if (onSuccessClose) onSuccessClose();
      setTimeout(() => (window.location.href = '/'), 2000);
    } catch (error: unknown) {
      console.error('Error al enviar el token al backend:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el servidor. Intenta nuevamente.';

      onNotify?.({
        type: 'error',
        title: 'Error de conexión',
        message: errorMessage,
      });
    }
  };

  return (
    <div className='flex justify-center'>
      <GoogleButton
        onLoginSuccess={handleLoginSuccess}
        disabled={!captchaValid}
        onDisabledClick={() =>
          onNotify?.({
            type: 'warning',
            title: 'Verificación requerida',
            message: 'Debes completar el captcha antes de continuar.',
          })
        }
      />
    </div>
  );
}
