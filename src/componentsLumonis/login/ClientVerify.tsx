'use client';

import { useEffect, useState } from 'react';

const BASE_API =
  `${process.env.NEXT_PUBLIC_API_URL}/api/controlC`;

export default function ClientVerify({ token }: { token?: string }) {
  const [msg, setMsg] = useState('Verificando enlace de acceso...');

  useEffect(() => {
    if (!token) {
      setMsg('Token no proporcionado.');
      return;
    }

    let cancelled = false;

    const verifyLink = async () => {
      try {
        const res = await fetch(
          `${BASE_API}/auth/magic-login?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data.success && data.token) {
          localStorage.setItem('servineo_token', data.token);
          localStorage.setItem('servineo_user', JSON.stringify(data.user));
          window.location.replace('/'); // hidratar UI logueado
        } else if (res.status === 410) {
          setMsg('El enlace ha expirado. Serás redirigido a la pantalla de recuperación.');
          setTimeout(() => window.location.replace('/login/forgotpass'), 2500);
        } else if (res.status === 400) {
          setMsg('El enlace ya fue utilizado.');
          setTimeout(() => window.location.replace('/login/forgotpass'), 2500);
        } else {
          setMsg(data.message || 'Error verificando enlace. Intenta nuevamente.');
          setTimeout(() => window.location.replace('/login/forgotpass'), 2500);
        }
      } catch (err) {
        console.error('Error al verificar enlace:', err);
        setMsg('Error de conexión con el servidor.');
        setTimeout(() => window.location.replace('/login/forgotpass'), 2500);
      }
    };

    verifyLink();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <p role="status" aria-live="polite" className="text-gray-700">
      {msg}
    </p>
  );
}