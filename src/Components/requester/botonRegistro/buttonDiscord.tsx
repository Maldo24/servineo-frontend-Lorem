'use client';
import { FaDiscord } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/Components/requester/auth/usoAutentificacion';

interface DiscordButtonProps {
  onNotify?: (n: {
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
  }) => void;

  captchaValid: boolean;
}

export default function DiscordButton({ onNotify, captchaValid }: DiscordButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleDiscord = () => {
    if (!captchaValid) {
      onNotify?.({
        type: 'warning',
        title: 'Completa la verificación',
        message: 'Debes completar el captcha antes de continuar.',
      });
      return;
    }

    setLoading(true);

    const popup = window.open(`${API_URL}/auth/discord`, 'DiscordLogin', 'width=600,height=700');

    if (!popup) {
      setLoading(false);
      onNotify?.({
        type: 'error',
        title: 'Error al abrir ventana',
        message: 'No se pudo abrir el popup de Discord.',
      });
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== API_URL) return;
      const data = event.data;

      // ---- ÉXITO ----
      if (data.type === 'DISCORD_AUTH_SUCCESS') {
        onNotify?.({
          type: 'success',
          title: 'Inicio de sesión exitoso',
          message: `Bienvenido ${data.user?.name || ''}`,
        });

        localStorage.setItem('servineo_token', data.token);

        if (data.user) {
          localStorage.setItem('servineo_user', JSON.stringify(data.user));
          setUser(data.user);
        }

        popup.close();
        window.removeEventListener('message', handleMessage);
        setLoading(false);

        setTimeout(() => {
          if (data.isFirstTime) {
            router.push('/signUp/registrar/registroUbicacion');
          } else {
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          }
        }, 2000);
      }

      // ---- ERROR ----
      if (data.type === 'DISCORD_AUTH_ERROR') {
        onNotify?.({
          type: 'error',
          title: 'Error de autenticación',
          message: data.message || 'No se pudo autenticar con Discord',
        });

        popup.close();
        window.removeEventListener('message', handleMessage);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  return (
    <button
      onClick={handleDiscord}
      disabled={loading}
      className={`flex items-center gap-2 bg-[#5865F2] text-white font-semibold py-2 px-4 rounded-lg transition
        ${!captchaValid ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
      `}
    >
      <FaDiscord size={20} />
      {loading ? 'Cargando...' : 'Continuar con Discord'}
    </button>
  );
}
