'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import {
  validatePagination,
  JOBOFERT_ALLOWED_LIMITS,
} from '@/app/lib/validations/pagination.validator';
import { useTranslations } from 'next-intl';

interface PaginationSelectorProps {
  registrosPorPagina: number;
  onChange: (valor: number) => void;
}

const PaginationSelector: React.FC<PaginationSelectorProps> = ({
  registrosPorPagina,
  onChange,
}) => {
  const t = useTranslations('pagination');
  const opciones = [...JOBOFERT_ALLOWED_LIMITS];

  const handleChange = (valor: number) => {
    const { isValid, data } = validatePagination(1, valor);
    if (!isValid || !data) return;
    onChange(data.limit);
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-sm text-gray-600">{t('show')}</span>
      <Listbox value={registrosPorPagina} onChange={handleChange}>
        <div className="relative">
          <Listbox.Button className="relative w-20 cursor-pointer border border-gray-300 rounded-lg bg-white px-2 py-1 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {registrosPorPagina}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown size={16} />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {opciones.map((opcion) => (
                <Listbox.Option
                  key={opcion}
                  value={opcion}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none px-4 py-2 ${
                      active ? 'bg-blue-600 text-white' : 'text-black'
                    } ${selected ? 'font-bold' : ''}`
                  }
                >
                  {opcion}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <span className="text-sm text-gray-600">{t('perPage')}</span>
    </div>
  );
};

export default PaginationSelector;
