import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const grupoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
});

type GrupoFormData = z.infer<typeof grupoSchema>;

interface GrupoFormProps {
  onSubmit: (data: GrupoFormData) => void;
  initialData?: Partial<GrupoFormData>;
  isSubmitting?: boolean;
}

function GrupoForm({ onSubmit, initialData, isSubmitting }: GrupoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GrupoFormData>({
    resolver: zodResolver(grupoSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre del Grupo
        </label>
        <input
          type="text"
          id="nombre"
          {...register('nombre')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            ${errors.nombre ? 'border-red-300' : ''}`}
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
        )}
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}

export default GrupoForm;