"use client";


import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function TopMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // CORRECCIÓN TS
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    // Detecta login por token
    const token = localStorage.getItem("servineo_token");
    setIsLogged(!!token);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detectar click fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [

    { name: "Inicio", href: "/" },
    { name: "Ofertas de trabajo", href: "/job-offer-list" },
    // quitar campos de prueba
    // { name: 'Convertir-fixer', href: '/become-fixer' },
    { name: "mis ofertas", href: "/fixer/my-offers" },
    { name: "perfil", href: "/fixer/profile" },
  ];


  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/10 backdrop-blur-sm bg-white shadow-md"
            : "bg-white/10 backdrop-blur-sm"
        } border-t-[1.5px] border-b-[1.5px] border-primary`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary font-bold text-xl">
                SERVINEO
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* DERECHA */}
            <div className="hidden md:flex items-center space-x-4">              {!isLogged ? (
                <>
                  <Link
                    href="../login"
                    className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/signUp"
                    className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Regístrate
                  </Link>
                </>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Mi cuenta
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-md py-2 z-50">
                      <Link
                        href="/requesterEdit"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Editar perfil
                      </Link>
                      
                      <button
                        onClick={() => {
                          localStorage.removeItem("servineo_token");
                          localStorage.removeItem("servineo_user");
                          window.location.reload();
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-gray-100 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden ${
            isOpen ? "block" : "hidden"
          } bg-white/95 backdrop-blur-sm border-t border-gray-200`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 pb-2 border-t border-gray-200 px-2">

              {!isLogged ? (
                <>
                  <Link
                    href="../login"
                    className="block w-full text-center text-primary px-4 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/signUp"
                    className="block w-full text-center text-white bg-primary mt-2 px-4 py-2 rounded-md text-base font-medium hover:bg-primary/90"
                    onClick={() => setIsOpen(false)}
                  >
                    Regístrate
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/app/profile"
                    className="block px-4 py-2 text-primary hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Mi cuenta
                  </Link>

                  <Link
                    href="/requesterEdit"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Seguridad
                  </Link>

                  <button
                    onClick={() => {
                      localStorage.removeItem("servineo_token");
                      localStorage.removeItem("servineo_user");
                      window.location.reload();
                    }}
                    className="block w-full text-red-600 mt-2 px-4 py-2 rounded-md text-base font-medium hover:bg-red-50"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </header>

      <div className="h-16" />
    </>
  );
}