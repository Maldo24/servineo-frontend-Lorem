'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function FooterSection() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const empresaLinks = [
    { name: t('company.aboutUs'), path: `/${locale}/info/about` },
    { name: t('company.workWithUs'), path: `/${locale}/info/join` },
    { name: t('company.testimonials'), path: `/${locale}/info/testimonials` },
    { name: t('company.support'), path: `/${locale}/info/support` },
    { name: t('company.whyServineo'), path: `/${locale}/por-que-servineo` },
    { name: t('company.howItWorks'), path: `/${locale}/howUseServineo` },
  ];

  const legalLinks = [
    { name: t('legal.privacy'), path: `/${locale}/info/privacy` },
    { name: t('legal.terms'), path: `/${locale}/info/terms` },
    { name: t('legal.cookies'), path: `/${locale}/info/cookies` },
  ];

  const exploreLinks = [
    { name: t('explore.services'), path: `/${locale}/servicios` },
    { name: t('explore.offerServices'), path: `/${locale}/info/reparador` },
    { name: t('explore.jobOffers'), path: `/${locale}/job-offer-list` },
  ];

  return (
    <footer
      id='footer-principal'
      className="bg-[#0D1B3E] text-white font-['Roboto']"
      role='contentinfo'
      aria-label={t('ariaLabels.footer')}
    >
      <div className='max-w-7xl mx-auto px-6 py-8 space-y-6'>
        <a href='#main-content' className='sr-only focus:not-sr-only'>
          {t('skipToMain')}
        </a>

        <div className='text-center' aria-labelledby='footer-servineo-heading'>
          <h2 id='footer-servineo-heading' className='text-4xl font-bold mb-4 text-[#1AA7ED]'>
            Servineo
          </h2>
          <p className='text-white max-w-3xl mx-auto leading-relaxed text-lg'>{t('description')}</p>
        </div>

        <div
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-base text-center sm:text-left'
          role='navigation'
          aria-label={t('ariaLabels.footerLinks')}
        >
          <div>
            <h3 className='text-xl font-semibold text-[#1AA7ED] mb-2'>{t('explore.title')}</h3>
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
              {t('company.title')}
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
              {/* Aquí eliminé el <li> del botón "Ver guía nuevamente" */}
            </ul>
          </div>

          <div aria-labelledby='legal-heading'>
            <h3 id='legal-heading' className='text-xl font-semibold text-[#1AA7ED] mb-2'>
              {t('legal.title')}
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
              {t('contact.title')}
            </h3>
            <div className='space-y-2 mt-1 text-white flex flex-col items-center sm:items-start'>
              <div className='flex items-center' aria-label={t('contact.location')}>
                <MapPin
                  className='h-5 w-5 text-blue-400 mr-2 transition-all duration-300 group-hover:text-[#1AA7ED] group-hover:drop-shadow-[0_0_8px_var(--secondary)]'
                  aria-hidden='true'
                />
                <a
                  href='https://maps.app.goo.gl/PwgW3ERYuFQMEoNT7'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='footerLink'
                  aria-label={t('ariaLabels.viewLocation')}
                >
                  Cochabamba, Bolivia
                </a>
              </div>
              <div className='flex items-center' aria-label={t('ariaLabels.whatsapp')}>
                <Phone className='h-5 w-5 text-blue-400 mr-2' aria-hidden='true' />
                <a
                  href='https://wa.me/59175139742?text=Hola%2C%20me%20gustaria%20recibir%20informacion%20sobre%20los%20servicios%20que%20ofrece%20SERVINEO.%20Muchas%20gracias.'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='footerLink'
                  aria-label={t('ariaLabels.sendWhatsApp')}
                >
                  +591 751-39742
                </a>
              </div>
              <div className='flex items-center' aria-label={t('ariaLabels.email')}>
                <Mail className='h-5 w-5 text-blue-400 mr-2' aria-hidden='true' />
                <a
                  href='mailto:servineo.serviciostecnicos@gmail.com?subject=Solicitud%20de%20informacion&body=Hola,%20me%20gustaria%20recibir%20informacion%20sobre%20los%20servicios%20que%20ofrece%20SERVINEO.%20Muchas%20gracias.'
                  className='footerLink'
                  aria-label={t('ariaLabels.sendEmail')}
                >
                  servineo@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-gray-700 pt-6'>
          <div className='flex items-center justify-center sm:justify-start gap-4'>
            <h3 className='text-xl font-semibold text-[#1AA7ED]'>{t('social.title')}</h3>
            <div
              className='flex flex-row gap-6'
              role='list'
              aria-label={t('ariaLabels.socialMedia')}
            >
              <a
                href='https://www.facebook.com/profile.php?id=61584421344788'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-[#1AA7ED] transition-colors'
                aria-label={t('ariaLabels.facebook')}
              >
                <Facebook className='h-6 w-6' aria-hidden='true' />
              </a>
              <a
                href='https://www.instagram.com/servineoserviciostecnicos?igsh=amR3YWtvczFuaTd2'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-[#1AA7ED] transition-colors'
                aria-label={t('ariaLabels.instagram')}
              >
                <Instagram className='h-6 w-6' aria-hidden='true' />
              </a>
              <a
                href='https://x.com/ServineoSTG?t=SUKbiRR3mEqFgE4vaViXvw&s=09'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-[#1AA7ED] transition-colors'
                aria-label={t('ariaLabels.twitter')}
              >
                <Twitter className='h-6 w-6' aria-hidden='true' />
              </a>
            </div>
          </div>

          <div className='flex items-center justify-center sm:justify-end gap-2'>
            <div className='w-2.5 h-2.5 bg-green-500 rounded-full' aria-hidden='true' />
            <span>Sistema operativo</span>
          </div>
        </div>

        <div className='border-t border-gray-700' role='separator' aria-hidden='true' />

        <div
          className='flex flex-col sm:flex-row items-center justify-between gap-4 text-white text-sm pt-8'
          aria-label={t('ariaLabels.copyright')}
        >
          <div>{t('copyright')}</div>
          <div className='flex items-center space-x-4'>
            <span>{t('madeWith')}</span>
            <div className='flex items-center space-x-2'>
              <div className='w-2.5 h-2.5 bg-green-500 rounded-full' aria-hidden='true' />
              <span>{t('operational')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
