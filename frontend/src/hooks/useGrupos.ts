import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/api';
import { GrupoReceptor, Miembro } from '../types';
import toast from 'react-hot-toast';

interface GrupoFormData {
  nombre: string;
}

interface MiembroFormData {
  idReceptor: number;
}

export function useGrupos() {
  const queryClient = useQueryClient();

  const createGrupo = useMutation({
    mutationFn: async (data: GrupoFormData) => {
      const response = await api.post<GrupoReceptor>('/grupos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      toast.success('Grupo creado exitosamente');
    },
    onError: () => {
      toast.error('Error al crear el grupo');
    },
  });

  const updateGrupo = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: GrupoFormData }) => {
      const response = await api.put<GrupoReceptor>(`/grupos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      toast.success('Grupo actualizado exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar el grupo');
    },
  });

  const deleteGrupo = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/grupos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      toast.success('Grupo eliminado exitosamente');
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.error('No se puede eliminar el grupo porque tiene comunicados asociados');
      } else {
        toast.error('Error al eliminar el grupo');
      }
    },
  });

  const addMiembro = useMutation({
    mutationFn: async ({ grupoId, data }: { grupoId: number; data: MiembroFormData }) => {
      const response = await api.post<Miembro>(`/grupos/${grupoId}/miembros`, data);
      return response.data;
    },
    onSuccess: (_, { grupoId }) => {
      queryClient.invalidateQueries({ queryKey: ['grupos', grupoId, 'miembros'] });
      toast.success('Miembro agregado exitosamente');
    },
    onError: () => {
      toast.error('Error al agregar el miembro');
    },
  });

  const removeMiembro = useMutation({
    mutationFn: async ({ grupoId, miembroId }: { grupoId: number; miembroId: number }) => {
      await api.delete(`/grupos/${grupoId}/miembros/${miembroId}`);
    },
    onSuccess: (_, { grupoId }) => {
      queryClient.invalidateQueries({ queryKey: ['grupos', grupoId, 'miembros'] });
      toast.success('Miembro eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar el miembro');
    },
  });

  return {
    createGrupo,
    updateGrupo,
    deleteGrupo,
    addMiembro,
    removeMiembro,
  };
}