import { Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../config/api';
import { Receptor } from '../types';
import { useGrupos } from '../hooks/useGrupos';

interface MiembrosTableProps {
  grupoId: number;
}

function MiembrosTable({ grupoId }: MiembrosTableProps) {
  const { data: miembros, isLoading } = useQuery({
    queryKey: ['grupos', grupoId, 'miembros'],
    queryFn: async () => {
      const response = await api.get<Receptor[]>(`/grupos/${grupoId}/miembros`);
      return response.data;
    },
  });

  const { removeMiembro } = useGrupos();

  const handleRemove = async (miembroId: number) => {
    if (window.confirm('¿Está seguro de eliminar este miembro del grupo?')) {
      await removeMiembro.mutateAsync({ grupoId, miembroId });
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Cargando miembros...</div>;
  }

  if (!miembros?.length) {
    return <div className="text-center py-4">No hay miembros en este grupo</div>;
  }

  return (
    <div className="mt-4">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
              Código
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Nombre
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Correo
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {miembros.map((miembro) => (
            <tr key={miembro.idReceptor}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                {miembro.codigo}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {miembro.nombreCompleto}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {miembro.correoElectronico}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <button
                  onClick={() => handleRemove(miembro.idReceptor)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MiembrosTable;