'use client';

import { useState } from 'react';
import * as registroService from '@/app/redux/services/auth/registro';
import { useParams, usePathname } from 'next/navigation';

//Configuración de países
const PAISES_LATAM = [
  {
    codigo: '+591',
    pais: 'Bolivia',
    bandera: '🇧🇴',
    longitudMin: 8,
    longitudMax: 8,
    ejemplo: '71234567',
  },
  {
    codigo: '+54',
    pais: 'Argentina',
    bandera: '🇦🇷',
    longitudMin: 10,
    longitudMax: 10,
    ejemplo: '1123456789',
  },
  {
    codigo: '+56',
    pais: 'Chile',
    bandera: '🇨🇱',
    longitudMin: 9,
    longitudMax: 9,
    ejemplo: '912345678',
  },
  {
    codigo: '+57',
    pais: 'Colombia',
    bandera: '🇨🇴',
    longitudMin: 10,
    longitudMax: 10,
    ejemplo: '3001234567',
  },
  {
    codigo: '+593',
    pais: 'Ecuador',
    bandera: '🇪🇨',
    longitudMin: 9,
    longitudMax: 9,
    ejemplo: '991234567',
  },
  {
    codigo: '+51',
    pais: 'Perú',
    bandera: '🇵🇪',
    longitudMin: 9,
    longitudMax: 9,
    ejemplo: '987654321',
  },
  {
    codigo: '+52',
    pais: 'México',
    bandera: '🇲🇽',
    longitudMin: 10,
    longitudMax: 10,
    ejemplo: '5512345678',
  },
  {
    codigo: '+58',
    pais: 'Venezuela',
    bandera: '🇻🇪',
    longitudMin: 10,
    longitudMax: 10,
    ejemplo: '4121234567',
  },
  {
    codigo: '+595',
    pais: 'Paraguay',
    bandera: '🇵🇾',
    longitudMin: 9,
    longitudMax: 9,
    ejemplo: '981234567',
  },
  {
    codigo: '+598',
    pais: 'Uruguay',
    bandera: '🇺🇾',
    longitudMin: 8,
    longitudMax: 9,
    ejemplo: '91234567',
  },
  {
    codigo: '+507',
    pais: 'Panamá',
    bandera: '🇵🇦',
    longitudMin: 8,
    longitudMax: 8,
    ejemplo: '61234567',
  },
  {
    codigo: '+506',
    pais: 'Costa Rica',
    bandera: '🇨🇷',
    longitudMin: 8,
    longitudMax: 8,
    ejemplo: '87654321',
  },
  {
    codigo: '+503',
    pais: 'El Salvador',
    bandera: '🇸🇻',
    longitudMin: 8,
    longitudMax: 8,
    ejemplo: '71234567',
  },
  {
    codigo: '+502',
    pais: 'Guatemala',
    bandera: '🇬🇹',
    longitudMin: 8,
    longitudMax: 8,
    ejemplo: '51234567',
  },
  {
    codigo: '+504',
    pais: 'Honduras',
    bandera: '🇭🇳',
    longitudMin: 8,
    longitudMax: 8,
    ejemplo: '91234567',
  },
  {
    codigo: '+505',
    pais: 'Nicaragua',
    bandera: '🇳🇮',
    longitudMin: 8,
    longitudMax: 8,
    ejemplo: '81234567',
  },
];

