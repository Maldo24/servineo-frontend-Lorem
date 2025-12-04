'use client';

import HeroSection from '@/Components/Home/Hero-section';
import ServicesSection from '@/Components/Home/Services-section';
import HowItWorksSection from '@/Components/Home/HowItWorks-section';
import CTASection from '@/Components/Home/CTA-section';
import InspirationSection from '@/Components/Home/Inspiration-section';
import RecentOffersSection from '@/Components/Home/RecentOffer-secction';
import dynamic from 'next/dynamic';

import { useEffect } from 'react';
//import { useSelector } from 'react-redux';
//import { IUser } from '@/types/user';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useGetUserByIdQuery } from '../redux/services/userApi';
import { setUser } from '../redux/slice/userSlice';

// Importar Map dinámicamente sin SSR
const Map = dynamic(() => import('../Mapa/Map'), { ssr: false });

export default function Home() {
  //const user = useSelector((state: { user: IUser }) => state.user);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener userId desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('servineo_user');
    if (token) {
      try {
        const userData = JSON.parse(token);
        const id = userData._id || userData.id;
        setUserId(id);
      } catch (e) {
        // Optionally log the error or handle it as needed
        console.warn('Failed to parse servineo_user from localStorage:', e);
      }
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

  return (
    <div className='min-h-screen bg-white overflow-x-hidden'>
      <HeroSection />
      <section className='py-16 px-4 bg-white'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center'>
            Encuentra Servicios Cerca de Ti
            <span className='block text-base md:text-lg font-normal text-gray-600 mt-2 opacity-80'>
              Explora los profesionales disponibles en tu zona
            </span>
          </h2>
          <Map />
          <InspirationSection />
          <RecentOffersSection />
        </div>
      </section>
      <ServicesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}
