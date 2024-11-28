import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RichTextEditor from './RichTextEditor';
import FileUpload from './FileUpload';

const respuestaSchema = z.object({
  respuesta: z.string().min(1, 'La respuesta es requerida'),
});

type RespuestaFormData = z.infer<typeof respuestaSchema>;

interface RespuestaFormProps {
  onSubmit: (data: RespuestaFormData, adjunto?: File) => void;
  isSubmitting?: boolean;
}

function RespuestaForm({ onSubmit, isSubmitting }: RespuestaFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RespuestaFormData>({
    resolver: zodResolver(respuestaSchema),
    defaultValues: {
      respuesta: '',
    },
  });

  const [adjunto, setAdjunto] = useState<File>();

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, adjunto))} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Respuesta</label>
        <Controller
          name="respuesta"
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.respuesta && (
          <p className="mt-1 text-sm text-red-600">{errors.respuesta.message}</p>
        )}
      </div>

      <FileUpload
        label="Adjunto (PDF o Excel)"
        accept=".pdf,.xlsx,.xls"
        onChange={setAdjunto}
      />

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
        </button>
      </div>
    </form>
  );
}

export default RespuestaForm;