export default function RegistroTelefono() {
  const params = useParams();
  const pathname = usePathname();

  // Detectar si viene del flujo o registro manual
  const locale = params.locale || null;
  const esRegistroManual = pathname?.includes('/signUp/registrar');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+591');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Obtener configuración del país seleccionado
  const paisSeleccionado = PAISES_LATAM.find((p) => p.codigo === countryCode);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers;
  };

  const validarTelefono = () => {
    if (!paisSeleccionado) return false;

    const longitud = phoneNumber.length;

    if (longitud < paisSeleccionado.longitudMin) {
      setError(`El número debe tener al menos ${paisSeleccionado.longitudMin} dígitos`);
      return false;
    }

    if (longitud > paisSeleccionado.longitudMax) {
      setError(`El número debe tener máximo ${paisSeleccionado.longitudMax} dígitos`);
      return false;
    }

    setError('');
    return true;
  };

  const manejarEnvio = async () => {
    try {
      // Validar formato antes de enviar
      if (!validarTelefono()) {
        return;
      }

      setCargando(true);
      setError('');

      const token = localStorage.getItem('servineo_token');
      if (!token) {
        setError('No hay sesión activa');
        return;
      }

      // Enviar teléfono
      const telefonoCompleto = `${countryCode}${phoneNumber}`;
      const response = await registroService.enviarTelefono(telefonoCompleto);

      if (response.success) {
        //Redirigir según el flujo
        if (esRegistroManual) {
          window.location.href = '/'; // Registro manual
        } else if (locale) {
          window.location.href = `/${locale}`;
        } else {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error guardando teléfono:', error);

      // Manejar errores específicos
      if (error instanceof Error) {
        if (error.message.includes('409') || error.message.includes('ya está registrado')) {
          setError('El número ya está registrado, use otro');
        } else {
          setError('Error de conexión. Intente nuevamente');
        }
      } else {
        setError('Error desconocido. Intente nuevamente');
      }
    } finally {
      setCargando(false);
    }
  };

  const esTelefonoValido = phoneNumber.length >= (paisSeleccionado?.longitudMin || 8);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          padding: '1.5rem',
          maxWidth: '500px',
          margin: '2rem auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Ícono */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            backgroundColor: '#E3F2FD',
            borderRadius: '50%',
            marginBottom: '1rem',
          }}
        >
          <svg
            width='32'
            height='32'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#2B6AE0'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
          </svg>
        </div>

        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#222',
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}
        >
          Un paso más
        </h2>

        <p
          style={{
            color: '#666',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '0.95rem',
          }}
        >
          Por favor, ingresa tu número de teléfono para completar tu registro
        </p>

        {/* Código de país */}
        <div style={{ width: '100%', marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#333',
              marginBottom: '0.5rem',
            }}
          >
            País de residencia
          </label>
          <select
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              setPhoneNumber('');
              setError('');
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {PAISES_LATAM.map((pais) => (
              <option key={pais.codigo} value={pais.codigo}>
                {pais.bandera} {pais.pais} ({pais.codigo})
              </option>
            ))}
          </select>
        </div>

        {/* Número de teléfono */}
        <div style={{ width: '100%', marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#333',
              marginBottom: '0.5rem',
            }}
          >
            Número de teléfono
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div
              style={{
                width: '80px',
                padding: '0.75rem 1rem',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '0.5rem',
                textAlign: 'center',
                fontWeight: '500',
                color: '#333',
              }}
            >
              {countryCode}
            </div>
            <input
              type='tel'
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(formatPhoneNumber(e.target.value));
                setError('');
              }}
              onBlur={validarTelefono}
              placeholder={paisSeleccionado?.ejemplo || '71234567'}
              maxLength={paisSeleccionado?.longitudMax || 15}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: `1px solid ${error ? '#f44336' : '#ddd'}`,
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#999',
              marginTop: '0.25rem',
            }}
          >
            Ejemplo: {paisSeleccionado?.ejemplo} ({paisSeleccionado?.longitudMin}-
            {paisSeleccionado?.longitudMax} dígitos)
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div
            style={{
              width: '100%',
              backgroundColor: '#FFEBEE',
              border: '1px solid #EF5350',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: '#C62828', margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {/* Vista previa */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#E3F2FD',
            border: '1px solid #BBDEFB',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: '#1976D2', margin: 0 }}>
            <strong>Número completo:</strong> {countryCode} {phoneNumber || '________'}
          </p>
        </div>

        {/* Botón */}
        <button
          onClick={manejarEnvio}
          disabled={cargando || !esTelefonoValido}
          style={{
            width: '100%',
            backgroundColor: cargando || !esTelefonoValido ? '#ccc' : '#2B6AE0',
            color: 'white',
            padding: '0.8rem 1.8rem',
            border: 'none',
            borderRadius: '0.6rem',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: cargando || !esTelefonoValido ? 'not-allowed' : 'pointer',
            transition: '0.2s',
            boxShadow: '0 3px 10px rgba(43,106,224,0.3)',
          }}
          onMouseEnter={(e) => {
            if (!cargando && esTelefonoValido) e.currentTarget.style.backgroundColor = '#1AA7ED';
          }}
          onMouseLeave={(e) => {
            if (!cargando && esTelefonoValido) e.currentTarget.style.backgroundColor = '#2B6AE0';
          }}
        >
          {cargando ? 'Guardando...' : 'Finalizar'}
        </button>
      </div>
    </div>
  );
}
