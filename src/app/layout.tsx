import type { Metadata } from "next";
import "./globals.css"; // <-- IMPORTANTE

export const metadata: Metadata = {
  title: "Servineo",
  description: "Frontend Servineo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* font-sans asegura tipografía de Tailwind; bg-white para fondo claro */}
      <body className="min-h-screen bg-white text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}