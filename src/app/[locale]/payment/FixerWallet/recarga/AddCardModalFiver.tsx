'use client';
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation'; // <-- importar router

interface OnCardAddedPayloadFixer {
  cardSaved: boolean;
  cardId?: string;
}

interface AddCardModalFixerProps {
  userId: string;
  amount: number;
  onClose: () => void;
  onCardAdded: (payload: OnCardAddedPayloadFixer) => void;
}

export default function AddCardModalFixer({
  userId,
  amount,
  onClose,
  onCardAdded,
}: AddCardModalFixerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter(); // <-- inicializar router
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isValidHolder, setIsValidHolder] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, '');
    setCardHolder(cleanValue);
    setIsValidHolder(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{3,50}$/.test(cleanValue.trim()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return setErrorMessage('Stripe aún no está listo.');
    if (!isValidHolder) return setErrorMessage('Nombre de titular inválido.');

    setLoading(true);
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      return setErrorMessage('No se pudo obtener la tarjeta.');
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { name: cardHolder },
      });
      if (error) throw new Error(error.message);

      let cardId: string | null = null;
      if (saveCard) {
        const cardRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cardscreate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            paymentMethodId: paymentMethod.id,
            saveCard,
            cardholderName: cardHolder,
          }),
        });
        const cardData = await cardRes.json();
        if (!cardRes.ok) throw new Error(cardData.error || 'Error al guardar la tarjeta');
        cardId = cardData._id;
      }

      // Actualizar recarga en wallet
      const walletRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallet/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount,
        }),
      });
      const walletData = await walletRes.json();
      if (!walletRes.ok) throw new Error(walletData.error || 'Error al actualizar wallet');

      onCardAdded({
        cardSaved: saveCard,
        cardId: cardId || undefined,
      });

      cardElement.clear();
      setCardHolder('');
      setSuccessMessage(saveCard ? 'Tarjeta guardada y recarga completada' : 'Recarga completada');

      setTimeout(() => {
        setSuccessMessage('');
        onClose();
        router.push(`/payment/FixerWallet?fixerId=${userId}`); // <-- backticks para interpolación
      }, 2000);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50'>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className='bg-[#2B6AE0] text-black p-6 rounded-2xl shadow-2xl w-96 relative'
      >
        <h2 className='text-xl font-bold mb-3 text-center'>Agregar nueva tarjeta</h2>
        <p className='text-center mb-4 text-black'>
          Monto a recargar: <strong className='text-[#2BDDE0]'>{amount} BOB</strong>
        </p>

        {errorMessage && (
          <div className='bg-red-500/20 border border-red-500 text-red-300 p-2 mb-4 rounded-md text-sm text-center'>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-2 text-sm font-semibold text-black'>
              Nombre de titular*
            </label>
            <input
              type='text'
              value={cardHolder}
              onChange={handleCardHolderChange}
              placeholder='Ej: Juan Pérez'
              className='w-full bg-[#E5E7EB] border-gray-200 rounded-xl px-3 py-2 text-black outline-none'
              required
            />
          </div>

          <div className='p-3 rounded-xl bg-[#E5E7EB] border text-black border-gray-700'>
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: { fontSize: '16px', color: '#000', '::placeholder': { color: '#888' } },
                  invalid: { color: '#ff6b6b' },
                },
              }}
            />
          </div>

          <label className='flex items-center gap-2 text-sm text-black mt-2'>
            <input
              type='checkbox'
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className='accent-blue-500'
            />
            Guardar tarjeta para futuros pagos
          </label>

          <div className='flex justify-between mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-[#D1D5DB] hover:bg-[#2BDDE0] rounded-xl transition-all'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={!stripe || loading || !isValidHolder}
              className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                !stripe || loading || !isValidHolder
                  ? 'bg-[#D1D5DB] cursor-not-allowed'
                  : 'bg-[#D1D5DB] hover:bg-[#2BDDE0]'
              }`}
            >
              {loading ? 'Procesando...' : 'Recargar'}
            </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='absolute top-10 bg-[#2BDDE0] text-white px-6 py-3 rounded-xl shadow-xl text-center'
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
