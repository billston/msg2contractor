import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Eye, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../config/api';
import { Comunicado } from '../types';
import Modal from '../components/Modal';
import ComunicadoForm from '../components/ComunicadoForm';
import { useComunicados } from '../hooks/useComunicados';

function ComunicadosPage() {
  const [searchParams, setSearchParams] = useState({
    fechaEmisionInicio: '',
    fechaEmisionFin: '',
    tipoReceptor: '',
    estado: '',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingComunicado, setViewingComunicado] = useState<Comunicado | null>(null);

  const { data: comunicados, isLoading } = useQuery({
    queryKey: ['comunicados', searchParams],
    queryFn: async () => {
      const response = await api.get<Comunicado[]>('/comunicados', {
        params: searchParams,
      });
      return response.data;
    },
  });

  const { createComunicado, confirmarComunicado } = useComunicados();

  const handleConfirmar = async (id: number) => {
    if (window.confirm('¿Está seguro de confirmar este comunicado?')) {
      await confirmarComunicado.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Comunicados</h1>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Comunicado
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha Emisión Desde
          </label>
          <input
            type="date"
            value={searchParams.fechaEmisionInicio}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                fechaEmisionInicio: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha Emisión Hasta
          </label>
          <input
            type="date"
            value={searchParams.fechaEmisionFin}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                fechaEmisionFin: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo Receptor
          </label>
          <select
            value={searchParams.tipoReceptor}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                tipoReceptor: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Todos</option>
            <option value="1">Individual</option>
            <option value="2">Grupo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            value={searchParams.estado}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                estado: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Todos</option>
            <option value="1">Borrador</option>
            <option value="2">Confirmado</option>
          </select>
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
                      Asunto
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tipo
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Fecha Emisión
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Estado
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        Cargando...
                      </td>
                    </tr>
                  ) : comunicados?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No se encontraron comunicados
                      </td>
                    </tr>
                  ) : (
                    comunicados?.map((comunicado) => (
                      <tr key={comunicado.idComunicado}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {comunicado.asunto}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {comunicado.tipoReceptor === 1 ? 'Individual' : 'Grupo'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {comunicado.fechaEmision
                            ? format(new Date(comunicado.fechaEmision), 'dd/MM/yyyy HH:mm')
                            : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {comunicado.idEstadoComunicado === 1 ? 'Borrador' : 'Confirmado'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm space-x-2">
                          <button
                            onClick={() => setViewingComunicado(comunicado)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {comunicado.idEstadoComunicado === 1 && (
                            <button
                              onClick={() => handleConfirmar(comunicado.idComunicado)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
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
        title="Nuevo Comunicado"
      >
        <ComunicadoForm
          onSubmit={async (data, adjunto) => {
            await createComunicado.mutateAsync({ data, adjunto });
            setIsCreateModalOpen(false);
          }}
          isSubmitting={createComunicado.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!viewingComunicado}
        onClose={() => setViewingComunicado(null)}
        title="Ver Comunicado"
      >
        {viewingComunicado && (
          <ComunicadoForm initialData={viewingComunicado} readOnly />
        )}
      </Modal>
    </div>
  );
}

export default ComunicadosPage;