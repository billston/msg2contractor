import { z } from 'zod';

export const createReceptorSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombreCompleto: z.string().min(1, 'El nombre completo es requerido'),
  correoElectronico: z.string().email('Correo electrónico inválido'),
});

export const updateReceptorSchema = createReceptorSchema;