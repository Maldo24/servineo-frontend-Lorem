"use client";

import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const WhatsappBanner: React.FC = () => {
  // Número y mensaje (con Servineo visible en el texto)
  const phoneNumber = "59176107373";
  const message =
    "Servineo - Escríbenos tu problema para que la IA te ayude";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const handleCaptchaChange = async (token: string | null) => {
    if (!token) return;

    setErrorMessage("");
    setIsVerifying(true);

    try {
      const response = await fetch(`${API_URL}/api/devon/verify-captcha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setCaptchaVerified(true);
      } else {
        setCaptchaVerified(false);
        setErrorMessage(
          "Verificación fallida. Las claves no coinciden o el token expiró."
        );
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      console.error("Error conectando con el backend:", error);
      setErrorMessage(
        "Hubo un problema verificando el captcha. Intenta nuevamente."
      );
      setCaptchaVerified(false);
      recaptchaRef.current?.reset();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleWhatsappClick = () => {
    if (!captchaVerified) {
      setErrorMessage("Por favor, completa la verificación de seguridad.");
      return;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        ¿Necesitas ayuda rápida?
      </h2>
      <p className="text-gray-600 mb-5">
        Habla con nuestra IA en WhatsApp ahora mismo y resuelve tus dudas al instante.
      </p>

      {/* reCAPTCHA */}
      <div className="flex justify-center mb-4">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3 ||
            ""}
          onChange={handleCaptchaChange}
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 mb-3">{errorMessage}</p>
      )}

      {/* Botón WhatsApp */}
      <button
        type="button"
        onClick={handleWhatsappClick}
        disabled={!captchaVerified || isVerifying}
        className={`inline-flex items-center justify-center gap-2 px-10 py-3 rounded-full font-semibold text-white shadow-md transition ${
          captchaVerified && !isVerifying
            ? "bg-green-500 hover:bg-green-600 cursor-pointer"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {/* Icono de WhatsApp */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.486 2 2 6.187 2 11.1c0 1.78.533 3.42 1.45 4.83L2 22l6.252-1.98C9.09 20.4 10.5 20.8 12 20.8c5.514 0 10-4.187 10-9.7C22 6.187 17.514 2 12 2zm0 2c4.337 0 8 3.252 8 7.7 0 4.449-3.663 7.7-8 7.7-1.39 0-2.71-.34-3.87-.98l-.28-.15-3.72 1.18 1.21-3.58-.18-.29C4.43 15.13 4 13.86 4 11.7 4 7.252 7.663 4 12 4zm-2.02 3.5c-.17 0-.44.03-.68.31-.23.27-.9.88-.9 2.15 0 1.27.92 2.49 1.05 2.66.13.17 1.81 2.9 4.43 3.95 2.18.86 2.62.78 3.09.73.47-.05 1.52-.62 1.73-1.22.21-.6.21-1.11.15-1.22-.06-.11-.23-.17-.49-.29-.26-.12-1.52-.75-1.75-.84-.23-.09-.4-.13-.57.13-.17.26-.66.84-.81 1.02-.15.17-.3.19-.56.07-.26-.12-1.11-.41-2.12-1.31-.78-.69-1.31-1.54-1.46-1.8-.15-.26-.02-.4.11-.52.11-.11.26-.29.38-.43.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.12-.57-1.39-.78-1.9-.2-.49-.4-.42-.57-.43z" />
        </svg>
        {isVerifying ? "Verificando..." : "Chatear ahora"}
      </button>
    </div>
  );
};

export default WhatsappBanner;