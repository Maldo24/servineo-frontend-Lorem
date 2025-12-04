'use client';

import React from 'react';
import { FaDiscord } from 'react-icons/fa';

interface Props {
  onMensajeChange: (mensaje: string) => void;
}

const LoginDiscord: React.FC<Props> = ({ onMensajeChange }) => {
  const handleDiscordClick = () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
      if (!clientId) {
        onMensajeChange('Falta configurar NEXT_PUBLIC_DISCORD_CLIENT_ID.');
        return;
      }

      const redirectUri = `${window.location.origin}/login?provider=discord`;
      const scope = 'identify email';

      const discordUrl =
        `https://discord.com/api/oauth2/authorize` +
        `?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scope)}`;

      window.location.href = discordUrl;
    } catch (error) {
      console.error(error);
      onMensajeChange('No se pudo iniciar el login con Discord.');
    }
  };

  return (
    <div className='w-full flex justify-center'>
      <button
        type='button'
        onClick={handleDiscordClick}
        className='inline-flex items-center justify-center gap-3
                   bg-[#5865F2] text-white rounded-xl
                   px-4 py-3 text-base font-medium
                   hover:bg-[#4752C4] transition shadow-sm'
      >
        <FaDiscord className='text-xl' />
        <span>Continuar con Discord</span>
      </button>
    </div>
  );
};

export default LoginDiscord;
