// src/validators/filter.validator.ts
import { z } from 'zod';

const RangeEnum = z.enum([
  'De (A-C)',
  'De (D-F)',
  'De (G-I)',
  'De (J-L)',
  'De (M-Ñ)',
  'De (O-Q)',
  'De (R-T)',
  'De (U-W)',
  'De (X-Z)',
]);

const nameRangeArray = z.array(RangeEnum).default([]);

const cityRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s-]+$/;
const cityString = z.string().trim().regex(cityRegex, { message: 'Ciudad inválida.' });
const cityArray = z.array(cityString).default([]);

const categoryItem = z
  .string()
  .trim()
  .regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s-]+$/, {
    message: 'Categoría inválida.',
  });

const FilterSchema = z.object({
  range: nameRangeArray,
  city: cityArray,
  category: z.array(categoryItem).default([]),
});

export function validateFilters(filters: unknown) {
  const result = FilterSchema.safeParse(filters);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? 'Error de validación filters';
    return { isValid: false, error: firstError, data: null };
  }
  return { isValid: true, data: result.data };
}
