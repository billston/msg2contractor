import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FileUpload from './FileUpload';

const receptorSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombreCompleto: z.string().min(1, 'El nombre completo es requerido'),
  correoElectronico: z.string().email('Correo electrónico inválido'),
});

type ReceptorFormData = z.infer<typeof receptorSchema>;

interface ReceptorFormProps {
  onSubmit: (data: ReceptorFormData, firma?: File) => void;
  initialData?: Partial<ReceptorFormData>;
  isSubmitting?: boolean;
}

function ReceptorForm({ onSubmit, initialData, isSubmitting }: ReceptorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReceptorFormData>({
    resolver: zodResolver(receptorSchema),
    defaultValues: initialData,
  });

  const [firma, setFirma] = useState<File>();

  const onSubmitForm = (data: ReceptorFormData) => {
    onSubmit(data, firma);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
          Código
        </label>
        <input
          type="text"
          id="codigo"
          {...register('codigo')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            ${errors.codigo ? 'border-red-300' : ''}`}
        />
        {errors.codigo && (
          <p className="mt-1 text-sm text-red-600">{errors.codigo.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">
          Nombre Completo
        </label>
        <input
          type="text"
          id="nombreCompleto"
          {...register('nombreCompleto')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            ${errors.nombreCompleto ? 'border-red-300' : ''}`}
        />
        {errors.nombreCompleto && (
          <p className="mt-1 text-sm text-red-600">{errors.nombreCompleto.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="correoElectronico" className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="correoElectronico"
          {...register('correoElectronico')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
            ${errors.correoElectronico ? 'border-red-300' : ''}`}
        />
        {errors.correoElectronico && (
          <p className="mt-1 text-sm text-red-600">{errors.correoElectronico.message}</p>
        )}
      </div>

      <FileUpload
        label="Firma (JPG)"
        accept="image/jpeg"
        onChange={setFirma}
      />

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

export default ReceptorForm;