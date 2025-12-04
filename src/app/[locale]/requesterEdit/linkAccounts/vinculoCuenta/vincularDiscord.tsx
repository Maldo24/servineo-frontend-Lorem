'use client';

import { useState } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { vincularDiscord, Client } from '@/app/redux/services/services/api';
import { useTranslations } from 'next-intl';

interface VincularDiscordProps {
  onLinked?: (client?: Client) => void;
}

export default function VincularDiscord({ onLinked }: VincularDiscordProps) {
  const t = useTranslations('VincularDiscord');
  const [loading, setLoading] = useState(false);

  const handleVincularDiscord = () => {
    const token = localStorage.getItem('servineo_token');
    if (!token) {
      return;
    }

    setLoading(true);

    vincularDiscord(
      token,

      (client) => {
        onLinked?.(client);
        setLoading(false);
      },
    );
  };

  return (
    <div className='w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:bg-gray-50 transition'>
      <div className='flex items-center gap-3'>
        <FaDiscord size={30} className='text-[#5865F2]' />
        <div className='flex flex-col'>
          <span className='text-sm font-semibold text-gray-800'>{t('title')}</span>
          <span className='text-xs text-gray-500'>{t('subtitle')}</span>
        </div>
      </div>

      <button
        onClick={handleVincularDiscord}
        disabled={loading}
        className='flex items-center justify-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60'
      >
        {loading ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin' /> {t('buttons.linking')}
          </>
        ) : (
          t('buttons.link')
        )}
      </button>
    </div>
  );
}
