// Components/login/Proveedores/LoginGitHub.tsx
'use client';

import React from 'react';
import { FaGithub } from 'react-icons/fa';

interface Props {
  onMensajeChange: (mensaje: string) => void;
}

const LoginGithub: React.FC<Props> = ({ onMensajeChange }) => {
  const handleGithubClick = () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL; // ej: http://localhost:8000
      if (!baseUrl) {
        onMensajeChange('Falta configurar NEXT_PUBLIC_API_URL para GitHub.');
        return;
      }

      // 👇 Armamos el state como JSON, tal y como espera tu githubAuth
      const stateObj = { mode: 'login-only' };
      const state = encodeURIComponent(JSON.stringify(stateObj));

      const authUrl = `${baseUrl}/auth/github?state=${state}`;

      // 🔹 Abrimos en popup (para que githubAuth pueda usar window.opener.postMessage)
      window.open(authUrl, 'github_oauth', 'width=600,height=700,menubar=no,toolbar=no');
    } catch (error) {
      console.error(error);
      onMensajeChange('No se pudo iniciar el login con GitHub.');
    }
  };

  return (
    <div className='w-full flex justify-center'>
      <button
        type='button'
        onClick={handleGithubClick}
        className='inline-flex items-center justify-center gap-3
                   bg-white border border-gray-300 rounded-xl
                   px-4 py-3 text-base font-medium
                   hover:bg-gray-100 transition shadow-sm'
      >
        <FaGithub className='text-xl' />
        <span>Continuar con GitHub</span>
      </button>
    </div>
  );
};

export default LoginGithub;
