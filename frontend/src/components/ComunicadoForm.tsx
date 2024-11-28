import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import RichTextEditor from './RichTextEditor';
import FileUpload from './FileUpload';
import ReceptorSelector from './ReceptorSelector';
import GrupoSelector from './GrupoSelector';
import { Receptor, GrupoReceptor } from '../types';

const comunicadoSchema = z.object({
  tipoReceptor: z.number(),
  idGrupoReceptor: z.number().optional(),
  destinatario: z.string().optional(),
  asunto: z.string().min(1, 'El asunto es requerido'),
  contenido: z.string().min(1, 'El contenido es requerido'),
  fechaVencimiento: z.string().optional(),
  confirmacionRecepcion: z.boolean(),
  solicitarRespuesta: z.boolean(),
});

type ComunicadoFormData = z.infer<typeof comunicadoSchema>;

interface ComunicadoFormProps {
  onSubmit: (data: ComunicadoFormData, adjunto?: File) => void;
  initialData?: Partial<ComunicadoFormData>;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

function ComunicadoForm({
  onSubmit,
  initialData,
  isSubmitting,
  readOnly,
}: ComunicadoFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ComunicadoFormData>({
    resolver: zodResolver(comunicadoSchema),
    defaultValues: {
      tipoReceptor: 1,
      confirmacionRecepcion: false,
      solicitarRespuesta: false,
      ...initialData,
    },
  });

  const [adjunto, setAdjunto] = useState<File>();
  const tipoReceptor = watch('tipoReceptor');

  const handleReceptorSelect = (receptor: Receptor) => {
    const currentDestinatarios = watch('destinatario')?.split(';').filter(Boolean) || [];
    const newDestinatario = receptor.idReceptor.toString();
    if (!currentDestinatarios.includes(newDestinatario)) {
      setValue(
        'destinatario',
        [...currentDestinatarios, newDestinatario].join(';')
      );
    }
  };

  const handleGrupoSelect = (grupo: GrupoReceptor) => {
    setValue('idGrupoReceptor', grupo.idGrupoReceptor);
  };

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, adjunto))} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Receptor</label>
          <select
            {...register('tipoReceptor', { valueAsNumber: true })}
            disabled={readOnly}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={1}>Individual</option>
            <option value={2}>Grupo</option>
          </select>
        </div>

        <div>
          {tipoReceptor === 1 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Seleccionar Receptores
              </label>
              <ReceptorSelector onSelect={handleReceptorSelect} />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Seleccionar Grupo
              </label>
              <GrupoSelector onSelect={handleGrupoSelect} />
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="asunto" className="block text-sm font-medium text-gray-700">
          Asunto
        </label>
        <input
          type="text"
          id="asunto"
          {...register('asunto')}
          disabled={readOnly}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.asunto && (
          <p className="mt-1 text-sm text-red-600">{errors.asunto.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contenido</label>
        <Controller
          name="contenido"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              disabled={readOnly}
            />
          )}
        />
        {errors.contenido && (
          <p className="mt-1 text-sm text-red-600">{errors.contenido.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700">
          Fecha de Vencimiento
        </label>
        <input
          type="datetime-local"
          id="fechaVencimiento"
          {...register('fechaVencimiento')}
          disabled={readOnly}
          min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="confirmacionRecepcion"
            {...register('confirmacionRecepcion')}
            disabled={readOnly}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="confirmacionRecepcion"
            className="ml-2 block text-sm text-gray-900"
          >
            Requiere confirmación de recepción
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="solicitarRespuesta"
            {...register('solicitarRespuesta')}
            disabled={readOnly}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="solicitarRespuesta"
            className="ml-2 block text-sm text-gray-900"
          >
            Solicitar respuesta
          </label>
        </div>
      </div>

      {!readOnly && (
        <FileUpload
          label="Adjunto (PDF o Excel)"
          accept=".pdf,.xlsx,.xls"
          onChange={setAdjunto}
        />
      )}

      {!readOnly && (
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      )}
    </form>
  );
}

export default ComunicadoForm;