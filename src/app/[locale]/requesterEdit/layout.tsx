'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../../lib/hooks/usoAutentificacion';

const GOOGLE_CLIENT_ID = '830637764593-g8v6upkgq190ivcshbur0na84glb74m0.apps.googleusercontent.com';

export default function HU7Layout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
