'use client';

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

interface GoogleButtonProps {
  onLoginSuccess: (credentialResponse: CredentialResponse) => void;
  disabled?: boolean;
  onDisabledClick?: () => void;
}

export default function GoogleButton({
  onLoginSuccess,
  disabled,
  onDisabledClick,
}: GoogleButtonProps) {
  return (
    <div className='relative inline-block'>
      <button
        className={`flex items-center gap-2 bg-white border border-gray-300 
          font-semibold py-2 px-4 rounded-lg shadow-sm text-black transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
        `}
      >
        <FcGoogle size={24} />
        Continuar con Google
      </button>

      {disabled ? (
        <div className='absolute inset-0 cursor-not-allowed' onClick={() => onDisabledClick?.()} />
      ) : (
        <div className='absolute inset-0 opacity-0 cursor-pointer'>
          <GoogleLogin
            onSuccess={onLoginSuccess}
            onError={() => console.log('Error al iniciar sesión con Google')}
          />
        </div>
      )}
    </div>
  );
}
