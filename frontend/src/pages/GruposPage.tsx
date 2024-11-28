import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Pencil, Trash2, UserPlus } from 'lucide-react';
import { api } from '../config/api';
import { GrupoReceptor, Receptor } from '../types';
import Modal from '../components/Modal';
import GrupoForm from '../components/GrupoForm';
import MiembrosTable from '../components/MiembrosTable';
import ReceptorSelector from '../components/ReceptorSelector';
import { useGrupos } from '../hooks/useGrupos';
import toast from 'react-hot-toast';

function GruposPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<GrupoReceptor | null>(null);
  const [selectedGrupo, setSelectedGrupo] = useState<GrupoReceptor | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const { data: grupos, isLoading } = useQuery({
    queryKey: ['grupos', searchTerm],
    queryFn: async () => {
      const response = await api.get<GrupoReceptor[]>('/grupos', {
        params: { search: searchTerm },
      });
      return response.data;
    },
  });

  const { createGrupo, updateGrupo, deleteGrupo, addMiembro } = useGrupos();

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este grupo?')) {
      try {
        await deleteGrupo.mutateAsync(id);
      } catch (error) {
        // Error handling is done in the mutation
      }
    }
  };

  const handleAddMember = async (receptor: Receptor) => {
    if (selectedGrupo) {
      await addMiembro.mutateAsync({
        grupoId: selectedGrupo.idGrupoReceptor,
        data: { idReceptor: receptor.idReceptor },
      });
      setIsAddMemberModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Grupos</h1>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Grupo
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
            placeholder="Buscar por nombre..."
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
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Nombre
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={2} className="text-center py-4">
                        Cargando...
                      </td>
                    </tr>
                  ) : grupos?.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center py-4">
                        No se encontraron grupos
                      </td>
                    </tr>
                  ) : (
                    grupos?.map((grupo) => (
                      <tr key={grupo.idGrupoReceptor}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {grupo.nombre}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm space-x-2">
                          <button
                            onClick={() => {
                              setSelectedGrupo(grupo);
                              setIsAddMemberModalOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <UserPlus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingGrupo(grupo)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(grupo.idGrupoReceptor)}
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

      {selectedGrupo && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Miembros de {selectedGrupo.nombre}
          </h2>
          <MiembrosTable grupoId={selectedGrupo.idGrupoReceptor} />
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Grupo"
      >
        <GrupoForm
          onSubmit={async (data) => {
            await createGrupo.mutateAsync(data);
            setIsCreateModalOpen(false);
          }}
          isSubmitting={createGrupo.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingGrupo}
        onClose={() => setEditingGrupo(null)}
        title="Editar Grupo"
      >
        {editingGrupo && (
          <GrupoForm
            initialData={editingGrupo}
            onSubmit={async (data) => {
              await updateGrupo.mutateAsync({
                id: editingGrupo.idGrupoReceptor,
                data,
              });
              setEditingGrupo(null);
            }}
            isSubmitting={updateGrupo.isPending}
          />
        )}
      </Modal>

      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Agregar Miembro"
      >
        <ReceptorSelector
          onSelect={handleAddMember}
          excludeIds={[]} // TODO: Add current member IDs
        />
      </Modal>
    </div>
  );
}

export default GruposPage;