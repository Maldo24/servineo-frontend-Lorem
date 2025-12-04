'use client';

import { useState } from 'react';
import { api, ApiResponse } from '../../../app/redux/services/api';

interface AuthenticatorTOTPModalProps {
  showModal: boolean;
  setShowModal: () => void;
  regresarSesionModal: () => void;
  abrirModalCodigo: () => void;
  email: string;
}

interface VerifyTOTPData {
  token?: string;
  user?: {
    _id: string;
    email: string;
    name: string;
    picture?: string | null;
  };
  firstTime?: boolean;
}

export default function AuthenticatorTOTPModal({
  showModal,
  setShowModal,
  regresarSesionModal,
  abrirModalCodigo,
  email,
}: AuthenticatorTOTPModalProps) {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!showModal) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, '');
    setCode(onlyNumbers.slice(0, 6));
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      setErrorMsg('Ingrese un código válido de 6 dígitos');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      setLoading(true);
      const res: ApiResponse<VerifyTOTPData> = await api.post('/2fa-ingresar/verify-totp', {
        email,
        code,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Código incorrecto');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      if (!res.data || !res.data.token || !res.data.user) {
        setErrorMsg('Respuesta inválida del servidor');
        return;
      }

      const { token, user } = res.data;

      if (token) localStorage.setItem('servineo_token', token);
      if (user) {
        localStorage.setItem('servineo_user', JSON.stringify(user));
        sessionStorage.setItem('toastMessage', `¡Bienvenido, ${user.name}!`);
      }

      setShowModal();
      window.location.href = '/';
    } catch (err) {
      console.error('Error al verificar TOTP:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error de servidor';
      setErrorMsg(errorMessage);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    setShowModal();
    regresarSesionModal();
  };

  const colors = [
    'text-blue-500',
    'text-red-500',
    'text-yellow-500',
    'text-blue-500',
    'text-green-500',
    'text-red-500',
    'text-yellow-500',
  ];
  const text = 'Google Authenticator';

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='bg-white w-[520px] rounded-lg shadow-lg p-8'>
        <h2 className='text-3xl font-bold text-center text-servineo-500 mb-1'>
          <span className='text-servineo-400'>Servineo</span>
        </h2>

        <p className='text-2xl font-bold text-center text-servineo-500 mb-6'>Authenticator App</p>

        <p className='block text-sm font-semibold text-gray-600 mb-10'>Bienvenido {email}!!</p>

        <p className='text-center mb-6 text-2xl font-bold'>
          {text.split('').map((char, idx) => {
            const colorClass = colors[idx % colors.length];
            return (
              <span key={idx} className={colorClass}>
                {char}
              </span>
            );
          })}
        </p>

        {/* FORMULARIO PRINCIPAL */}
        <form
          onSubmit={handleSubmit}
          className={`bg-white rounded-lg w-[420px] p-6 shadow-lg border mx-auto transition-all duration-300 ${shake ? 'animate-shake border-red-400' : ''}`}
        >
          <h3 className='text-lg font-semibold mb-2 text-center'>
            Ingresa el código de autenticador
          </h3>
          <p className='text-sm text-gray-600 mb-4 text-center'>
            Introduce los 6 dígitos que muestra tu app de autenticación.
          </p>

          <input
            autoFocus
            inputMode='numeric'
            pattern='\d{6}'
            maxLength={6}
            value={code}
            onChange={handleChange}
            className={`w-full p-2 border rounded mb-2 font-mono text-lg text-center tracking-widest transition-all ${
              errorMsg ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder='••••••'
          />

          {errorMsg && (
            <div className='text-red-600 text-sm mb-3 text-center font-medium'>{errorMsg}</div>
          )}

          <div className='flex gap-4 mt-4'>
            <button
              type='button'
              onClick={handleVolver}
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

        {/* TEXTO + BOTÓN PARA ABRIR MODAL DE RECUPERACIÓN */}
        <p className='text-center text-sm text-gray-600 mt-4'>
          Si no tienes acceso a Google Authenticator
        </p>

        <div className='text-center mt-2'>
          <button
            type='button'
            onClick={abrirModalCodigo}
            className='text-servineo-400 hover:text-servineo-500 font-medium hover:underline transition'
          >
            Ingresar con código de recuperación
          </button>
        </div>
      </div>
    </div>
  );
}
