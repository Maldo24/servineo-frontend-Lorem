'use client';
import React, { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onVerify: (token: string) => Promise<void> | void;
  loading?: boolean;
}

// 🆕 Agregar interfaz para el error de axios
interface AxiosErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
      minutesLeft?: number;
      minutosRestantes?: number;
      attemptsLeft?: number;
      intentosRestantes?: number;
    };
  };
}

export default function VerifyTokenModal({ open, onClose, onVerify, loading }: Props) {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // NUEVO: intentos restantes y mensaje de bloqueo
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [lockedInfo, setLockedInfo] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCode('');
      setErrorMsg(null);
      setShake(false);
      setAttemptsLeft(null);
      setLockedInfo(null);
    } else {
      setCode('');
      setErrorMsg(null);
      setShake(false);
      setAttemptsLeft(null);
      setLockedInfo(null);
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setCode(onlyDigits.slice(0, 6));
    if (errorMsg) setErrorMsg(null);
    if (attemptsLeft !== null) setAttemptsLeft(null);
    if (lockedInfo) setLockedInfo(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (code.length !== 6) {
      setErrorMsg('El código debe tener exactamente 6 dígitos.');
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    try {
      await onVerify(code.trim());
    } catch (err) {
      // Limpio estados anteriores
      setAttemptsLeft(null);
      setLockedInfo(null);

      let msg = 'Código incorrecto o expirado. Intenta nuevamente.';

      // ✅ Type guard con tipado correcto
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as AxiosErrorResponse;
        const status = axiosError.response?.status;
        const data = axiosError.response?.data;

        if (status === 423) {
          // bloqueado por demasiados intentos
          const minutes = data?.minutesLeft || data?.minutosRestantes || 5;

          setLockedInfo(`Podrás volver a intentar en aproximadamente ${minutes} minuto(s).`);
          msg = `Cuenta bloqueada por demasiados intentos fallidos. Intenta de nuevo en ${minutes} minutos.`;
        } else if (status === 429) {
          // limite de intentos alcanzado pero aún no bloqueado
          const remaining = data?.attemptsLeft ?? data?.intentosRestantes ?? 0;
          setAttemptsLeft(remaining);
          msg = data?.message || `Código incorrecto. Te quedan ${remaining} intentos.`;
        } else if (status === 400 || status === 401) {
          msg = data?.message || 'Código incorrecto o expirado.';
        }
      }

      setErrorMsg(msg);
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <form
        onSubmit={handleSubmit}
        className={`bg-white rounded-lg w-[420px] p-6 shadow-lg border transition-all duration-300 ${
          shake ? 'animate-shake border-red-400' : ''
        }`}
      >
        <h3 className='text-lg font-semibold mb-2'>Ingresa el código de autenticador</h3>
        <p className='text-sm text-gray-600 mb-4'>
          Introduce los 6 dígitos que muestra tu app de autenticación.
        </p>
        <input
          autoFocus
          inputMode='numeric'
          pattern='[0-9]*'
          value={code}
          onChange={handleChange}
          className={`w-full p-2 border rounded mb-2 font-mono text-lg text-center tracking-widest transition-all ${
            errorMsg ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder='••••••'
        />

        {errorMsg && (
          <div className='text-red-600 text-sm mb-1 text-center font-medium'>{errorMsg}</div>
        )}

        {/* NUEVO: intentos restantes */}
        {attemptsLeft !== null && attemptsLeft >= 0 && (
          <div className='text-xs text-center text-red-500 mb-1'>
            Intentos restantes: <span className='font-semibold'>{attemptsLeft}</span>
          </div>
        )}

        {/* NUEVO: info de bloqueo */}
        {lockedInfo && <div className='text-xs text-center text-red-500 mb-2'>{lockedInfo}</div>}

        <div className='flex justify-end gap-3 mt-2'>
          <button
            type='button'
            onClick={() => {
              setCode('');
              setErrorMsg(null);
              setAttemptsLeft(null);
              setLockedInfo(null);
              onClose();
            }}
            className='px-3 py-2 rounded border text-sm bg-white text-gray-700'
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='px-4 py-2 rounded text-sm bg-indigo-600 text-white'
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          75% {
            transform: translateX(-4px);
          }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
