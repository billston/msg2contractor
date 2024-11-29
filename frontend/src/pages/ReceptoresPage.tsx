import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../config/api';
import { Receptor } from '../types';
import Modal from '../components/Modal';
import ReceptorForm from '../components/ReceptorForm';
import { useReceptores } from '../hooks/useReceptores';
import toast from 'react-hot-toast';

function ReceptoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReceptor, setEditingReceptor] = useState<Receptor | null>(null);

  const { data: receptores, isLoading } = useQuery({
    queryKey: ['receptores', searchTerm],
    queryFn: async () => {
      const response = await api.get<Receptor[]>('/receptores', {
        params: { search: searchTerm },
      });
      return response.data;
    },
  });

  const { createReceptor, updateReceptor, deleteReceptor } = useReceptores();

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este receptor?')) {
      try {
        await deleteReceptor.mutateAsync(id);
      } catch (error) {
        if (error.response?.status === 409) {
          toast.error('No se puede eliminar el receptor porque tiene notificaciones asociadas');
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Receptores</h1>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Receptor
        </button>
      </div>

      <div className="flex max-w-md">
        <div className="relative flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Buscar por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Código
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nombre Completo
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Correo Electrónico
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        Cargando...
                      </td>
                    </tr>
                  ) : receptores?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        No se encontraron receptores
                      </td>
                    </tr>
                  ) : (
                    receptores?.map((receptor) => (
                      <tr key={receptor.idReceptor}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {receptor.codigo}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {receptor.nombreCompleto}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {receptor.correoElectronico}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm space-x-2">
                          <button
                            onClick={() => setEditingReceptor(receptor)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(receptor.idReceptor)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Receptor"
      >
        <ReceptorForm
          onSubmit={async (data, firma) => {
            await createReceptor.mutateAsync({ data, firma });
            setIsCreateModalOpen(false);
          }}
          isSubmitting={createReceptor.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingReceptor}
        onClose={() => setEditingReceptor(null)}
        title="Editar Receptor"
      >
        {editingReceptor && (
          <ReceptorForm
            initialData={editingReceptor}
            onSubmit={async (data, firma) => {
              await updateReceptor.mutateAsync({
                id: editingReceptor.idReceptor,
                data,
                firma,
              });
              setEditingReceptor(null);
            }}
            isSubmitting={updateReceptor.isPending}
          />
        )}
      </Modal>
    </div>
  );
}

export default ReceptoresPage;