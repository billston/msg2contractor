import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/api';
import { Notificacion } from '../types';
import toast from 'react-hot-toast';

interface RespuestaFormData {
  respuesta: string;
}

export function useNotificaciones() {
  const queryClient = useQueryClient();

  const confirmarRecepcion = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<Notificacion>(`/notificaciones/${id}/confirmar`);
      await api.post('/notificaciones/email', {
        idNotificacion: id,
        tipo: 'recepcion',
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
      toast.success('Recepción confirmada exitosamente');
    },
    onError: () => {
      toast.error('Error al confirmar la recepción');
    },
  });

  const responderNotificacion = useMutation({
    mutationFn: async ({
      id,
      data,
      adjunto,
    }: {
      id: number;
      data: RespuestaFormData;
      adjunto?: File;
    }) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (adjunto) {
        formData.append('adjunto', adjunto);
      }

      const response = await api.post<Notificacion>(
        `/notificaciones/${id}/responder`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      await api.post('/notificaciones/email', {
        idNotificacion: id,
        tipo: 'respuesta',
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
      toast.success('Respuesta enviada exitosamente');
    },
    onError: () => {
      toast.error('Error al enviar la respuesta');
    },
  });

  return {
    confirmarRecepcion,
    responderNotificacion,
  };
}