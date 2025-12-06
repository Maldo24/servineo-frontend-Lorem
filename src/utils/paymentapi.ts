// src/utils/paymentapi.ts
// Funciones de API y utilidades para el sistema de pagos

import { PaymentSummary, PaymentResponse, FetchFixerJobsResult, Trabajo } from './types';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

/**
 * Construye URL completa con base del API
 */
export const withBase = (path: string): string => `${API_BASE}${path}`;

/**
 * Valida si un string es un ObjectId de MongoDB válido
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

/**
 * Obtiene el Fixer ID del usuario autenticado desde servineo_user
 */
export const getFixerId = (): string => {
  // Solo en el cliente (browser)
  if (typeof window === 'undefined') {
    console.warn('⚠️ getFixerId llamado en el servidor');
    return '';
  }

  try {
    const userStr = localStorage.getItem('servineo_user');

    if (!userStr) {
      console.error('❌ No se encontró servineo_user en localStorage. Usuario no autenticado.');
      return '';
    }

    const user = JSON.parse(userStr);

    // Intenta obtener el fixerId de diferentes posibles campos
    const fixerId = user?.fixerId || user?.fixer_id || user?.id || '';

    if (!fixerId) {
      console.error('❌ El objeto user no contiene fixerId:', user);
      return '';
    }

    console.log('✅ Fixer ID obtenido desde servineo_user:', fixerId);
    return fixerId;
  } catch (error) {
    console.error('❌ Error al parsear servineo_user:', error);
    return '';
  }
};

/**
 * Obtiene el usuario completo desde localStorage
 */
export const getUser = (): Record<string, unknown> | null => {
  if (typeof window === 'undefined') return null;

  try {
    const userStr = localStorage.getItem('servineo_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parseando servineo_user:', error);
    return null;
  }
};

/**
 * Obtiene el token de autenticación
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('servineo_token');
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!(getToken() && getUser());
};

/**
 * Obtiene el resumen de un pago
 */
export const fetchPaymentSummary = async (jobId: string): Promise<PaymentSummary> => {
  const url = withBase(`/api/lab/payments/${jobId}/summary?t=${Date.now()}`);
  console.log('🔗 Llamando API:', url);

  const res = await fetch(url, { cache: 'no-store' });
  console.log('📥 Status:', res.status);

  if (!res.ok) throw new Error(`Error ${res.status}`);

  const data = await res.json();
  console.log('✅ Datos:', data);

  const d = data?.data ?? data;

  const total =
    typeof d?.total === 'number'
      ? d.total
      : typeof d?.amount?.total === 'number'
        ? d.amount.total
        : 0;

  // Detectar código expirado
  const backendExpired = d?.codeExpired === true;
  const manualExpired = d?.codeExpiresAt && new Date(d.codeExpiresAt) < new Date();
  const isExpired = backendExpired || manualExpired;

  console.log('⏰ Verificación expiración:', {
    backendExpired,
    codeExpiresAt: d?.codeExpiresAt,
    manualExpired,
    isExpired,
  });

  return {
    id: String(d?.id ?? jobId),
    code: d?.code ?? null,
    status: d?.status ?? 'pending',
    amount: {
      total,
      currency: d?.currency ?? d?.amount?.currency ?? 'BOB',
    },
    codeExpired: isExpired,
    codeExpiresAt: d?.codeExpiresAt,
    createdAt: d?.createdAt,
  };
};

/**
 * Confirma un pago con código
 */
