// src/validators/pagination.validator.ts
import { z } from 'zod';

// Límites permitidos específicamente para JobOfert
const JOBOFERT_ALLOWED_LIMITS: number[] = [10, 20, 50, 100];

const PaginationSchema = z.object({
  page: z.number().int().min(1, { message: 'La página mínima es 1.' }).default(1),
  limit: z
    .number()
    .int()
    .refine((n) => JOBOFERT_ALLOWED_LIMITS.includes(n), {
      message: `Límite no permitido. Valores permitidos: ${JOBOFERT_ALLOWED_LIMITS.join(', ')}.`,
    })
    .default(10),
});

export function validatePagination(page: number, limit: number) {
  const result = PaginationSchema.safeParse({ page, limit });

  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? 'Error de validación pagination';
    return { isValid: false, error: firstError, data: null };
  }

  return { isValid: true, data: result.data };
}
export function sanitizePage(page: number, totalPages: number = 1): number {
  if (!page || isNaN(page)) return 1; // Si no hay número
  if (page < 1) return 1; // Negativos -> 1
  if (page > totalPages) return totalPages; // Si pasa límite -> última página
  return page; // Si es válido, se mantiene
}
export function sanitizeLimit(limit: number): number {
  const DEFAULT = 10;
  if (JOBOFERT_ALLOWED_LIMITS.includes(limit)) return limit;
  return DEFAULT;
}

export { PaginationSchema, JOBOFERT_ALLOWED_LIMITS };
