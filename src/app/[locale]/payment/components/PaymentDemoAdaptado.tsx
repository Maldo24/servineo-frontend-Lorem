'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentMethodUI from './PaymentMethodUI';
import CardList from './CardList';
import { createCashPayment, CreateCashPaymentDTO } from '../service/payment';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import { AnimatePresence, motion } from 'framer-motion';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

const stripePromise = loadStripe(
  'pk_test_51SHGq0Fp8K0s2pYx4l5z1fkIcXSouAknc9gUV6PpYKR8TjexmaC3OiJR9jNIa09e280Pa6jGVRA6ZNY7kSCCGcLt002CEmfDnU',
);

interface PaymentProps {
  amount: number;
  jobId: string;
  requesterId: string;
  fixerId: string;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

type SecurityModalTarget = 'card' | 'qr' | null;

interface PaymentResponse {
  message?: string;
  data?: {
    id?: string;
    _id?: string;
  };
  payment?: {
    id?: string;
    _id?: string;
  };
  id?: string;
  _id?: string;
}

export default function PaymentMethods({
  amount,
  jobId,
  requesterId,
  fixerId,
  onClose,
  onPaymentSuccess,
}: PaymentProps) {
  const [showCashPayment, setShowCashPayment] = useState(false);
  const [createdPaymentId, setCreatedPaymentId] = useState<string | null>(null);
  const [securityModalTarget, setSecurityModalTarget] = useState<SecurityModalTarget>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const router = useRouter();

  const handleGoToQR = (token: string) => {
    router.push(
      `/payment/pago-qr?trabajoId=${jobId}&bookingId=TRABAJO-${jobId}&providerId=DEMO-PROVIDER&amount=${amount}&currency=BOB&recaptchaToken=${token}`,
    );
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);

    if (token && securityModalTarget === 'qr') {
      handleGoToQR(token);
      setSecurityModalTarget(null);
    }
  };

  const startCardFlow = () => {
    setRecaptchaToken(null);
    setSecurityModalTarget('card');
  };

  const startQrFlow = () => {
    setRecaptchaToken(null);
    setSecurityModalTarget('qr');
  };

  const handlePayCash = async () => {
    try {
      const payload: CreateCashPaymentDTO = {
        jobId,
        requesterId,
        fixerId,
        subTotal: amount,
        service_fee: 0,
        discount: 0,
        currency: 'BOB',
        paymentMethods: 'cash',
      };

      const resp = await createCashPayment(payload);
      const created: PaymentResponse = resp?.data || resp?.payment || resp;
      setCreatedPaymentId(created?.id || created?._id || null);
      setShowCashPayment(true);
    } catch (error) {
      const err = error as Error;
      console.error('Error creando pago en efectivo:', err);
      alert(err.message || 'Error al crear pago en efectivo');
    }
  };

  return (
    <>
      {/* Overlay principal */}
      <div
        onClick={onClose}
        className='fixed inset-0 z-[10] bg-black/50 flex items-center justify-center p-4'
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className='bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg p-6 relative flex flex-col items-center justify-center gap-6'
        >
          <button
            onClick={onClose}
            className='absolute top-3 right-3 text-gray-600 hover:text-red-500 text-3xl font-bold transition-colors'
          >
            ✕
          </button>

          <h2 className='text-2xl font-bold text-center'>Seleccione su método de pago</h2>

          <div className='w-full flex flex-col gap-4'>
            <button
              onClick={startCardFlow}
              className='w-full bg-[#1AA7ED] hover:bg-[#2B6AE0] text-[#F9FAFB] px-6 py-3 rounded-lg flex items-center gap-4 text-xl font-medium justify-center transition-colors'
            >
              <span className='text-2xl'>💳</span> Tarjeta de Crédito
            </button>

            <button
              onClick={startQrFlow}
              className='w-full bg-[#1AA7ED] hover:bg-[#2B6AE0] text-[#F9FAFB] px-6 py-3 rounded-lg flex items-center gap-4 text-xl font-medium justify-center transition-colors'
            >
              <span className='text-2xl'>⊞</span> Pago QR
            </button>

            <button
              onClick={handlePayCash}
              className='w-full bg-[#1AA7ED] hover:bg-[#2B6AE0] text-[#F9FAFB] px-6 py-3 rounded-lg flex items-center gap-4 text-xl font-medium justify-center transition-colors'
            >
              <span className='text-2xl'>💵</span> Pago Efectivo
            </button>
          </div>
        </div>
      </div>

      {/* Cash Payment Modal */}
      {showCashPayment && createdPaymentId && (
        <PaymentMethodUI
          paymentId={createdPaymentId}
          onClose={() => setShowCashPayment(false)}
          jobId={jobId}
          requesterId={requesterId}
          fixerId={fixerId}
        />
      )}

      {/* CARD PAYMENT MODAL */}
      {securityModalTarget === 'card' && (
        <div className='fixed inset-0 z-[1100] bg-black/60 flex items-center justify-center p-4'>
          <div
            className='bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto relative'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setSecurityModalTarget(null);
                setRecaptchaToken(null);
              }}
              className='absolute top-3 right-3 text-gray-600 hover:text-red-500 text-3xl font-bold transition-colors'
            >
              ✕
            </button>

            <Elements stripe={stripePromise}>
              <div className='flex flex-col items-center gap-6'>
                <h2 className='text-2xl font-bold text-center'>
                  Selecciona tu tarjeta o agrega una nueva
                </h2>

                <div className='my-4'>
                  <p className='text-sm text-gray-600 mb-2'>Verificación de seguridad requerida:</p>
                  <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                </div>

                <div className='w-full relative'>
                  {!recaptchaToken && (
                    <div className='absolute inset-0 z-10 bg-white/70 flex items-center justify-center rounded-xl'>
                      <p className='text-lg font-bold text-red-600 p-4 text-center'>
                        Por favor, completa la verificación de seguridad 👆
                      </p>
                    </div>
                  )}
                  <CardList
                    requesterId={requesterId}
                    fixerId={fixerId}
                    jobId={jobId}
                    amount={amount}
                    recaptchaToken={recaptchaToken}
                    onPaymentSuccess={() => {
                      setSecurityModalTarget(null);
                      onPaymentSuccess?.();
                    }}
                  />
                </div>
              </div>
            </Elements>
          </div>
        </div>
      )}

      {/* QR SECURITY MODAL */}
      <AnimatePresence>
        {securityModalTarget === 'qr' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[1100] bg-black/60 flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className='bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative text-center'
            >
              <button
                onClick={() => {
                  setSecurityModalTarget(null);
                  setRecaptchaToken(null);
                }}
                className='absolute top-3 right-3 text-gray-600 hover:text-red-500 text-3xl font-bold transition-colors'
              >
                ✕
              </button>
              <h3 className='text-xl font-bold mb-4'>Verificación de Seguridad</h3>
              <p className='text-gray-700 mb-6'>Completa el reCAPTCHA para proceder al Pago QR.</p>

              <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />

              <button
                onClick={() => recaptchaToken && handleGoToQR(recaptchaToken)}
                disabled={!recaptchaToken}
                className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition-colors ${
                  recaptchaToken
                    ? 'bg-[#2B6AE0] hover:bg-[#1AA7ED]'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Proceder al Pago QR
              </button>

              {!recaptchaToken && (
                <p className='mt-4 text-sm text-gray-500'>
                  Asegúrate de completar la verificación.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
