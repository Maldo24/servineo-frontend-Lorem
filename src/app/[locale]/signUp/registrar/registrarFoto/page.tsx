'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getUserIdFromToken } from '../Registrardecoder/getID';
import NotificationModal from '@/Components/Modal-notifications';

export default function FotoPerfil() {
  const router = useRouter();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info' as 'success' | 'error' | 'info' | 'warning',
    title: '',
    message: '',
  });

  const handleNotify = (notif: {
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
  }) => setNotification({ isOpen: true, ...notif });

  const handleCloseNotification = () => setNotification((prev) => ({ ...prev, isOpen: false }));

  const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/signUp`;

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const eliminarFoto = () => {
    setArchivo(null);
    setFotoPreview(null);
  };

  const continuar = async () => {
    if (!archivo) {
      return handleNotify({
        type: 'error',
        title: 'Foto no seleccionada',
        message: 'Primero selecciona una foto',
      });
    }

    const usuarioId = getUserIdFromToken();
    if (!usuarioId) {
      return handleNotify({
        type: 'error',
        title: 'Usuario no encontrado',
        message: 'No se encontró el ID del usuario',
      });
    }

    try {
      setCargando(true);

      const formData = new FormData();
      formData.append('foto', archivo);
      formData.append('usuarioId', usuarioId);

      const response = await fetch(`${BASE_URL}/registrar/foto`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        handleNotify({
          type: 'success',
          title: '¡Éxito!',
          message: 'Foto actualizada correctamente',
        });
        setTimeout(() => router.push('/signUp/registrar/registrarUbicacion'), 1000);
      } else {
        handleNotify({
          type: 'error',
          title: 'Error',
          message: data.message || 'Error al subir la foto',
        });
      }
    } catch (error) {
      console.error('Error al subir la foto:', error);
      handleNotify({
        type: 'error',
        title: 'Error de conexión',
        message: 'No se pudo conectar con el servidor',
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={handleCloseNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        autoClose
        autoCloseDelay={3000}
      />

      <section className='flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-blue-50 animate-fadeInUp relative'>
        <div className='w-full max-w-sm bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-xl p-10 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] relative z-10'>
          <h1 className='text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary/80 to-primary/60 bg-clip-text text-transparent'>
            Foto de perfil
          </h1>
          <p className='text-center text-gray-600 mb-8 text-sm'>Sube una foto para tu perfil</p>

          {/* Imagen */}
          <div className='flex flex-col items-center gap-4'>
            <div className='w-32 h-32 rounded-full overflow-hidden bg-muted border border-blue-100 shadow-lg'>
              {fotoPreview ? (
                <Image
                  src={fotoPreview}
                  alt='Foto de perfil'
                  width={128}
                  height={128}
                  className='w-full h-full object-cover rounded-full'
                />
              ) : (
                <svg
                  className='w-full h-full text-gray-300'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                    1.79-4 4 1.79 4 4 4zm0 2c-2.67 
                    0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
                  />
                </svg>
              )}
            </div>

            <input
              id='input-foto'
              type='file'
              accept='image/*'
              className='hidden'
              onChange={manejarCambio}
            />

            <div className='flex gap-2 mt-3'>
              <label
                htmlFor='input-foto'
                className='px-4 py-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:opacity-90 transition'
              >
                {fotoPreview ? 'Cambiar foto' : 'Subir foto'}
              </label>

              {fotoPreview && (
                <button
                  onClick={eliminarFoto}
                  className='p-2 bg-red-500 text-white rounded-full hover:opacity-90 transition'
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Botón continuar */}
          <div className='flex justify-center gap-4 mt-10'>
            <button
              onClick={continuar}
              disabled={!archivo || cargando}
              className={`px-5 py-2 rounded-full transition ${
                archivo
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {cargando ? 'Subiendo...' : 'Continuar'}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
