"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/componentsLumonis/requester/auth/usoAutentificacion";

export default function SignUpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                {children}
            </GoogleOAuthProvider>
        </AuthProvider>
    );
}
