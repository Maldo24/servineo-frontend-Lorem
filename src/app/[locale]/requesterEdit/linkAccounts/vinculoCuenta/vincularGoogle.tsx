'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { vincularGoogle, Client } from '@/app/redux/services/services/api';
import { useTranslations } from 'next-intl';

interface VincularGoogleProps {
  onLinked?: (client?: Client) => void;
  tokenUsuario?: string;
}

export default function VincularGoogle({ onLinked, tokenUsuario }: VincularGoogleProps) {
  const t = useTranslations('VincularGoogle');
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const tokenGoogle = credentialResponse?.credential;
    if (!tokenGoogle) return console.error(t('errors.emptyToken'));

    if (!tokenUsuario) {
      toast.error(t('errors.noSession'));
      return;
    }

    setLoading(true);

    const result = await vincularGoogle(tokenUsuario, tokenGoogle);

    if (result.success) {
      toast.success(result.message);
      onLinked?.(result.client);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className='w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:bg-gray-50 transition'>
      <div className='flex items-center gap-3'>
        <FcGoogle size={30} />
        <div className='flex flex-col'>
          <span className='text-sm font-semibold text-gray-800'>{t('title')}</span>
          <span className='text-xs text-gray-500'>{t('subtitle')}</span>
        </div>
      </div>

      <div className='relative'>
        <button
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

        <div className='absolute inset-0 opacity-0 cursor-pointer'>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => toast.error(t('errors.loginError'))}
          />
        </div>
      </div>
    </div>
  );
}
