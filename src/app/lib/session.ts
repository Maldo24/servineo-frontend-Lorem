// lib/session.ts
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const sid = localStorage.getItem('sessionId');
    return sid;
  } catch (e) {
    console.warn('No se pudo leer sessionId de localStorage', e);
    return null;
  }
}

export function setSessionId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = localStorage.getItem('sessionId');
    if (current && current !== id) {
      console.warn('⚠️ SessionId está cambiando!', {
        anterior: current,
        nuevo: id,
      });
    }
    localStorage.setItem('sessionId', id);
  } catch (e) {
    console.warn('No se pudo guardar sessionId en localStorage', e);
  }
}

export function ensureSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sid = null;
  try {
    sid = localStorage.getItem('sessionId');
  } catch (e) {
    console.error('Error leyendo sessionId:', e);
  }

  if (!sid) {
    // Generar nuevo sessionId
    sid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sid-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    try {
      localStorage.setItem('sessionId', sid);
    } catch (e) {
      console.warn('No se pudo persistir sessionId en localStorage', e);
    }
  }

  return sid;
}
