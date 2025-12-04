'use client';
import { useState } from 'react';

export default function RateJobModal({ isOpen, onClose }) {
  // -----------------------------
  // 🔹 Estados para estrellas y comentario
  // -----------------------------
  const [selectedStars, setSelectedStars] = useState(0);
  const [comment, setComment] = useState('');

  // -----------------------------
  // 🔹 1. Función que limpia los datos del formulario
  // -----------------------------
  const resetForm = () => {
    setSelectedStars(0); // Reinicia estrellas
    setComment(''); // Limpia el comentario
  };

  // -----------------------------
  // 🔹 2. Función para cerrar y limpiar
  // -----------------------------
  const handleClose = () => {
    if (selectedStars > 0 || comment.trim() !== '') {
      const confirmClose = window.confirm(
        'No has enviado tu review. ¿Seguro que quieres cerrar? Los datos se perderán.',
      );
      if (!confirmClose) return;
    }

    resetForm();
    onClose();
  };

  // -----------------------------
  // 🔹 3. Función de envío (Submit)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length < 10) return;

    console.log('💬 Review enviada:', {
      estrellas: selectedStars,
      comentario: comment,
    });

    resetForm(); // Limpia datos después de enviar
    onClose(); // Cierra el modal
  };

  // -----------------------------
  // 🔹 4. Si el modal no está abierto, no renderizar
  // -----------------------------
  if (!isOpen) return null;

  // -----------------------------
  // 🔹 5. Estructura visual del modal
  // -----------------------------
  return (
    <div className='fixed inset-0 bg-black/40 flex justify-center items-center z-50'>
      <div className='bg-white rounded-2xl shadow-lg p-6 w-96'>
        <h2 className='text-xl font-bold text-[#2B31E0] mb-4'>Rate Job</h2>

        {/* ⭐ Sección de estrellas */}
        <div className='flex justify-center mb-4'>
          {[1, 2, 3].map((num) => (
            <span
              key={num}
              onClick={() => setSelectedStars(num)}
              className={`cursor-pointer text-4xl mx-1 ${
                num <= selectedStars ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Etiquetas */}
        <div className='flex justify-between text-sm text-gray-500 mb-4'>
          <span>Terrible</span>
          <span>Excelente</span>
        </div>

        {/* 📝 Campo de comentario */}
        <textarea
          className='w-full border rounded-md p-2 mb-3 text-gray-700'
          placeholder='Escribe tu comentario (mínimo 10 caracteres)'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        {/* 🔘 Botones */}
        <div className='flex justify-end space-x-2'>
          {/* Botón Cancelar */}
          <button
            onClick={handleClose}
            className='px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700'
          >
            Cancelar
          </button>

          {/* Botón Enviar */}
          <button
            onClick={handleSubmit}
            disabled={comment.length < 10}
            className={`px-4 py-2 rounded-md text-white font-medium transition ${
              comment.length < 10
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#2B31E0] hover:bg-[#2B6AE0]'
            }`}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
