'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Pencil, Loader2, Crosshair } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  obtenerDatosUsuarioLogueado,
  actualizarDatosUsuario,
} from '../../../app/redux/services/editNumber';

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });

type LatLng = { lat: number; lng: number };
type Ubicacion = {
  lat: number;
  lng: number;
  direccion: string;
  departamento: string;
  pais: string;
};

export default function RequesterEditForm() {
  const router = useRouter();
  const [telefono, setTelefono] = useState('');
  const [ubicacion, setUbicacion] = useState<Ubicacion>({
    lat: 0,
    lng: 0,
    direccion: '',
    departamento: '',
    pais: '',
  });
  const [latLng, setLatLng] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);
  const [showTelefono, setShowTelefono] = useState(false);
  const [isEditingTelefono, setIsEditingTelefono] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const userData = await obtenerDatosUsuarioLogueado();
        setTelefono(userData.telefono || '');
        setUbicacion(
          userData.ubicacion || {
            lat: 0,
            lng: 0,
            direccion: '',
            departamento: '',
            pais: '',
          },
        );

        if (userData.ubicacion?.lat && userData.ubicacion?.lng) {
          setLatLng({
            lat: userData.ubicacion.lat,
            lng: userData.ubicacion.lng,
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Error al cargar tus datos.');
      }
    }
    cargarDatos();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
      });
    }
  }, []);

  function validarTelefono(valor: string): boolean {
    if (valor.length < 8 || valor.length > 15) return false;
    if (valor.startsWith('+')) return /^[+][0-9]{7,14}$/.test(valor);
    return /^[0-9]{8,15}$/.test(valor);
  }

  function handleTelefonoChange(e: React.ChangeEvent<HTMLInputElement>) {
    let valor = e.target.value;
    if (valor.startsWith('+')) valor = '+' + valor.slice(1).replace(/[^0-9]/g, '');
    else valor = valor.replace(/[^0-9]/g, '');
    setTelefono(valor);
    setErrorTelefono(null);
    setError(null);
  }

  async function fetchAddress(lat: number, lng: number): Promise<void> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      const { country, state, road, suburb, city, town } = data.address || {};

      setUbicacion({
        lat,
        lng,
        direccion: [road, suburb, city || town].filter(Boolean).join(', ') || '',
        departamento: state || '',
        pais: country || '',
      });
    } catch {
      setUbicacion((prev) => ({
        ...prev,
        lat,
        lng,
        direccion: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      }));
    }
  }

  function handleGetLocation(): void {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLatLng(coords);
        fetchAddress(coords.lat, coords.lng);
      },
      () => setError('No se pudo obtener tu ubicación'),
      { enableHighAccuracy: true },
    );
  }

  const LocationMarker = dynamic(
    async () => {
      const { useMap, useMapEvents, Marker } = await import('react-leaflet');
      const { useEffect } = await import('react');

      interface Props {
        latLng: LatLng | null;
        onChange: (coords: LatLng) => void;
      }

      const Component = ({ latLng, onChange }: Props) => {
        const map = useMap();

        useMapEvents({
          click(e) {
            const newCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
            onChange(newCoords);
            map.flyTo(e.latlng, map.getZoom(), { animate: true });
          },
        });

        useEffect(() => {
          if (latLng) {
            map.flyTo([latLng.lat, latLng.lng], map.getZoom(), { animate: true });
          }
        }, [latLng, map]);

        return latLng ? <Marker position={[latLng.lat, latLng.lng]} /> : null;
      };

      return Component;
    },
    { ssr: false },
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (!validarTelefono(telefono)) {
      setError('Ingrese un número de teléfono válido');
      return;
    }

    setLoading(true);
    try {
      const result = await actualizarDatosUsuario({ telefono, ubicacion });

      if (!result.success) {
        if (result.code === 'PHONE_TAKEN') {
          setErrorTelefono('Este número ya está registrado');
          setError(null);
          setLoading(false);
          return;
        }
        throw new Error(result.message);
      }

      alert('Perfil actualizado correctamente');
      setIsEditingTelefono(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold text-[#1A223F] mb-5 text-left'>Editar perfil</h1>

      <form
        onSubmit={handleSubmit}
        className='space-y-6 bg-white rounded-2xl p-8'
        aria-busy={loading}
      >
        <div>
          <label className='block text-sm font-semibold mb-1 text-[#1A223F] text-left'>
            Número de teléfono:
          </label>
          <div className='flex items-center gap-2'>
            <input
              type={showTelefono ? 'text' : 'password'}
              value={telefono}
              disabled={!isEditingTelefono}
              onChange={handleTelefonoChange}
              placeholder='+591 7xxxxxxx'
              autoComplete='tel'
              className={`flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 transition text-black ${
                isEditingTelefono
                  ? 'bg-white border-[#759AE0] focus:ring-[#1AA7ED]'
                  : 'bg-[#F5FAFE] border-[#E5F4FB] cursor-not-allowed'
              }`}
            />
            <button
              type='button'
              onClick={() => setShowTelefono((p) => !p)}
              className='p-2 rounded-md border border-[#E5F4FB] bg-[#F5FAFE] hover:bg-[#E5F4FB] transition'
            >
              {showTelefono ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button
              type='button'
              onClick={() => {
                setIsEditingTelefono((p) => !p);
                setErrorTelefono(null);
              }}
              className={`p-2 rounded-md border transition ${
                isEditingTelefono
                  ? 'border-[#1A223F] bg-[#E5F4FB]'
                  : 'border-[#E5F4FB] bg-[#F5FAFE] hover:bg-[#E5F4FB]'
              }`}
            >
              <Pencil size={18} />
            </button>
          </div>
          {errorTelefono && (
            <p className='text-sm text-red-600 mt-1' role='alert'>
              {errorTelefono}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-semibold mb-1 text-[#1A223F] text-left'>
            Ubicación:
          </label>
          <div className='flex items-center gap-2'>
            <input
              value={ubicacion.direccion || ''}
              disabled
              placeholder='País, ciudad, departamento'
              className='flex-1 rounded-md border px-3 py-2 bg-[#F5FAFE] border-[#E5F4FB] cursor-not-allowed text-black'
            />
            <button
              type='button'
              onClick={handleGetLocation}
              className='p-2 rounded-md border border-[#E5F4FB] bg-[#F5FAFE] hover:bg-[#2BDDE0]/20 transition'
            >
              <Crosshair size={18} color='#2BDDE0' />
            </button>
          </div>
          <span className='text-xs text-[#759AE0]'>
            Haz clic en el botón GPS o en el mapa para seleccionar tu ubicación
          </span>
        </div>

        <div>
          <label className='block text-sm font-semibold mb-1 text-[#1A223F]'>Mapa</label>
          <div className='w-full h-64 border border-[#E5F4FB] rounded-lg overflow-hidden bg-gradient-to-br from-[#F5FAFE] to-[#E5F4FB] relative'>
            <MapContainer
              center={latLng ? [latLng.lat, latLng.lng] : [-16.5, -68.15]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              whenReady={() => setMapReady(true)}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              {mapReady && (
                <LocationMarker
                  latLng={latLng}
                  onChange={(coords: LatLng) => {
                    setLatLng(coords);
                    fetchAddress(coords.lat, coords.lng);
                  }}
                />
              )}
            </MapContainer>
            {!mapReady && (
              <span className='absolute inset-0 flex items-center justify-center text-gray-600'>
                Cargando mapa...
              </span>
            )}
          </div>
        </div>

        {error && (
          <p className='text-sm text-red-600' role='alert'>
            {error}
          </p>
        )}

        <div className='pt-4 flex justify-end gap-3'>
          <button
            type='submit'
            disabled={loading}
            className='flex items-center gap-2 rounded-md bg-[#1A223F] px-4 py-2 text-white font-semibold hover:bg-[#2B31E0] disabled:bg-[#759AE0]'
          >
            {loading ? (
              <>
                <Loader2 size={14} className='animate-spin' /> Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
          <button
            type='button'
            onClick={() => router.back()}
            className='rounded-md bg-[#E5F4FB] px-4 py-2 text-[#1A223F] font-semibold hover:bg-[#2BDDE0]/20'
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
