'use client';
import { Search, UserCheck, MessageSquare, Star } from 'lucide-react';
import { useTranslations } from "next-intl";

export default function HowItWorksSection() {
  const t=useTranslations("HowItWorks");
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: t("HowItWorksSearch"),
      description: t("HowItWorksSearchDescription"),
    },
    {
      icon: <UserCheck className="w-8 h-8 text-primary" />,
      title: t("HowItWorksCompare"),
      description: t("HowItWorksCompareDescription"),
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: t("HowItWorksContact"),
      description: t("HowItWorksContactDescription"),
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: t("HowItWorksRate"),
      description: t("HowItWorksRateDescription"),
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("question")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("questionResponse")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 mb-4 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}