'use client';

import { Fixer } from '@/hooks/useFixersByJob';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { toggleJobExpanded, selectExpandedJobs } from '@/app/redux/slice/fixersByJobSlice';
import { ChevronDown } from 'lucide-react';
import { FixerCard } from './FixerCard';
//import { useTranslations } from "next-intl"

interface JobFixerSectionProps {
  jobType: string;
  fixers: Fixer[];
  matchCount: number;
}

export function JobFixerSection({ jobType, fixers, matchCount }: JobFixerSectionProps) {
  //const t = useTranslations("Fixers Por Trabajo")
  const dispatch = useAppDispatch();
  const expandedJobs = useAppSelector(selectExpandedJobs);
  const isExpanded = expandedJobs.includes(jobType);

  const formatJobType = (type: string) => {
    const customLabels: Record<string, string> = {
      'svc-plumbing': 'Plomería',
      'svc-electricity': 'Electricidad',
      'svc-carpentry': 'Carpintería',
      'svc-painting': 'Pintura',
      'svc-masonry': 'Albañilería',
      'svc-gardening': 'Jardinería',
      'svc-cleaning': 'Limpieza',
    };

    if (customLabels[type]) return customLabels[type];

    const normalized = type.replace(/^svc-/, '').replace(/-/g, ' ');
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  return (
    <div className='border border-gray-200 rounded-lg overflow-hidden bg-white'>
      <button
        onClick={() => dispatch(toggleJobExpanded(jobType))}
        className='w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 transition-colors'
      >
        <div className='flex items-center gap-2'>
          <h3 className='text-lg font-semibold text-gray-800'>{formatJobType(jobType)}</h3>
          <span className='text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full'>
            ({matchCount})
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className='p-6 space-y-4 animate-fade-in'>
          {fixers.length > 0 ? (
            fixers.map((fixer) => <FixerCard key={fixer.id} fixer={fixer} />)
          ) : (
            <p className='text-center text-gray-500 py-8'>No hay resultados</p>
          )}
        </div>
      )}
    </div>
  );
}
