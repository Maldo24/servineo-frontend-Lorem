import type { Metadata } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "Servineo",
  description: "Frontend Servineo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}