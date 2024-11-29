import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/api';
import { Receptor } from '../types';
import toast from 'react-hot-toast';

interface ReceptorFormData {
  codigo: string;
  nombreCompleto: string;
  correoElectronico: string;
}

export function useReceptores() {
  const queryClient = useQueryClient();

  const createReceptor = useMutation({
    mutationFn: async ({ data, firma }: { data: ReceptorFormData; firma?: File }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      if (firma) {
        formData.append('firma', firma);
      }
      
      const response = await api.post<Receptor>('/receptores', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptores'] });
      toast.success('Receptor creado exitosamente');
    },
    onError: () => {
      toast.error('Error al crear el receptor');
    },
  });

  const updateReceptor = useMutation({
    mutationFn: async ({
      id,
      data,
      firma,
    }: {
      id: number;
      data: ReceptorFormData;
      firma?: File;
    }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      if (firma) {
        formData.append('firma', firma);
      }

      const response = await api.put<Receptor>(`/receptores/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptores'] });
      toast.success('Receptor actualizado exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar el receptor');
    },
  });

  const deleteReceptor = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/receptores/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptores'] });
      toast.success('Receptor eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar el receptor');
    },
  });

  return {
    createReceptor,
    updateReceptor,
    deleteReceptor,
  };
}