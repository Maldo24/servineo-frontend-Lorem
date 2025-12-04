'use client';

import { useState } from 'react';
import { useAppSelector } from '@/app/redux/hooks';
import { JobOffersSection } from '@/Components/fixer/dashboard/JobOffersSection';
import { CertificationsSection } from '@/Components/fixer/dashboard/CertificationsSection';
import { ExperienceSection } from '@/Components/fixer/dashboard/ExperienceSection';
import { PortfolioSection } from '@/Components/fixer/dashboard/PortfolioSection';
import {
  User,
  Briefcase,
  Award,
  Building2,
  Image as ImageIcon,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Check,
  CreditCard,
  Car,
  IdCard,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import EstadisticasTrabajos from '@/Components/fixer/Fixer-statistics';
import { useUpdateDescriptionMutation } from '@/app/redux/services/userApi';
import { useEffect } from 'react';
import { z } from 'zod';
import { LocationSection } from '@/Components/fixer/dashboard/LocationSection';

// Schema de validación para la descripción
const descriptionSchema = z.object({
  description: z
    .string()
    .max(255, 'La descripción no puede tener más de 255 caracteres')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .optional()
    .or(z.literal('')),
});

type Tab = 'offers' | 'certs' | 'experience' | 'portfolio' | 'location' | 'estadisticas';

export default function FixerDashboardPage() {
  const { user: reduxUser } = useAppSelector((state) => state.user);
  const user = reduxUser;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('offers');

  // Estado para edición de descripción
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState('');
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDescriptionValue(user?.description || '');
      // Si es la primera vez, forzamos que esté en edición
      if (!user?.description) {
        setEditingDescription(true);
      }
    }
  }, [user]);

  const [updateDescription] = useUpdateDescriptionMutation();

  if (!user) {
    return <div className='p-8 text-center'>Cargando perfil...</div>;
  }

  const handleSaveDescription = async () => {
    try {
      if (!user._id) return;

      // Validar con Zod
      const result = descriptionSchema.safeParse({ description: descriptionValue });

      if (!result.success) {
        // Mostrar el primer error de validación
        const firstError = result.error.issues[0];
        setDescriptionError(firstError.message);
        return;
      }

      // Limpiar error si la validación pasa
      setDescriptionError(null);

      await updateDescription({ id: user._id, description: descriptionValue });

      setEditingDescription(false);
    } catch (err) {
      console.error('Error actualizando descripción:', err);
      setDescriptionError('Error al guardar la descripción');
    }
  };

  // Obtener ubicación
  const location = user.ubicacion?.departamento || user.workLocation?.direccion || 'Bolivia';

  return (
    <div className='container mx-auto max-w-6xl p-4 space-y-6'>
      {/* Profile Header */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
        <div className='h-32 bg-gradient-to-r from-blue-600 to-blue-400'></div>
        <div className='px-6 pb-6'>
          <div className='relative flex justify-between items-end -mt-12 mb-4'>
            <div className='relative'>
              <div className='h-24 w-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden'>
                {user.url_photo ? (
                  <Image
                    src={user.url_photo}
                    alt={user.name}
                    fill
                    className='object-cover'
                    priority
                    sizes='96px'
                  />
                ) : (
                  <User className='h-full w-full p-4 text-gray-400' />
                )}
              </div>
              {user.fixerProfile === 'completed' && (
                <div
                  className='absolute bottom-0 right-0 h-6 w-6 bg-green-500 border-2 border-white rounded-full'
                  title='Perfil Completo'
                ></div>
              )}
            </div>
            <div className='flex gap-2'>
              {/* ⭐ NUEVO BOTÓN — AGREGADO EXACTAMENTE AQUÍ ⭐ */}
                <button
                  onClick={() => router.push('/es/view-rate-jobs')}
                  className='px-4 py-2 bg-primary hover:bg-blue-800 text-white rounded-full text-sm font-medium transition-colors'
                >
                  Ver trabajos calificados
                </button>

              {!editingDescription ? (
                <button
                  onClick={() => setEditingDescription(true)}
                  className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors flex items-center gap-1'
                >
                  <Edit2 className='h-4 w-4' />
                  Editar Perfil
                </button>
              ) : (
                <button
                  onClick={handleSaveDescription}
                  className='px-4 py-2 bg-primary hover:bg-blue-800 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-1'
                >
                  <Check className='h-4 w-4' />
                  Guardar
                </button>
              )}
            </div>
          </div>

          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{user.name}</h1>

            {/* Descripción o placeholder */}
            {!editingDescription ? (
              <p className='text-gray-600 font-medium mt-1'>
                {descriptionValue || (
                  <span className='text-gray-400 italic'>
                    Sin descripción. Haz clic en Editar Perfil para agregar una.
                  </span>
                )}
              </p>
            ) : (
              <div>
                <textarea
                  value={descriptionValue}
                  onChange={(e) => {
                    setDescriptionValue(e.target.value);
                    setDescriptionError(null); // Limpiar error al escribir
                  }}
                  placeholder='Describe tu experiencia y servicios...'
                  className={`border ${descriptionError ? 'border-red-500' : 'border-primary'} rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 ${descriptionError ? 'focus:ring-red-400' : 'focus:ring-blue-400'} focus:border-blue-500 w-full mt-2 resize-none`}
                  rows={3}
                  maxLength={255}
                />
                <div className='flex justify-between items-center mt-1'>
                  {descriptionError && <p className='text-red-500 text-xs'>{descriptionError}</p>}
                  <p
                    className={`text-xs ml-auto ${descriptionValue.length > 255 ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    {descriptionValue.length}/255 caracteres
                  </p>
                </div>
              </div>
            )}

            {/* Información de contacto */}
            <div className='mt-4 flex flex-wrap gap-4 text-sm text-gray-600'>
              {user.email && (
                <div className='flex items-center gap-1.5'>
                  <Mail className='h-4 w-4 text-blue-600' />
                  <span>{user.email}</span>
                </div>
              )}
              {user.telefono && (
                <div className='flex items-center gap-1.5'>
                  <Phone className='h-4 w-4 text-blue-600' />
                  <span>{user.telefono}</span>
                </div>
              )}
              <div className='flex items-center gap-1.5'>
                <MapPin className='h-4 w-4 text-blue-600' />
                <span>{location}</span>
              </div>
              {user.ci && (
                <div className='flex items-center gap-1.5'>
                  <IdCard className='h-4 w-4 text-blue-600' />
                  <span>CI: {user.ci}</span>
                </div>
              )}
            </div>

            {/* Servicios */}
            {user.servicios && user.servicios.length > 0 && (
              <div className='mt-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Wrench className='h-4 w-4 text-blue-600' />
                  <span className='text-sm font-semibold text-gray-700'>Servicios:</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {user.servicios.map((servicio, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium'
                    >
                      {servicio}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Métodos de pago y vehículo */}
            <div className='mt-4 flex flex-wrap gap-3'>
              {user.vehiculo?.hasVehiculo && (
                <span className='flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium'>
                  <Car className='h-3.5 w-3.5' />
                  Vehículo propio
                </span>
              )}
              {user.metodoPago?.hasEfectivo && (
                <span className='flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium'>
                  <CreditCard className='h-3.5 w-3.5' />
                  Efectivo
                </span>
              )}
              {user.metodoPago?.qr && (
                <span className='flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium'>
                  <CreditCard className='h-3.5 w-3.5' />
                  QR
                </span>
              )}
              {user.metodoPago?.tarjetaCredito && (
                <span className='flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium'>
                  <CreditCard className='h-3.5 w-3.5' />
                  Tarjeta
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Sidebar Navigation */}
        <div className='lg:col-span-1 space-y-2'>
          <nav className='flex flex-col gap-1'>
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'offers'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Briefcase className='h-5 w-5' />
              Ofertas de Trabajo
            </button>
            <button
              onClick={() => setActiveTab('certs')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'certs'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Award className='h-5 w-5' />
              Certificaciones
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'experience'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building2 className='h-5 w-5' />
              Experiencia
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ImageIcon className='h-5 w-5' />
              Portafolio
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'location'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapPin className='h-5 w-5' />
              Ubicación
            </button>
            <button
              onClick={() => setActiveTab('estadisticas')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'estadisticas'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Award className='h-5 w-5' />
              Estadísticas
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className='lg:col-span-3'>
          <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200 min-h-[500px]'>
            {activeTab === 'offers' && <JobOffersSection />}
            {activeTab === 'certs' && <CertificationsSection fixerId={user._id || user.id} />}
            {activeTab === 'experience' && <ExperienceSection fixerId={user._id || user.id} />}
            {activeTab === 'portfolio' && <PortfolioSection fixerId={user._id || user.id} />}
            {activeTab === 'estadisticas' && <EstadisticasTrabajos />}
            {activeTab === 'location' && (
              <LocationSection
                fixerId={user._id || user.id}
                currentLocation={{
                  lat: user.workLocation?.lat ?? 0,
                  lng: user.workLocation?.lng ?? 0,
                  direccion: user.workLocation?.direccion || '',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}