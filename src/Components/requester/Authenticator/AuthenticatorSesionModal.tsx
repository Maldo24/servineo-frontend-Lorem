'use client';
import { useState } from 'react';
import { api } from '../../../app/redux/services/api';

interface AuthenticatorSesionProps {
  showModal: boolean;
  setShowModal: () => void; // cierra este modal
  emailTOTP: string; // correo interno TOTP
  setEmailTOTP: (email: string) => void;
  abrirTOTP: () => void; // abre modal TOTP
}

interface TwoFactorResponse {
  success: boolean;
  data?: {
    exists: boolean;
    twoFactorEnabled: boolean;
    reason: string;
  };
  message?: string;
}

export default function AuthenticatorSesion({
  showModal,
  setShowModal,
  emailTOTP,
  setEmailTOTP,
  abrirTOTP,
}: AuthenticatorSesionProps) {
  const [email, setEmail] = useState(emailTOTP || '');
  const [errorMessage, setErrorMessage] = useState('');

  if (!showModal) return null;

  const handleContinuar = async () => {
    if (!email) {
      setErrorMessage('Debe ingresar un correo');
      setTimeout(() => setErrorMessage(''), 10000);
      return;
    }

    try {
      const res = await api.post<TwoFactorResponse>('/api/editProfile/check-status', { email });
      const exists = res.data?.data?.exists;
      const twoFactorEnabled = res.data?.data?.twoFactorEnabled;

      if (exists === undefined || twoFactorEnabled === undefined) {
        setErrorMessage(res.data?.message || 'Error al verificar usuario');
        setTimeout(() => setErrorMessage(''), 10000);
        return;
      }

      if (!exists) {
        setErrorMessage('Correo electrónico incorrecto');
        setTimeout(() => setErrorMessage(''), 10000);
      } else if (!twoFactorEnabled) {
        setErrorMessage('Su cuenta no tiene configurada la app Authenticator');
        setTimeout(() => setErrorMessage(''), 10000);
      } else {
        // Guardamos correo para TOTP
        setEmailTOTP(email);
        setShowModal(); // cierra modal de sesión
        abrirTOTP(); // abre modal TOTP
      }
    } catch (err) {
      setErrorMessage('Error de conexión con el servidor');
      setTimeout(() => setErrorMessage(''), 10000);
      console.error(err);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='bg-white w-[520px] rounded-lg shadow-lg p-8'>
        <h2 className='text-3xl font-bold text-center text-servineo-500 mb-1'>
          <span className='text-servineo-400'>Servineo</span>
        </h2>
        <p className='text-2xl font-bold text-center text-servineo-500 mb-6'>Authenticator App</p>
        <p className='block text-sm font-semibold text-gray-600 mb-2'>
          Debe de tener configurado su app Authenticator
        </p>
        <p className='block text-sm font-semibold text-gray-600 mb-4'>
          Para el ingreso sin contraseña, ingrese su correo electrónico
        </p>
        <label className='block text-sm font-semibold text-gray-600 mb-2'>
          Correo electrónico*
        </label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Ingrese su correo electrónico'
          className='w-full border border-gray-300 rounded-xl p-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-servineo-400 transition mb-2'
        />

        {errorMessage && (
          <p className='text-red-600 text-sm font-semibold mb-4 transition-opacity duration-1000'>
            {errorMessage}
          </p>
        )}

        <div className='mt-6 flex justify-end gap-3'>
          <button
            onClick={setShowModal}
            className='flex-1 rounded-md bg-[#E5F4FB] px-4 py-2 text-[#1A223F] font-semibold hover:bg-[#2BDDE0]/20'
          >
            Cancelar
          </button>

          <button
            onClick={handleContinuar}
            className='flex-1 rounded-md bg-[#1A223F] px-4 py-2 text-white font-semibold hover:bg-[#2B31E0]'
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
