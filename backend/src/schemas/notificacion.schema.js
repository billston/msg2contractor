import { z } from 'zod';

export const respuestaSchema = z.object({
  respuesta: z.string().min(1, 'La respuesta es requerida'),
});