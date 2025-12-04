import ServicesSection from '@/Components/Home/Services-section';

/*  Props de ServicesSection borrados:
        showHero={'true'}
        showAllServices={true}
        showCTA={false}
        title="Todos Nuestros Servicios"
        subtitle="Explora la gama completa de soluciones que ofrecemos para tu hogar"
*/

export default function Page() {
  return (
    <ServicesSection
      showHero={true}
      showAllServices={true}
      showCTA={false}
      title='Todos Nuestros Servicios'
      subtitle='Explora la gama completa de soluciones que ofrecemos para tu hogar'
    />
  );
}
