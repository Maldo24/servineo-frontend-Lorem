'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, QrCode, Building2, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import TransferBank from './TransferBank';
import CardListFixer from './CardListFixer';
import ReCAPTCHA from 'react-google-recaptcha'; // ✅ Nombre correcto
import { AnimatePresence, motion } from 'framer-motion'; // ✨ Para animación

// ⚠️ Asegúrate de que esta clave esté definida en tu archivo .env.local
const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'TU_CLAVE_PUBLICA_RECAPTCHA_AQUI';

// Stripe público
const stripePromise = loadStripe(
  'pk_test_51SHGq0Fp8K0s2pYx4l5z1fkIcXSouAknc9gUV6PpYKR8TjexmaC3OiJR9jNIa09e280Pa6jGVRA6ZNY7kSCCGcLt002CEmfDnU',
);

// Nuevo tipo para manejar el estado del modal de seguridad
type SecurityModalTarget = 'card' | 'qr' | null;

export default function FixerWalletRecharge({ userid }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [receivedFixerId, setReceivedFixerId] = useState<string | null>(null);
  const [amount, setAmount] = useState('0.00');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [screen, setScreen] = useState<'main' | 'transfer'>('main');

  // 🔐 Nuevos estados para la seguridad
  const [securityModalTarget, setSecurityModalTarget] = useState<SecurityModalTarget>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // Servineo receptor (para QR y tarjeta)
  const servineoId = '68f7c764495b9ef8a357c40b';

  useEffect(() => {
    const fixerId = searchParams.get('fixerId');
    if (fixerId) {
      setReceivedFixerId(fixerId);
      console.log('Fixer ID recibido para recarga:', fixerId);
    }
  }, [searchParams]);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toFixed(2));
  };

  const handleCloseCardPayment = (paymentCompleted?: boolean) => {
    if (paymentCompleted) {
      alert('✅ Recarga realizada con éxito.');
      router.back();
    }
    setShowCardPayment(false);
    setSecurityModalTarget(null); // Limpiar el estado del modal
    setRecaptchaToken(null); // Limpiar el token de seguridad
  };

  const isValidAmount = () => {
    const num = Number(amount);
    return !isNaN(num) && num > 0;
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (amount === '0.00') setAmount('');
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (amount === '' || amount === '.') setAmount('0.00');
  };

  //inicio de la mejora
  const [amountError, setAmountError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Permitir solo números y hasta 2 decimales
    if (!/^\d*\.?\d{0,2}$/.test(value)) return;

    // Extraer parte entera antes del punto
    const integerPart = value.split('.')[0];

    // Validar máximo 4 dígitos
    if (integerPart.length > 4) {
      setAmountError('El monto máximo permitido es de 4 dígitos.');
      return;
    }

    // Si está OK
    setAmountError('');
    setAmount(value);
  };

  //fin de la mejora

  // 🔐 Manejador que se activa cuando el usuario completa el reCAPTCHA
  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);

    // Si el token es válido y el objetivo es Tarjeta, abrir el modal de tarjeta
    if (token && securityModalTarget === 'card') {
      setSelectedMethod('card');
      setShowCardPayment(true);
      setSecurityModalTarget(null); // Cerrar modal de seguridad
    }
    // Si el token es válido y el objetivo es QR, redirigir inmediatamente
    else if (token && securityModalTarget === 'qr') {
      handleGoToQR(token);
      setSecurityModalTarget(null); // Cerrar modal de seguridad
    }
  };

  // 🆕 Función para iniciar el flujo de Tarjeta (Abre modal de seguridad)
  const startCardFlow = () => {
    if (!isValidAmount()) {
      alert('Por favor ingresa un monto válido mayor a cero.');
      return;
    }
    setSelectedMethod('card');
    setRecaptchaToken(null);
    setSecurityModalTarget('card'); // Abrir el modal de seguridad con objetivo 'card'
  };

  // 🆕 Función para iniciar el flujo de QR (Abre modal de seguridad)
  const startQrFlow = () => {
    if (!isValidAmount()) {
      alert('Por favor ingresa un monto válido mayor a cero.');
      return;
    }
    setSelectedMethod('qr');
    setRecaptchaToken(null);
    setSecurityModalTarget('qr'); // Abrir el modal de seguridad con objetivo 'qr'
  };

  // ⊞ Lógica de Redirección a Pago QR (Ahora recibe el token y redirige)
  const handleGoToQR = (token: string) => {
    const bookingId = 'recarga';
    router.push(
      `/payment/qrwallet?fixerId=${receivedFixerId}&amount=${Number(
        amount,
      )}&currency=BOB&type=wallet&providerId=${servineoId}&bookingId=${bookingId}&recaptchaToken=${token}`, // 🔑 CRÍTICO: Añadir el token a la URL
    );
  };

  // Pantalla principal
  if (screen === 'main') {
    return (
      <div className='min-h-screen bg-gray-100'>
        {/* Header */}
        <div className='bg-blue-600 text-white px-6 py-4 flex items-center gap-4'>
          <button onClick={() => router.back()}>
            <ArrowLeft size={24} />
          </button>
          <h1 className='text-2xl font-bold'>Recargar Saldo</h1>
        </div>
        <div className='p-6 space-y-6'>
          {/* Monto */}
          <div>
            <label className='block text-gray-900 font-semibold text-lg mb-2'>
              Monto a recargar (Bs.)
            </label>
            <input
              type='text'
              value={amount}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              className='w-full px-4 py-4 border-2 text-black border-gray-300 rounded-lg text-2xl font-semibold focus:border-blue-500 focus:outline-none'
              placeholder='0.00'
            />
            {/* inicio de cambios*/}
            {amountError && <p className='text-red-500 text-sm mt-1'>{amountError}</p>}
            {/* fin de cambios */}
          </div>

          {/* Montos rápidos */}
          <div className='grid grid-cols-4 gap-3'>
            {[20, 50, 100, 200].map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className='bg-blue-100 hover:bg-blue-200 text-blue-600 py-3 rounded-lg font-bold text-xl transition-colors'
              >
                {value}
              </button>
            ))}
          </div>

          {/* Métodos de Pago */}
          <div>
            <label className='block text-gray-900 font-semibold text-lg mb-3'>Método de Pago</label>
            <div className='space-y-3'>
              {/* 💳 Tarjeta */}
              <button
                onClick={startCardFlow} // 🆕 Llamar al flujo de seguridad
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'card'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <CreditCard size={28} className='text-gray-700' />
                <span className='text-lg font-semibold text-gray-900'>Tarjeta de Crédito</span>
              </button>

              {/* ⊞ QR */}
              <button
                onClick={startQrFlow} // 🆕 Llamar al flujo de seguridad
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'qr'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <QrCode size={28} className='text-gray-700' />
                <span className='text-lg font-semibold text-gray-900'>Pago QR</span>
              </button>

              {/* 🏦 Transferencia */}
              <button
                onClick={() => {
                  if (!isValidAmount()) {
                    alert('Por favor ingresa un monto válido mayor a cero.');
                    return;
                  }
                  setSelectedMethod('transfer');
                  setScreen('transfer');
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'transfer'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <Building2 size={28} className='text-gray-700' />
                <span className='text-lg font-semibold text-gray-900'>Transferencia Bancaria</span>
              </button>
            </div>
          </div>

          {/* Botón Volver */}
          <button
            onClick={() => router.back()}
            className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-xl font-bold text-lg transition-colors'
          >
            Volver
          </button>
        </div>
        {/* 🔐 MODAL DE SEGURIDAD (reCAPTCHA) */}
        <AnimatePresence>
          {securityModalTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-[1100] bg-black/70 flex items-center justify-center p-4'
              onClick={() => setSecurityModalTarget(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className='bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative flex flex-col items-center'
              >
                <h3 className='text-xl font-bold mb-4 text-gray-900 text-center'>
                  Verificación de Seguridad
                </h3>
                <p className='text-sm text-gray-600 mb-6 text-center'>
                  Por favor, confirma que no eres un robot para continuar con el pago.
                </p>

                {/* Componente reCAPTCHA */}
                <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />

                {/* Botón de Cierre */}
                <button
                  onClick={() => setSecurityModalTarget(null)}
                  className='mt-6 text-blue-600 hover:text-blue-800 text-sm font-semibold'
                >
                  Cancelar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
                {/* 💳 Modal Tarjeta (se abre después del reCAPTCHA si el target es 'card') */}     
         {' '}
        {showCardPayment && (
          <div
            className='fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4'
            onClick={() => handleCloseCardPayment(false)}
          >
                       {' '}
            <div
              onClick={(e) => e.stopPropagation()}
              className='bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto relative'
            >
                           {' '}
              <button
                onClick={() => handleCloseCardPayment(false)}
                className='absolute top-3 right-3 text-gray-600 hover:text-red-500 text-3xl font-bold transition-colors'
              >
                                ✕              {' '}
              </button>
                           {' '}
              <Elements stripe={stripePromise}>
                               {' '}
                <div className='flex flex-col items-center justify-center gap-6'>
                                   {' '}
                  <h2 className='text-2xl font-bold text-center text-gray-900'>
                                        Selecciona tu tarjeta o agrega una nueva                
                     {' '}
                  </h2>
                                   {' '}
                  <CardListFixer
                    fixerId={userid}
                    amount={amount}
                    recaptchaToken={recaptchaToken} // 🔑 CRÍTICO: Pasa el token a CardListFixer
                    onRechargeSuccess={() => handleCloseCardPayment(true)}
                  />
                                 {' '}
                </div>
                             {' '}
              </Elements>
                         {' '}
            </div>
                     {' '}
          </div>
        )}
             {' '}
      </div>
    );
  } // 🏦 Pantalla de transferencia bancaria

  if (screen === 'transfer') {
    return (
      <TransferBank
        fixerId={receivedFixerId!}
        amount={Number(amount)}
        servineoId={servineoId}
        onBack={() => setScreen('main')}
      />
    );
  }

  return null;
}
