'use client';

import { useState } from 'react';
import { api, ApiResponse } from '../../../app/redux/services/api';

interface AuthenticatorCodigoModalProps {
  showModal: boolean;
  cerrarModal: () => void;
  volverATOTP: () => void;
  email: string;
}

interface RecoveryCodeResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      _id: string;
      email: string;
      name: string;
      picture?: string | null;
    };
  };
}

export default function AuthenticatorCodigoModal({
  showModal,
  cerrarModal,
  volverATOTP,
  email,
}: AuthenticatorCodigoModalProps) {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!showModal) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setCodigo(value.slice(0, 10));
    setErrorMsg('');
  };

  const handleIngresar = async () => {
    if (!codigo) {
      setErrorMsg('Ingresa un código de recuperación');
      return;
    }

    setLoading(true);

    try {
      const res: ApiResponse<RecoveryCodeResponse> = await api.post(
        '/codigos2fa/verify-recovery-code',
        { email, codigo },
      );

      const inner = res.data;

      if (!inner?.success) {
        setErrorMsg(inner?.message || 'Código incorrecto');
        return;
      }

      const token = inner?.data?.token;
      const user = inner?.data?.user;

      if (!token || !user) {
        setErrorMsg('Respuesta inválida del servidor');
        return;
      }

      // ✔️ Guardar token y usuario EXACTAMENTE igual al modal TOTP
      localStorage.setItem('servineo_token', token);
      localStorage.setItem('servineo_user', JSON.stringify(user));

      // ✔️ Mostrar el mensaje de bienvenida igual que en TOTP
      sessionStorage.setItem('toastMessage', `¡Bienvenido, ${user.name}!`);

      // Cerrar modal y redirigir
      cerrarModal();
      window.location.href = '/';
      return;
    } catch (err) {
      console.error('Error al verificar código de recuperación:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error en el servidor';
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
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
          Ingresar con código de recuperación
        </p>

        <form
          className='bg-white rounded-lg w-[420px] p-6 shadow-lg border mx-auto mt-2'
          onSubmit={(e) => {
            e.preventDefault();
            handleIngresar();
          }}
        >
          <p className='text-sm text-gray-600 mb-4 text-center'>
            Ingresa uno de los códigos de recuperacion que se le otorgo al configurar la app de
            Authenticator.
          </p>

          <input
            placeholder='Ingrese un código de recuperación'
            value={codigo}
            onChange={handleChange}
            className='w-full border rounded-xl p-3.5 text-gray-800 text-center font-mono focus:outline-none focus:ring-2 focus:ring-servineo-400'
            maxLength={10}
            required
          />

          {errorMsg && (
            <p className='text-red-600 text-sm mt-2 text-center font-medium'>{errorMsg}</p>
          )}

          <div className='flex gap-4 mt-6'>
            <button
              type='button'
              onClick={() => {
                cerrarModal();
                volverATOTP();
              }}
              className='flex-1 rounded-md bg-[#E5F4FB] px-4 py-2 text-[#1A223F] font-semibold hover:bg-[#2BDDE0]/20'
            >
              Volver
            </button>

            <button
              type='submit'
              disabled={loading}
              className='flex-1 rounded-md bg-[#1A223F] px-4 py-2 text-white font-semibold hover:bg-[#2B31E0]'
            >
              {loading ? 'Validando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
