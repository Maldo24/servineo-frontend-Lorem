'use client';

import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaFormProps {
  onVerified?: (success: boolean) => void;
}

const ReCaptchaForm: React.FC<ReCaptchaFormProps> = ({ onVerified }) => {
  const captchaRef = useRef<ReCAPTCHA>(null);

  const verifyBackend = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signUp/verify-recaptcha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      onVerified?.(data.success);
    } catch (err) {
      console.error('Error comunicando con backend:', err);
      onVerified?.(false);
    }
  };

  return (
    <div>
      <ReCAPTCHA
        ref={captchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        onChange={(token) => {
          if (token) {
            verifyBackend(token);
          }
        }}
        onExpired={() => {
          onVerified?.(false);
          captchaRef.current?.reset();
        }}
      />
    </div>
  );
};

export default ReCaptchaForm;
