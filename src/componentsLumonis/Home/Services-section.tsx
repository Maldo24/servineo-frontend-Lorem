
"use client";
import { Droplets } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
const services = [
  {
    name: "Plomería",
    icon: <Droplets className="w-8 h-8 text-primary" />,
    description: "Reparaciones e instalaciones de fontanería",
  },
  
];

export default function ServicesSection() {
  const t=useTranslations("Services");
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("serTitle")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("serDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              href={`/servicios/${service.name.toLowerCase()}`}
              className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 mb-4 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 text-center">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}