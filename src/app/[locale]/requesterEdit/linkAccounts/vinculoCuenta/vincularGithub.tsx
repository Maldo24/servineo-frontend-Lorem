'use client';

import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { vincularGitHub, Client } from '@/app/redux/services/services/api';
import { useTranslations } from 'next-intl';

interface VincularGithubProps {
  onLinked?: (client?: Client) => void;
}

export default function VincularGithub({ onLinked }: VincularGithubProps) {
  const t = useTranslations('VincularGithub');
  const [loading, setLoading] = useState(false);

  const handleVincularGitHub = () => {
    const token = localStorage.getItem('servineo_token');
    if (!token) {
      toast.error(t('errors.noSession'));
      return;
    }

    setLoading(true);

    vincularGitHub(
      token,
      (client) => {
        toast.success(t('success.message'));
        setLoading(false);
        onLinked?.(client);
      },
      (msg) => {
        toast.error(msg);
        setLoading(false);
      },
    );
  };

  return (
    <div className='w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:bg-gray-50 transition'>
      <div className='flex items-center gap-3'>
        <FaGithub size={30} className='text-gray-800' />
        <div className='flex flex-col'>
          <span className='text-sm font-semibold text-gray-800'>{t('title')}</span>
          <span className='text-xs text-gray-500'>{t('subtitle')}</span>
        </div>
      </div>
      <div>
        <button
          onClick={handleVincularGitHub}
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
    </div>
  );
}
