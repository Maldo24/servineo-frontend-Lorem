'use client';

interface Props {
  showModal: boolean;
  onClose: () => void;
  onSelectForgotPassword: () => void;
  onSelectPasswordless: () => void;
}

export default function OpcionesLoginModal({
  showModal,
  onClose,
  onSelectForgotPassword,
  onSelectPasswordless,
}: Props) {
  if (!showModal) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-200'>
        {/* Header */}
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Opciones de acceso</h2>
          <p className='text-sm text-gray-600'>Elige cómo deseas recuperar tu acceso</p>
        </div>

        {/* Opciones */}
        <div className='space-y-4'>
          {/* OPCIÓN 1: Olvidaste tu contraseña */}
          <button
            onClick={onSelectForgotPassword}
            className='w-full flex items-center gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 group'
          >
            <div className='w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-primary/20 transition'>
              <span className='text-2xl'>🔑</span>
            </div>
            <div className='flex-1 text-left'>
              <h3 className='font-semibold text-gray-800 group-hover:text-primary transition'>
                ¿Olvidaste tu contraseña?
              </h3>
              <p className='text-sm text-gray-600'>Recupera tu contraseña por correo electrónico</p>
            </div>
          </button>

          {/* OPCIÓN 2: Ingresar sin contraseña */}
          <button
            onClick={onSelectPasswordless}
            className='w-full flex items-center gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 group'
          >
            <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-primary/20 transition'>
              <span className='text-2xl'>🔐</span>
            </div>
            <div className='flex-1 text-left'>
              <h3 className='font-semibold text-gray-800 group-hover:text-primary transition'>
                Ingresar sin contraseña
              </h3>
              <p className='text-sm text-gray-600'>Usa Google Authenticator</p>
            </div>
          </button>
        </div>

        {/* Botón cancelar */}
        <button
          onClick={onClose}
          className='w-full mt-6 px-4 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition'
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
