import { z } from 'zod';

export const createComunicadoSchema = z.object({
  tipoReceptor: z.number().int().min(1).max(2),
  idGrupoReceptor: z.number().int().positive().optional(),
  destinatario: z.string().optional(),
  asunto: z.string().min(1, 'El asunto es requerido'),
  contenido: z.string().min(1, 'El contenido es requerido'),
  fechaVencimiento: z.string().datetime().optional(),
  confirmacionRecepcion: z.boolean(),
  solicitarRespuesta: z.boolean(),
});

export const updateComunicadoSchema = createComunicadoSchema;