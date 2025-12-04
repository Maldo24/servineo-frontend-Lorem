'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/admin.module.css';
import { adminAPI } from '../lib/api';

// Definir tipo para la respuesta de Google Token Client
interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  credential?: string;
}

// Definir tipo para el callback de Google
type GoogleTokenCallback = (response: GoogleTokenResponse) => void;

// Extender la interfaz Window para incluir Google
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: GoogleTokenCallback;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  // Función para login con Google
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      // Cargar Google API
      await loadGoogleScript();

      // Inicializar Google Auth
      const google = window.google;
      const client = google?.accounts?.oauth2?.initTokenClient;

      if (!client) {
        throw new Error('Google API no disponible');
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        throw new Error('Google Client ID no configurado');
      }
      // Solicitar token
      client({
        client_id: clientId,
        scope: 'email profile',
        callback: async (response: GoogleTokenResponse) => {
          if (response.error) {
            console.error('Google auth error:', response);
            alert('Error con Google Login');
            setGoogleLoading(false);
            return;
          }

          if (!response.credential) {
            console.error('No credential received from Google');
            alert('Error: No se recibió credencial de Google');
            setGoogleLoading(false);
            return;
          }

          try {
            // Enviar token al backend
            const data = await adminAPI.loginWithGoogle(response.credential);

            if (data.success) {
              localStorage.setItem('adminToken', data.token);
              localStorage.setItem('adminUser', JSON.stringify(data.user));
              router.push('/es/user-admin/dashboard');
            } else {
              alert(data.message || 'Error con Google Login');
            }
          } catch (error) {
            console.error('Google login error:', error);
            alert('Error con Google Login');
          } finally {
            setGoogleLoading(false);
          }
        },
      }).requestAccessToken();
    } catch (error) {
      console.error('Google login error:', error);
      alert('Error con Google Login');
      setGoogleLoading(false);
    }
  };

  // Función para cargar script de Google
  const loadGoogleScript = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Google script'));
      document.head.appendChild(script);
    });
  };

  // Login normal
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await adminAPI.login({ email, password });

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        router.push('/es/user-admin/dashboard');
      } else {
        alert(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminLoginContainer}>
      <div className={styles.loginHeader}>
        <h1 className={styles.logo}>SERVINEO</h1>
        <p className={styles.subtitle}>Admin Login</p>
        <h2 className={styles.welcome}>Welcome back, Admin</h2>
      </div>

      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='admin@servineo.com'
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='••••••••'
            required
          />
        </div>

        <button type='submit' className={styles.loginButton} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In as Admin'}
        </button>

        <div className={styles.divider}>
          <span>o</span>
        </div>

        {/*NUEVO: Botón de Google */}
        <button
          type='button'
          onClick={handleGoogleLogin}
          className={styles.googleButton}
          disabled={googleLoading}
        >
          {googleLoading ? 'Connecting...' : 'Sign in with Google'}
        </button>
      </form>
    </div>
  );
}
