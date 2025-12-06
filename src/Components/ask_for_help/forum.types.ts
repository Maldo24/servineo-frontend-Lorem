export type AuthorRole = 'requester' | 'fixer' | 'visitor' | 'admin';
export type ForumCategoria = 'problemas' | 'servicios' | 'consejos' | 'general';

export interface ForumThread {
  _id: string;
  authorId: string;
  authorName: string;
  authorRole: AuthorRole;
  titulo: string;
  descripcion: string;
  categoria: ForumCategoria;
  commentsCount: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface ForumComment {
  _id: string;
  forumId: string;
  authorId: string;
  authorName: string;
  authorRole: AuthorRole;
  contenido: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumWithComments {
  forum: ForumThread;
  comments: ForumComment[];
}

export interface CreateForumPayload {
  titulo: string;
  descripcion: string;
  categoria: ForumCategoria;
}