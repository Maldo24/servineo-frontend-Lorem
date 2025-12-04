'use client';

import { AuthProvider } from '../../../../Components/requester/auth/usoAutentificacion';

export default function HU7Layout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
