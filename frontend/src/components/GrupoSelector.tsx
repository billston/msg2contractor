import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { api } from '../config/api';
import { GrupoReceptor } from '../types';

interface GrupoSelectorProps {
  onSelect: (grupo: GrupoReceptor) => void;
}

function GrupoSelector({ onSelect }: GrupoSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: grupos, isLoading } = useQuery({
    queryKey: ['grupos', searchTerm],
    queryFn: async () => {
      const response = await api.get<GrupoReceptor[]>('/grupos', {
        params: { search: searchTerm },
      });
      return response.data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Buscar grupo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-60 overflow-auto">
        {isLoading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : !grupos?.length ? (
          <div className="text-center py-4">No se encontraron grupos</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {grupos.map((grupo) => (
              <li
                key={grupo.idGrupoReceptor}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(grupo)}
              >
                <div className="font-medium">{grupo.nombre}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default GrupoSelector;