import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Eye, CheckCircle, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../config/api';
import { Notificacion } from '../types';
import Modal from '../components/Modal';
import RespuestaForm from '../components/RespuestaForm';
import { useNotificaciones } from '../hooks/useNotificaciones';

function NotificacionesPage() {
  const [searchParams, setSearchParams] = useState({
    fechaEmisionInicio: '',
    fechaEmisionFin: '',
    fechaRecepcion: '',
    fechaRespuesta: '',
    asuntoComunicado: '',
    nombreReceptor: '',
  });
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null);
  const [isRespuestaModalOpen, setIsRespuestaModalOpen] = useState(false);

  const { data: notificaciones, isLoading } = useQuery({
    queryKey: ['notificaciones', searchParams],
    queryFn: async () => {
      const response = await api.get<Notificacion[]>('/notificaciones', {
        params: searchParams,
      });
      return response.data;
    },
    enabled: !!searchParams.fechaEmisionInicio && !!searchParams.fechaEmisionFin,
  });

  const { confirmarRecepcion, responderNotificacion } = useNotificaciones();

  const handleConfirmarRecepcion = async (id: number) => {
    if (window.confirm('¿Está seguro de confirmar la recepción?')) {
      await confirmarRecepcion.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Notificaciones</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha Emisión Desde *
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
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha Emisión Hasta *
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
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha Recepción
          </label>
          <input
            type="date"
            value={searchParams.fechaRecepcion}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                fechaRecepcion: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha Respuesta
          </label>
          <input
            type="date"
            value={searchParams.fechaRespuesta}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                fechaRespuesta: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Asunto del Comunicado
          </label>
          <input
            type="text"
            value={searchParams.asuntoComunicado}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                asuntoComunicado: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Buscar por asunto..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Receptor
          </label>
          <input
            type="text"
            value={searchParams.nombreReceptor}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...prev,
                nombreReceptor: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Buscar por nombre..."
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
                      Comunicado
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Receptor
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Fecha Emisión
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Fecha Recepción
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
                      <td colSpan={6} className="text-center py-4">
                        Cargando...
                      </td>
                    </tr>
                  ) : !notificaciones?.length ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No se encontraron notificaciones
                      </td>
                    </tr>
                  ) : (
                    notificaciones?.map((notificacion) => (
                      <tr key={notificacion.idNotificacion}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {notificacion.comunicado?.asunto}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {notificacion.receptor?.nombreCompleto}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(new Date(notificacion.fechaEmision), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {notificacion.fechaRecepcion
                            ? format(new Date(notificacion.fechaRecepcion), 'dd/MM/yyyy HH:mm')
                            : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {notificacion.idEstadoNotificacion === 1
                            ? 'Emitido'
                            : notificacion.idEstadoNotificacion === 2
                            ? 'Recibido'
                            : 'Respondido'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm space-x-2">
                          <button
                            onClick={() => setSelectedNotificacion(notificacion)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {notificacion.idEstadoNotificacion === 1 && (
                            <button
                              onClick={() =>
                                handleConfirmarRecepcion(notificacion.idNotificacion)
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {notificacion.idEstadoNotificacion === 2 &&
                            notificacion.comunicado?.solicitarRespuesta && (
                              <button
                                onClick={() => {
                                  setSelectedNotificacion(notificacion);
                                  setIsRespuestaModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <MessageCircle className="h-4 w-4" />
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
        isOpen={!!selectedNotificacion && !isRespuestaModalOpen}
        onClose={() => setSelectedNotificacion(null)}
        title="Ver Notificación"
      >
        {selectedNotificacion && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {selectedNotificacion.comunicado?.asunto}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enviado el{' '}
                {format(
                  new Date(selectedNotificacion.fechaEmision),
                  'dd/MM/yyyy HH:mm'
                )}
              </p>
            </div>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: selectedNotificacion.comunicado?.contenido || '',
              }}
            />
            {selectedNotificacion.respuesta && (
              <>
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900">Respuesta</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Respondido el{' '}
                    {format(
                      new Date(selectedNotificacion.fechaRespuesta!),
                      'dd/MM/yyyy HH:mm'
                    )}
                  </p>
                </div>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: selectedNotificacion.respuesta,
                  }}
                />
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isRespuestaModalOpen}
        onClose={() => {
          setIsRespuestaModalOpen(false);
          setSelectedNotificacion(null);
        }}
        title="Responder Notificación"
      >
        {selectedNotificacion && (
          <RespuestaForm
            onSubmit={async (data, adjunto) => {
              await responderNotificacion.mutateAsync({
                id: selectedNotificacion.idNotificacion,
                data,
                adjunto,
              });
              setIsRespuestaModalOpen(false);
              setSelectedNotificacion(null);
            }}
            isSubmitting={responderNotificacion.isPending}
          />
        )}
      </Modal>
    </div>
  );
}

export default NotificacionesPage;