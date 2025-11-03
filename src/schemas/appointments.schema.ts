// src/schemas/appointments.schema.ts
import { z } from "zod";

const baseSchema = z.object({
  client: z.string()
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Ingrese un nombre válido")
    .nonempty("Ingrese un nombre"),
  contact: z.string()
    .regex(/^[67]\d{7}$/, "Ingrese un número válido (8 dígitos)")
    .nonempty("Ingrese un número de contacto"),
  description: z.string()
    .max(300, "La descripción no puede superar 300 caracteres")
    .nonempty("Ingrese una descripción"),
});

const virtualSchema = baseSchema.extend({
  modality: z.literal("virtual"),
  meetingLink: z.string()
    .url("Ingrese un enlace válido")
    .nonempty("Ingrese un enlace de reunión"),
  location: z.undefined().optional(),
});

const presentialSchema = baseSchema.extend({
  modality: z.literal("presential"),
  location: z
    .object({
      lat: z.number(),
      lon: z.number(),
      address: z.string()
      //posiblemente borrar no empty nunca llega ese caso
        .nonempty("Seleccione una ubicación válida")
        .refine(addr => addr !== "No se pudo obtener la dirección", {
          message: "Seleccione una ubicación válida",
        }),
    })
    .nullable()
    .refine(val => val !== null, { message: "Seleccione una ubicación" }),
  meetingLink: z.undefined().optional(),
});

export const appointmentSchema = z.discriminatedUnion("modality", [virtualSchema, presentialSchema]);
export type AppointmentFormData = z.infer<typeof appointmentSchema>;