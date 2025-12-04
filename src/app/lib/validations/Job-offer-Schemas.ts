import { z } from 'zod';

// === 1. ESQUEMA DE VALIDACIÓN (Formulario) ===
// Validamos solo lo que el usuario escribe. Las imágenes se validan aparte en el componente.
export const jobOfferSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'El título debe tener al menos 5 caracteres' })
    .max(80, { message: 'El título es muy largo' }),
  description: z
    .string()
    .min(20, { message: 'La descripción debe ser detallada (mínimo 20 letras)' }),
  category: z.string().min(1, { message: 'Selecciona una categoría válida' }),
  price: z
    .number()
    .positive({ message: 'El precio debe ser mayor a 0' }),
  city: z.string().min(1, { message: 'Selecciona una ciudad' }),
  contactPhone: z
    .string()
    .regex(/^[0-9+ ]{8,15}$/, { message: 'Ingresa un número de teléfono válido' }),
  tags: z
    .array(z.string())
    .min(1, { message: 'Debes agregar al menos una etiqueta' })
    .max(5, { message: 'Máximo 5 etiquetas' }),
});

export const certificationSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  institution: z.string().min(2, { message: 'La institución es requerida' }),
  issueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Fecha inválida' }),
  expiryDate: z.string().optional(), // Puede no tener vencimiento
  credentialId: z.string().optional(),
  credentialUrl: z
    .string()
    .url({ message: 'Debe ser una URL válida (https://...)' })
    .optional()
    .or(z.literal('')),
});

// Tipo inferido para usar en useForm
export type JobOfferFormData = z.infer<typeof jobOfferSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;

// esto no deveria esta aqui lo vamos a cambiar
// === 2. INTERFAZ DE RESPUESTA DE LA API (Backend Mongoose) ===
// Esta interfaz coincide con el JSON que mostraste anteriormente
export interface IJobOffer {
  _id: string;
  fixerId: string;
  fixerName: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  city: string;
  contactPhone: string;
  photos: string[]; // URLs que vienen del back
  rating: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// para no crear varios archivos aqui creare para las offertas su category

export const jobCategories = [
  { value: 'Albañil', label: 'Albañil' },
  { value: 'Electricista', label: 'Electricista' },
  { value: 'Fontanero', label: 'Fontanero' },
  { value: 'Carpintero', label: 'Carpintero' },
  { value: 'Pintor', label: 'Pintor' },
  { value: 'Jardinero', label: 'Jardinería' },
  { value: 'Vidriero', label: 'Vidriero' },
  { value: 'Yesero', label: 'Yesero' },
  { value: 'Decorador', label: 'Decorador' },
  { value: 'Techador', label: 'Techador' },
  { value: 'Pulidor', label: 'Pulidor' },
  { value: 'Cerrajero', label: 'Cerrajero' },
  { value: 'soldador', label: 'Soldador' },
  //si van a umentar mas sacar del modelo offfer.model.ts
];

export const boliviaCities = [{ value: 'Cochabamba', label: 'Cochabamba' }];
