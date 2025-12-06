'use client';
import { useState, useEffect, useCallback } from 'react';
import { Laptop, Smartphone, Monitor } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UAParser } from 'ua-parser-js';
import { toast } from 'sonner';
import { useAuth } from '@/app/lib/hooks/usoAutentificacion';

interface Dispositivo {
  _id: string;
  userId: string;
  os: string;
  type: string;
  userAgent: string;
  lastLogin: string;
}

export default function DispositivosVinculados() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [cargandoDispositivos, setCargandoDispositivos] = useState(true);
  const [modalVisible, setModalVisible] = useState<string | null>(null);
  const [modalCerrarTodas, setModalCerrarTodas] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const detectarDispositivo = () => {
    const parser = new UAParser();
    const result = parser.getResult();
    const os = result.os.name || 'Desconocido';
    let type = 'desktop';
    if (result.device.type === 'mobile') type = 'mobile';
    if (result.device.type === 'tablet') type = 'tablet';
    return { os, type };
  };

  const obtenerDispositivos = useCallback(async () => {
    if (!user) return;
    try {
      setCargandoDispositivos(true);
      const res = await fetch(`${API_URL}/api/editProfile/${user.id}`);
      if (!res.ok) throw new Error('Error en la respuesta del backend');
      const data = await res.json();
      setDispositivos(data);
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar los dispositivos.');
    } finally {
      setCargandoDispositivos(false);
    }
  }, [user, API_URL]);

  const registrarDispositivo = useCallback(async () => {
    if (!user) return;
    const { os, type } = detectarDispositivo();
    console.log('Registrando dispositivo:', {
      userId: user.id,
      userAgent: navigator.userAgent,
    });
    try {
      const res = await fetch(`${API_URL}/api/editProfile/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          os,
          type,
          userAgent: navigator.userAgent,
        }),
      });
      const data = await res.json();
      console.log('Respuesta del backend:', data);

      if (!res.ok) return toast.error(data.message || 'Error al registrar dispositivo');
      obtenerDispositivos();
    } catch (err) {
      console.error(err);
      toast.error('Error al registrar dispositivo');
    }
  }, [user, API_URL, obtenerDispositivos]);

  const cerrarSesionDispositivo = async (_id: string) => {
    try {
      await fetch(`${API_URL}/api/editProfile/${_id}`, { method: 'DELETE' });
      toast.success('Sesión cerrada correctamente ✓');
      setModalVisible(null);

      const dispositivoActual = dispositivos.find((d) => d.userAgent === navigator.userAgent);
      if (dispositivoActual?._id === _id) {
        logout?.();
        router.push('/login');
      } else {
        obtenerDispositivos();
      }
    } catch (err) {
      console.error(err);
      toast.error('No se pudo cerrar la sesión.');
    }
  };

  const cerrarTodasSesiones = async () => {
    try {
      const userAgent = navigator.userAgent;
      const dispositivoActual = dispositivos.find((d) => d.userAgent === navigator.userAgent);
      if (!dispositivoActual) return toast.error('No se pudo identificar el dispositivo actual');

      await fetch(`${API_URL}/api/editProfile/all/${user?.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ except: dispositivoActual._id }),
      });

      toast.success('Todas las sesiones cerradas excepto esta ✓');
      setModalCerrarTodas(false);
      obtenerDispositivos();
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cerrar las sesiones.');
    }
  };

  useEffect(() => {
    if (user) {
      registrarDispositivo();
      obtenerDispositivos();
    }
  }, [user, registrarDispositivo, obtenerDispositivos]);

  if (loading) return <p className='text-center mt-10'>Cargando usuario...</p>;
  if (!user) return <p className='text-center mt-10'>No hay usuario autenticado</p>;

  const iconoPorTipo = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone size={28} />;
      case 'tablet':
        return <Monitor size={28} />;
      default:
        return <Laptop size={28} />;
    }
  };

  //if (cargandoDispositivos) return <p className='text-center text-gray-500'>Cargando dispositivos...</p>;
  //if (!dispositivos.length) return <p className='text-center text-gray-500'>No hay dispositivos vinculados</p>;

  return (
    <div className='space-y-4 w-full'>
      {/* BOTÓN ARRIBA, CENTRADO */}
      <div className='flex justify-center mb-4'>
        <button
          onClick={() => setModalCerrarTodas(true)}
          className='px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition'
        >
          Cerrar sesión en todos los dispositivos
        </button>
      </div>

      {dispositivos.map((dispositivo) => (
        <div
          key={dispositivo._id}
          className='flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow'
        >
          <div className='flex items-center space-x-3'>
            {iconoPorTipo(dispositivo.type)}
            <div>
              <p className='font-medium'>{dispositivo.os}</p>
              <p className='text-xs text-gray-500'>
                Último acceso: {new Date(dispositivo.lastLogin).toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalVisible(dispositivo._id)}
            className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
          >
            Cerrar sesión
          </button>

          {modalVisible === dispositivo._id && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[9999]'>
              <div className='bg-white p-6 rounded-lg shadow-lg w-80 text-center'>
                <p className='mb-4'>¿Deseas cerrar sesión en este dispositivo?</p>
                <div className='flex justify-around'>
                  <button
                    onClick={() => setModalVisible(null)}
                    className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => cerrarSesionDispositivo(dispositivo._id)}
                    className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {modalCerrarTodas && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[9999]'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-80 text-center'>
            <p className='mb-4 font-semibold'>
              ¿Seguro que quieres cerrar todas las sesiones excepto esta?
            </p>
            <div className='flex justify-around'>
              <button
                onClick={() => setModalCerrarTodas(false)}
                className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
              >
                Cancelar
              </button>
              <button
                onClick={cerrarTodasSesiones}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
              >
                Sí, cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
