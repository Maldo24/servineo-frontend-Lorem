'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { enviarUbicacion } from '@/app/redux/services/auth/registro';

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

function MoveMapToPosition({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 15);
  }, [position, map]);
  return null;
}

export default function MapaLeaflet() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [ubicacionPermitida, setUbicacionPermitida] = useState<boolean | null>(null);
  const [direccion, setDireccion] = useState<string | null>(null);
  const [departamento, setDepartamento] = useState<string | null>(null);
  const [pais, setPais] = useState<string | null>(null);
  const [cargandoDireccion, setCargandoDireccion] = useState(false);

  const ejecutado = useRef(false);

  useEffect(() => {
    if (ejecutado.current) return;
    ejecutado.current = true;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setUbicacionPermitida(true);
          try {
            setCargandoDireccion(true);
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            );
            const data = await res.json();

            if (data) {
              const dep = data.address?.state || null;
              const country = data.address?.country || null;
              let dir = data.display_name || null;

              if (dir) {
                if (dep) dir = dir.replace(new RegExp(`,?\\s*${dep}`, 'gi'), '');
                if (country) dir = dir.replace(new RegExp(`,?\\s*${country}`, 'gi'), '');
                dir = dir.replace(/,\s*$/, '');
              }

              setDireccion(dir);
              setDepartamento(dep);
              setPais(country);
            }
          } catch (error) {
            console.error('Error obteniendo dirección:', error);
          } finally {
            setCargandoDireccion(false);
          }
        },
        (error) => {
          console.warn('No se pudo obtener la ubicación:', error.message);
          setUbicacionPermitida(false);
          setPosition([0, 0]);
          setDireccion(null);
          setDepartamento(null);
          setPais(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      console.warn('El navegador no soporta geolocalización.');
      setUbicacionPermitida(false);
      setPosition([0, 0]);
      setDireccion(null);
      setDepartamento(null);
      setPais(null);
    }
  }, []);

  const manejarEnvio = async () => {
    try {
      if (cargandoDireccion) {
        return;
      }

      await enviarUbicacion(
        position?.[0] || 0,
        position?.[1] || 0,
        direccion || null,
        departamento || null,
        pais || null,
      );

      window.location.href = '/signUp/registrar/registrarTelefono';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          padding: '1.5rem',
          maxWidth: '700px',
          margin: '2rem auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            width: '100%',
            textAlign: 'left',
            fontSize: '1.4rem',
            fontWeight: '600',
            borderBottom: '1px solid #ccc',
            marginBottom: '1rem',
            paddingBottom: '0.3rem',
            color: '#222',
          }}
        >
          Ubicación
        </h2>

        <div
          style={{
            width: '100%',
            height: '60vh',
            borderRadius: '0.8rem',
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}
        >
          <MapContainer
            center={position || [-17.3895, -66.1568]}
            zoom={position ? 14 : 5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
            {position && ubicacionPermitida && <MoveMapToPosition position={position} />}
            {position && ubicacionPermitida && (
              <>
                <Marker position={position} icon={customIcon}>
                  <Popup>Tu ubicación actual</Popup>
                </Marker>
                <Circle
                  center={position}
                  radius={1000}
                  pathOptions={{
                    color: '#2B6AE0',
                    fillColor: '#cce0ff',
                    fillOpacity: 0.3,
                  }}
                />
              </>
            )}
          </MapContainer>
        </div>

        <button
          style={{
            backgroundColor: '#2B6AE0',
            color: 'white',
            padding: '0.8rem 1.8rem',
            border: 'none',
            borderRadius: '0.6rem',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: '0.2s',
            boxShadow: '0 3px 10px rgba(43,106,224,0.3)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1AA7ED')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2B6AE0')}
          onClick={manejarEnvio}
        >
          {cargandoDireccion ? 'Obteniendo dirección...' : 'Continuar'}
        </button>
      </div>
    </div>
  );
}
