import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/api';
import { Comunicado } from '../types';
import toast from 'react-hot-toast';

interface ComunicadoFormData {
  tipoReceptor: number;
  idGrupoReceptor?: number;
  destinatario?: string;
  asunto: string;
  contenido: string;
  fechaVencimiento?: string;
  confirmacionRecepcion: boolean;
  solicitarRespuesta: boolean;
}

export function useComunicados() {
  const queryClient = useQueryClient();

  const createComunicado = useMutation({
    mutationFn: async ({ data, adjunto }: { data: ComunicadoFormData; adjunto?: File }) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (adjunto) {
        formData.append('adjunto', adjunto);
      }

      const response = await api.post<Comunicado>('/comunicados', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados'] });
      toast.success('Comunicado creado exitosamente');
    },
    onError: () => {
      toast.error('Error al crear el comunicado');
    },
  });

  const updateComunicado = useMutation({
    mutationFn: async ({
      id,
      data,
      adjunto,
    }: {
      id: number;
      data: ComunicadoFormData;
      adjunto?: File;
    }) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (adjunto) {
        formData.append('adjunto', adjunto);
      }

      const response = await api.put<Comunicado>(`/comunicados/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados'] });
      toast.success('Comunicado actualizado exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar el comunicado');
    },
  });

  const confirmarComunicado = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<Comunicado>(`/comunicados/${id}/confirmar`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comunicados'] });
      toast.success('Comunicado confirmado exitosamente');
    },
    onError: () => {
      toast.error('Error al confirmar el comunicado');
    },
  });

  return {
    createComunicado,
    updateComunicado,
    confirmarComunicado,
  };
}