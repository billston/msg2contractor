import { ChangeEvent, useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  onChange: (file: File) => void;
  label: string;
  error?: string;
}

function FileUpload({ accept = 'image/jpeg', onChange, label, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 py-4 cursor-pointer
          ${error ? 'border-red-300' : 'border-gray-300'}`}
        onClick={() => inputRef.current?.click()}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2 flex text-sm text-gray-600">
            <label className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
              <span>Subir archivo</span>
              <input
                ref={inputRef}
                type="file"
                className="sr-only"
                accept={accept}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default FileUpload;