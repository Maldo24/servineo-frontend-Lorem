import { ForumThread, ForumWithComments } from './forum.types';

// Usamos SOLO lo que ya tienes en el .env:
// NEXT_PUBLIC_API_URL=http://localhost:8000  (la última línea es la que manda)
// Igual que en otros archivos de tu proyecto, le agregamos /api acá.
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// ---------- LISTAR FOROS ----------
export async function listForums(): Promise<ForumThread[]> {
  const url = `${API_BASE_URL}/forums`;
  console.log('[ForumService] GET', url);

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('Error al cargar el foro:', res.status, text);
    throw new Error('Error al cargar el foro');
  }

  return res.json();
}

// ---------- CREAR FORO (1 solo argumento, como en page.tsx) ----------
export async function createForum(input: {
  titulo: string;
  descripcion: string;
  categoria: 'problemas' | 'servicios' | 'consejos' | 'general';
}): Promise<ForumThread> {
  // El token de acceso se guarda como "servineo_token" en localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('servineo_token') : null;

  if (!token) {
    console.error('[ForumService] No se encontró servineo_token en localStorage');
    throw new Error('Debes iniciar sesión para crear una publicación');
  }

  const url = `${API_BASE_URL}/forums`;
  console.log('[ForumService] POST', url, input);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // 👈 el backend espera esto
    },
    // IMPORTANTE: sin credentials: "include" para evitar el error CORS con "*"
    body: JSON.stringify(input),
  });

  const text = await res.text().catch(() => '');

  if (res.status === 401) {
    console.error('Error 401 al crear foro:', text);
    throw new Error('Debes iniciar sesión para crear una publicación');
  }

  if (res.status === 409) {
    console.error('Error 409 al crear foro:', text);
    throw new Error('No se puede crear la publicación (conflicto)');
  }

  if (!res.ok) {
    console.error('Error al crear el foro:', res.status, text);
    throw new Error('Error al crear la publicación');
  }

  try {
    return JSON.parse(text);
  } catch {
    return res.json();
  }
}

// ---------- OBTENER FORO CON COMENTARIOS ----------
export async function getForumWithComments(forumId: string): Promise<ForumWithComments> {
  const url = `${API_BASE_URL}/forums/${forumId}`;
  console.log('[ForumService] GET', url);

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('Error al cargar la publicación:', res.status, text);
    throw new Error('Error al cargar la publicación');
  }

  return res.json();
}

// ---------- AGREGAR COMENTARIO ----------
export async function addCommentToForum(forumId: string, contenido: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('servineo_token') : null;

  if (!token) {
    console.error('[ForumService] No se encontró servineo_token al comentar');
    throw new Error('Debes iniciar sesión para comentar');
  }

  const url = `${API_BASE_URL}/forums/${forumId}/comments`;
  console.log('[ForumService] POST comment', url, { contenido });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contenido }),
  });

  const text = await res.text().catch(() => '');

  if (res.status === 401) {
    console.error('Error 401 al comentar:', text);
    throw new Error('Debes iniciar sesión para comentar');
  }

  if (res.status === 409) {
    console.error('Error 409 al comentar:', text);
    throw new Error('Este hilo está bloqueado para nuevos comentarios');
  }

  if (!res.ok) {
    console.error('Error al agregar el comentario:', res.status, text);
    throw new Error('Error al agregar el comentario');
  }

  try {
    return JSON.parse(text);
  } catch {
    return res.json();
  }
}
