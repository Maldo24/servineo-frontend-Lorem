'use client';
import { Droplets } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface ServicesSectionProps {
  showHero?: boolean;
  showAllServices?: boolean;
  showCTA?: boolean;
  title?: string;
  subtitle?: string;
}

const services = [
  {
    name: 'Plomería',
    icon: <Droplets className='w-8 h-8 text-primary' />,
    description: 'Reparaciones e instalaciones de fontanería',
  },
];

export default function ServicesSection({
  showHero = true,
  showAllServices = true,
  showCTA = false,
  title,
  subtitle,
}: ServicesSectionProps) {
  const t = useTranslations('Services');
  const heading = title || t('serTitle');
  const subheading = subtitle || t('serDescription');

  return (
    <section className='py-16 px-4 bg-white'>
      <div className='max-w-7xl mx-auto'>
        {showHero && (
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>{heading}</h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>{subheading}</p>
          </div>
        )}

        {showAllServices && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {services.map((service, index) => (
              <Link
                key={index}
                href={`/servicios/${service.name.toLowerCase()}`}
                className='group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100'
              >
                <div className='w-16 h-16 mb-4 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                  {service.icon}
                </div>
                <h3 className='text-xl font-semibold text-center text-gray-800 mb-2'>
                  {service.name}
                </h3>
                <p className='text-gray-600 text-center'>{service.description}</p>
              </Link>
            ))}
          </div>
        )}

        {showCTA && (
          <div className='mt-12 text-center'>
            <Link
              href='/signUp'
              className='inline-block px-6 py-3 rounded-md bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition'
            >
              Comenzar ahora
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
