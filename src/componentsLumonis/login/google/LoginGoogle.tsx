"use client";

import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { api, ApiResponse } from "../../../app/redux/services/loginApi";

interface LoginGoogleProps {
  onMensajeChange: (mensaje: string, tipo: "error") => void;
}

interface GoogleLoginResponse {
  token: string;
  user: {
    id: string | number;
    name: string;
    email: string;
    picture?: string;
  };
  message?: string;
}

export default function LoginGoogle({ onMensajeChange }: LoginGoogleProps) {
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);

    try {
      const res: ApiResponse<GoogleLoginResponse> = await api.post(
        "/auth/google",
        {
          credential: credentialResponse.credential,
          token: credentialResponse.credential,
          modo: "login",
        }
      );

      if (res.success && res.data) {
        localStorage.setItem("servineo_token", res.data.token);
        localStorage.setItem("servineo_user", JSON.stringify(res.data.user));
        window.location.href = "/";
      } else {
        const mensajeError =
          res.message ||
          res.data?.message ||
          res.error ||
          "Error desconocido al iniciar sesión con Google.";
        onMensajeChange(mensajeError, "error");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        onMensajeChange(err.message, "error");
      } else {
        onMensajeChange("No se pudo conectar con el servidor.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    onMensajeChange("Error al iniciar sesión con Google.", "error");
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full flex justify-center">
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>

      {loading && (
        <p className="text-sm text-gray-500 mt-2 animate-pulse">
          Verificando credenciales...
        </p>
      )}
    </div>
  );
}
