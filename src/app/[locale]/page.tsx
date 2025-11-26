
"use client";
import HeroSection from "@/componentsLumonis/Home/Hero-section";
import ServicesSection from "@/componentsLumonis/Home/Services-section";
import HowItWorksSection from "@/componentsLumonis/Home/HowItWorks-section";
import CTASection from "@/componentsLumonis/Home/CTA-section";
import MapSection from "@/componentsLumonis/Home/Map-section";
import InspirationSection from "@/componentsLumonis/Home/Inspiration-section";
import RecentOffersSection from "@/componentsLumonis/Home/RecentOffer-secction";
import FooterSection from "@/componentsLumonis/Home/Footer-section";


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <MapSection />
          <InspirationSection />
          <RecentOffersSection />
        </div>
      </section>

      <ServicesSection />
      <HowItWorksSection />

      <CTASection />
      <FooterSection />
    </div>
  );
}
