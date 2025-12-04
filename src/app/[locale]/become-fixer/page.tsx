'use client';
import React, { useEffect, useState } from 'react';
import FixerRegisterForm from '@/Components/fixer/Fixer-register-form';
import { FixerEnableWizard } from '@/Components/fixer/Filter-eneable-wizard';
import { Navbar } from '@/Components/Shared/Navbar';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/app/redux/hooks';
//import { RootState } from '@/app/redux/store';
import { IUser } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useGetUserByIdQuery } from '@/app/redux/services/userApi';
import { setUser } from '@/app/redux/slice/userSlice';
import { useDispatch } from 'react-redux';

export default function BecomeFixerPage() {
  const t = useTranslations('becomeFixer');
  const router = useRouter();
  const dispatch = useDispatch();

  const { user: reduxUser } = useAppSelector((state) => state.user);
  const [userId, setUserId] = useState<string | null>(null);
  const [requester, setRequester] = useState<IUser | null>(null);

  // Redirigir si el usuario ya es fixer
  useEffect(() => {
    if (reduxUser?.role === 'fixer') {
      router.push('/fixer/dashboard');
    }
  }, [reduxUser, router]);

  // Obtener userId desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('servineo_user');
    if (token) {
      const userData = JSON.parse(token);
      const id = userData._id || userData.id;
      setUserId(id);
    }
  }, []);

  // Consultar user por ID
  const { data: userData } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  // Guardar user en redux
  useEffect(() => {
    if (userData) dispatch(setUser(userData));
  }, [userData, dispatch]);

  // Valores por defecto del formulario
  const defaultValues = {
    name: reduxUser?.name || '',
    email: reduxUser?.email || '',
    phone: reduxUser?.telefono || '',
  };

  return (
    <div>
      <Navbar />
      <div className='container mx-auto max-w-4xl p-4'>
        <header className='mb-6 text-center'>
          <h1 className='text-2xl font-bold'>{t('title')}</h1>
          <p className='text-sm text-gray-500'>{t('description')}</p>
        </header>
        <section className='space-y-6'>
          {!requester ? (
            <div className='neon-border glass-panel rounded-2xl border border-gray-200 p-4 shadow-sm animate-slide-up'>
              <h2 className='mb-3 text-center text-lg font-semibold'>{t('InputData')}</h2>
              <FixerRegisterForm
                defaultValues={defaultValues}
                onSubmit={(data) => {
                  // Construir el objeto IUser con los datos del formulario y redux
                  const finalUser: IUser = {
                    _id: reduxUser?._id || 'req-guest',
                    name: data.name,
                    email: data.email,
                    telefono: data.phone,
                    url_photo: reduxUser?.url_photo || 'https://picsum.photos/80',
                    role: 'requester',
                  } as IUser;
                  setRequester(finalUser);
                }}
                submitButtonText={t('button1')}
              />
            </div>
          ) : (
            <div className='animate-fade-in'>
              <FixerEnableWizard user={requester} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
