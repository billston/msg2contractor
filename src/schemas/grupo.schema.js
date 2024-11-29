import { z } from 'zod';

export const createGrupoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
});

export const updateGrupoSchema = createGrupoSchema;

export const addMiembroSchema = z.object({
  idReceptor: z.number().int().positive('El ID del receptor es requerido'),
});