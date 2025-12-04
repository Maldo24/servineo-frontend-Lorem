'use client';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

interface FooterSectionProps {
  onRestartTour?: () => void;
}

export default function FooterSection({ onRestartTour }: FooterSectionProps = {}) {
  const handleRestartTour = () => {
    if (onRestartTour) {
      onRestartTour();
    } else {
      // MODIFICACIÓN: Usamos la lógica de recarga forzada que es más segura
      localStorage.removeItem('servineoTourVisto');
      window.location.reload();
    }
  };

  const empresaLinks = [
    { name: 'Sobre nosotros', path: '/info/about' },
    { name: 'Trabaja con nosotros', path: '/info/join' },
    { name: 'Testimonios', path: '/info/testimonials' },
    { name: 'Apoyo', path: '/info/support' },
    { name: '¿Por qué Servineo?', path: '/por-que-servineo' },
    { name: 'Cómo funciona Servineo', path: '/howUseServineo' },
  ];
  const legalLinks = [
    { name: 'Política de privacidad', path: '/info/privacy' },
    { name: 'Acuerdos de usuario', path: '/info/terms' },
    { name: 'Política de cookies', path: '/info/cookies' },
  ];
  const exploreLinks = [
    { name: 'Servicios', path: '/servicios' },
    { name: 'Ofrece tus servicios', path: '/info/reparador' },
    { name: 'Ofertas de trabajo', path: '/job-offer-list' },
  ];

  return (
    <footer
      id='footer-principal'
      className="bg-[#0D1B3E] text-white font-['Roboto']"
      role='contentinfo'
      aria-label='Pie de página de Servineo'
    >
      <div className='max-w-7xl mx-auto px-6 py-8 space-y-6'>
        <a href='#main-content' className='sr-only focus:not-sr-only'>
          Saltar al contenido principal
        </a>
        <div className='text-center' aria-labelledby='footer-servineo-heading'>
          <h2 id='footer-servineo-heading' className='text-4xl font-bold mb-4 text-[#1AA7ED]'>
            Servineo
          </h2>
          <p className='text-white max-w-3xl mx-auto leading-relaxed text-lg'>
            La plataforma líder para conectar hogares con profesionales calificados en Cochabamba.
            Calidad garantizada y servicio confiable.
          </p>
        </div>

        <div
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-base text-center sm:text-left'
          role='navigation'
          aria-label='Enlaces del pie de página'
        >
          <div>
            <h3 className='text-xl font-semibold text-[#1AA7ED] mb-2'>Exploremos SERVINEO</h3>
            <ul className='space-y-1 mt-1'>
              {exploreLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.path}
                    className='footerLink hover:text-[#1AA7ED] transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div aria-labelledby='empresa-heading'>
            <h3 id='empresa-heading' className='text-xl font-semibold text-[#1AA7ED] mb-2'>
              Empresa
            </h3>
            <ul className='space-y-1 mt-1' role='list'>
              {empresaLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.path}
                    className='footerLink hover:text-[#1AA7ED] transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleRestartTour}
                  className='footerLink text-left w-full sm:w-auto cursor-pointer hover:text-[#1AA7ED] transition-colors bg-transparent border-none p-0'
                >
                  Ver guía nuevamente
                </button>
              </li>
            </ul>
          </div>

          <div aria-labelledby='legal-heading'>
            <h3 id='legal-heading' className='text-xl font-semibold text-[#1AA7ED] mb-2'>
              Legal
            </h3>
            <ul className='space-y-1 mt-1' role='list'>
              {legalLinks.map((link, i) => (
                <li key={i} role='listitem'>
                  <Link
                    href={link.path}
                    className='footerLink hover:text-[#1AA7ED] transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div aria-labelledby='contacto-heading'>
            <h3 id='contacto-heading' className='text-xl font-semibold text-[#1AA7ED] mb-2'>
              Contáctanos
            </h3>
            <div className='space-y-2 mt-1 text-white flex flex-col items-center sm:items-start'>
              <div className='flex items-center' aria-label='Ubicación: Cochabamba, Bolivia'>
                <MapPin
                  className='h-5 w-5 text-blue-400 mr-2 transition-all duration-300 group-hover:text-[#1AA7ED] group-hover:drop-shadow-[0_0_8px_var(--secondary)]'
                  aria-hidden='true'
                />
                <a
                  href='https://maps.app.goo.gl/PwgW3ERYuFQMEoNT7'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='footerLink'
                  aria-label='Ver ubicación en Google Maps: Cochabamba, Bolivia'
                >
                  Cochabamba, Bolivia
                </a>
              </div>
              <div className='flex items-center' aria-label='Número de WhatsApp'>
                <Phone className='h-5 w-5 text-blue-400 mr-2' aria-hidden='true' />
                <a
                  href='https://wa.me/59175139742?text=Hola%2C%20me%20gustaria%20recibir%20informacion%20sobre%20los%20servicios%20que%20ofrece%20SERVINEO.%20Muchas%20gracias.'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='footerLink'
                  aria-label='Enviar mensaje por WhatsApp al +591 75139742'
                >
                  +591 751-39742
                </a>
              </div>
              <div className='flex items-center' aria-label='Correo electrónico de contacto'>
                <Mail className='h-5 w-5 text-blue-400 mr-2' aria-hidden='true' />
                <a
                  href='mailto:servineo.serviciostecnicos@gmail.com?subject=Solicitud%20de%20informacion&body=Hola,%20me%20gustaria%20recibir%20informacion%20sobre%20los%20servicios%20que%20ofrece%20SERVINEO.%20Muchas%20gracias.'
                  className='footerLink'
                  aria-label='Enviar correo electrónico a servineo.serviciostecnicos@gmail.com'
                >
                  servineo@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-gray-700 pt-6'>
          <div className='flex items-center justify-center sm:justify-start gap-4'>
            <h3 className='text-xl font-semibold text-[#1AA7ED]'>Síguenos</h3>
            <div
              className='flex flex-row gap-6'
              role='list'
              aria-label='Redes sociales de Servineo'
            >
              <a
                href='https://www.facebook.com/profile.php?id=61584421344788'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-[#1AA7ED] transition-colors'
                aria-label='Visitar Facebook de Servineo'
              >
                <Facebook className='h-6 w-6' aria-hidden='true' />
              </a>
              <a
                href='https://www.instagram.com/servineoserviciostecnicos?igsh=amR3YWtvczFuaTd2'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-[#1AA7ED] transition-colors'
                aria-label='Visitar Instagram de Servineo'
              >
                <Instagram className='h-6 w-6' aria-hidden='true' />
              </a>
              <a
                href='https://x.com/ServineoSTG?t=SUKbiRR3mEqFgE4vaViXvw&s=09'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-[#1AA7ED] transition-colors'
                aria-label='Visitar X (antes Twitter) de Servineo'
              >
                <Twitter className='h-6 w-6' aria-hidden='true' />
              </a>
            </div>
          </div>
        </div>
        <div className='border-t border-gray-700' role='separator' aria-hidden='true' />
        <div
          className='flex flex-col sm:flex-row items-center justify-between gap-4 text-white text-sm pt-8'
          aria-label='Créditos y derechos de autor'
        >
          <div>© 2024 Servineo. Todos los derechos reservados.</div>
          <div className='flex items-center space-x-4'>
            <span>Hecho con ❤️ en Cochabamba</span>
            <div className='flex items-center space-x-2'>
              <div className='w-2.5 h-2.5 bg-green-500 rounded-full' aria-hidden='true' />
              <span>Sistema operativo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
