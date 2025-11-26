// HelpButton.tsx
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  HelpCircle,
  Search,
  Hash,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  Tag,
  Calendar,
  Star,
  CheckCircle,
  X,
  RotateCcw,
} from 'lucide-react';

export function HelpButton() {
  const t = useTranslations('advancedSearch.help');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleClick = () => {
    setIsHelpOpen(true);
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  const helpSteps = [
    { icon: Search, key: 'step1' },
    { icon: Hash, key: 'step2' },
    { icon: Filter, key: 'step3' },
    { icon: MapPin, key: 'step4' },
    { icon: Briefcase, key: 'step5' },
    { icon: DollarSign, key: 'step6' },
    { icon: Tag, key: 'step7' },
    { icon: Calendar, key: 'step8' },
    { icon: Star, key: 'step9' },
    { icon: CheckCircle, key: 'step10' },
    { icon: RotateCcw, key: 'step11' },
  ];

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed right-4 sm:right-6 top-20 lg:top-24 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
        aria-label={t('buttonText')}
        title={t('buttonText')}
      >
        <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Panel lateral de Ayuda */}
      {isHelpOpen && (
        <>
          {/* Panel derecho - Estilo similar a filtros */}
          <div className="fixed right-0 top-0 h-full w-80 bg-gray-50 shadow-2xl z-50 flex flex-col transition-transform duration-300 border-l border-gray-200">
            {/* Header - Ayuda con X */}
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">{t('buttonText')}</h1>
              <button
                onClick={closeHelp}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={22} className="text-gray-700" />
              </button>
            </div>

            {/* Content - Steps tipo filtros */}
            <div className="overflow-y-auto p-4 space-y-3 flex-1">
              {/* Sección: Guía de Búsqueda Avanzada */}
              <div className="bg-blue-600 text-white px-4 py-3 rounded font-semibold text-sm">
                {t('tooltip')}
              </div>

              {/* Steps dinámicos */}
              {helpSteps.map(({ icon: Icon, key }, index) => (
                <div key={key} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="text-blue-600" size={16} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        <span className="font-semibold text-blue-600">{index + 1}.</span> {t(key)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