export const confirmPayment = async (paymentId: string, code: string): Promise<PaymentResponse> => {
  const res = await fetch(withBase(`/api/lab/payments/${paymentId}/confirm`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  const resp = await res.json().catch(() => ({}));

  return { res, resp };
};

/**
 * Obtiene trabajos de un fixer por estado (CON TIMEOUT)
 */
export const fetchFixerJobs = async (
  fixerId: string,
  status: 'pending' | 'paid',
): Promise<FetchFixerJobsResult> => {
  const url = withBase(`/api/lab/payments/by-fixer/${fixerId}/summary?status=${status}`);
  console.log(`🌐 Llamando API [${status}]:`, url);

  try {
    // Timeout de 10 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`📡 Respuesta [${status}]: Status ${res.status}`);

    if (!res.ok) {
      console.warn(`⚠️ API respondió con error ${res.status} para ${status}`);
      return { data: [] };
    }

    const data = await res.json();
    console.log(`✅ Datos [${status}]:`, data);
    return data;
  } catch (error: unknown) {
    if (error.name === 'AbortError') {
      console.error(`⏱️ Timeout en API [${status}]`);
    } else {
      console.error(`❌ Error en fetch [${status}]:`, error);
    }
    return { data: [] };
  }
};

/**
 * Obtiene todos los trabajos (pendientes y pagados) de un fixer
 */
export const fetchAllFixerJobs = async (fixerId: string): Promise<Trabajo[]> => {
  console.log('🔍 fetchAllFixerJobs llamado con fixerId:', fixerId);

  if (!fixerId || fixerId.trim() === '') {
    console.error('❌ FixerId está vacío');
    throw new Error('FixerId no puede estar vacío');
  }

  const isValidId = isValidObjectId(fixerId);
  console.log('🔑 ¿ID válido?', isValidId);

  if (isValidId) {
    console.log('✅ ID válido, consultando API...');

    try {
      // Timeout global de 15 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La API tardó más de 15 segundos')), 15000);
      });

      const fetchPromise = Promise.all([
        fetchFixerJobs(fixerId, 'pending'),
        fetchFixerJobs(fixerId, 'paid'),
      ]);

      const [pending, paid] = await Promise.race([fetchPromise, timeoutPromise]);

      console.log('📦 Respuesta pending:', pending);
      console.log('📦 Respuesta paid:', paid);
      console.log(`✅ Encontrados: ${pending.data.length} pendientes, ${paid.data.length} pagados`);

      const pendingArray = Array.isArray(pending?.data) ? pending.data : [];
      const paidArray = Array.isArray(paid?.data) ? paid.data : [];

      // Si no hay datos, mostrar mensaje específico
      if (pendingArray.length === 0 && paidArray.length === 0) {
        console.log('⚠️ No se encontraron trabajos en el API');
        return [];
      }

      const mapped = [...pendingArray, ...paidArray].map((x) => {
        // Manejo seguro de amount - puede venir como objeto o directamente como número
        const total =
          typeof x.amount === 'object' && x.amount !== null
            ? x.amount.total || 0
            : typeof x.amount === 'number'
              ? x.amount
              : typeof x.total === 'number'
                ? x.total
                : 0;

        return {
          jobId: String(x.id),
          titulo: `Pago #${String(x.id).slice(-6).toUpperCase()}`,
          descripcion: `Monto: Bs. ${total.toFixed(2)}`,
          totalPagar: total,
          paymentStatus: x.status || 'pending',
          fecha: x.createdAt
            ? new Date(x.createdAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        };
      });

      console.log('✅ Trabajos mapeados:', mapped);
      return mapped;
    } catch (error: unknown) {
      console.error('❌ Error en fetchAllFixerJobs:', error);

      // Si es timeout o error de red, devolver datos de ejemplo
      if (error.message.includes('Timeout') || error.message.includes('fetch')) {
        console.log('⚠️ Usando datos de ejemplo debido a error de conexión');
        return [
          {
            jobId: 'DEMO-001',
            titulo: 'Pago Demo 1 (Error de API)',
            descripcion: 'No se pudo conectar al servidor',
            totalPagar: 150.0,
            paymentStatus: 'pending',
            fecha: new Date().toISOString().slice(0, 10),
          },
        ];
      }

      throw error;
    }
  } else {
    console.log('⚠️ ID inválido, usando datos simulados');
    await new Promise((r) => setTimeout(r, 1000));

    return [
      {
        jobId: 'SIM-001',
        titulo: 'Pago Simulado 1',
        descripcion: 'Trabajo de prueba',
        totalPagar: 250.0,
        paymentStatus: 'pending',
        fecha: '2025-11-08',
      },
      {
        jobId: 'SIM-002',
        titulo: 'Pago Simulado 2',
        descripcion: 'Trabajo completado',
        totalPagar: 180.5,
        paymentStatus: 'paid',
        fecha: '2025-11-07',
      },
    ];
  }
};

/**
 * Formatea tiempo en mm:ss
 */
export const formatTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

/**
 * Formatea tiempo en hh:mm:ss
 */
export const formatTimeWithHours = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};
