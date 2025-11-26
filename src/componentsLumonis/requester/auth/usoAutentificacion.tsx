"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { verificarSesionBackend, User } from "@/app/redux/services/auth/registro";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("servineo_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Error leyendo usuario:", e);
      localStorage.removeItem("servineo_user");
    }

    const token = localStorage.getItem("servineo_token");
    if (!token) {
      setLoading(false);
      return;
    }

    verificarSesionBackend(token)
      .then((data) => {
        if (data.valid && data.user) {
          setUser((prev) => {
            const newUser = { ...prev, ...data.user };
            localStorage.setItem("servineo_user", JSON.stringify(newUser));
            return newUser;
          });
        } else {
          localStorage.removeItem("servineo_token");
          localStorage.removeItem("servineo_user");
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem("servineo_token");
        localStorage.removeItem("servineo_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("servineo_user", JSON.stringify(user));
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem("servineo_token");
    localStorage.removeItem("servineo_user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
