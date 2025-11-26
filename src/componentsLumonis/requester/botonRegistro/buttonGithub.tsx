"use client";
import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Components/requester/auth/usoAutentificacion";

interface GithubButtonProps {
  onNotify?: (n: {
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  }) => void;
}

export default function GithubButton({ onNotify }: GithubButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const { setUser } = useAuth();

  const handleGithub = () => {
    setLoading(true);

    const popup = window.open(
      `${BASE_URL}/auth/github`,
      "GitHubLogin",
      "width=600,height=700"
    );
    if (!popup) {
      setLoading(false);
      onNotify?.({
        type: "error",
        title: "Error al abrir ventana",
        message: "No se pudo abrir el popup de GitHub.",
      });
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== BASE_URL) return;
      const data = event.data;

      if (data.type === "GITHUB_AUTH_SUCCESS") {
  if (onNotify) {
    onNotify({
      type: "success",
      title: "Inicio de sesión exitoso",
      message: `Bienvenido ${data.user?.name || ""}`,
    });
  }

  localStorage.setItem("servineo_token", data.token);

  if (data.user) {
    localStorage.setItem("servineo_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  window.removeEventListener("message", handleMessage);
  setLoading(false);
  popup.close();

 setTimeout(() => {
    if (data.isFirstTime) {
      router.push("/signUp/registrar/registroUbicacion");
    } else {
       setTimeout(() => {
      window.location.href = "/";
        }, 2000);
    }
  }, 2000);
}


      if (data.type === "GITHUB_AUTH_ERROR") {
        onNotify?.({
          type: "error",
          title: "Error de autenticación",
          message: data.message || "No se pudo autenticar con GitHub",
        });

        window.removeEventListener("message", handleMessage);
        setLoading(false);
        popup.close();
      }
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <button
      onClick={handleGithub}
      disabled={loading}
      className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg shadow-sm text-black transition-colors"
    >
      <FaGithub size={24} className="text-black" />
      {loading ? "Cargando..." : "Continuar con GitHub"}
    </button>
  );
}