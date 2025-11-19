import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  initialImageUrl?: string;
  onUpload: (file: File) => void;
  maxSize?: number; // en bytes
  acceptedFormats?: string[];
}

export const ImageUploader = (props: Props) => {
  const {
    initialImageUrl,
    onUpload,
    maxSize = 5 * 1024 * 1024, // 5MB por defecto
    acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  } = props;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file) {
      // Validar tipo de archivo
      if (!acceptedFormats.includes(file.type)) {
        alert('Formato de imagen no válido. Formatos aceptados: JPEG, PNG, GIF, WebP');
        return;
      }

      // Validar tamaño
      if (file.size > maxSize) {
        alert(`El archivo es demasiado grande. Tamaño máximo: ${maxSize / 1024 / 1024}MB`);
        return;
      }

      setSelectedFile(file);
      onUpload(file);
      // Crear URL para vista previa
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  }, [acceptedFormats, maxSize, onUpload]);

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se active el dropzone al hacer clic en el botón
    setSelectedFile(null);
    setPreviewUrl(null); // Limpiar previewUrl también
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Liberar memoria
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
  });

  // Determinar qué imagen mostrar
  const displayImageUrl = previewUrl || initialImageUrl;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      {/* Zona de arrastre con vista previa integrada */}
      <div
        {...getRootProps()}
        className="w-full border-2 border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer hover:border-blue-500 transition min-h-[200px] flex items-center justify-center relative"
      >
        <input {...getInputProps()} />

        {displayImageUrl ? (
          // Vista cuando hay imagen cargada (nueva o inicial)
          <div className="relative w-full h-full">
            <img
              src={displayImageUrl}
              alt="Vista previa"
              className="max-w-full max-h-48 rounded-lg object-contain mx-auto"
            />
            <div className="absolute inset-0 transition-all rounded-lg flex items-center justify-center">
              <p className="text-blue-500 font-medium opacity-0 hover:opacity-100 transition-opacity bg-white bg-opacity-90 px-3 py-1 rounded">
                Haz clic para cambiar la imagen
              </p>
            </div>
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition z-10"
              type="button"
            >
              ×
            </button>
          </div>
        ) : (
          // Vista cuando no hay imagen (estado inicial)
          <div className="text-gray-600">
            {isDragActive ? (
              <p className="text-blue-500">Suelta la imagen aquí...</p>
            ) : (
              <div>
                <p>Arrastra una imagen o haz clic para seleccionarla</p>
                <p className="text-sm mt-2">Formatos: JPEG, PNG, GIF, WebP</p>
                <p className="text-sm">Máx: {maxSize / 1024 / 1024}MB</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Información del archivo */}
      {selectedFile && (
        <div className="text-center">
          <p className="text-sm text-gray-700">
            Archivo seleccionado: <strong>{selectedFile.name}</strong>
          </p>
          <p className="text-xs text-gray-500">
            Tamaño: {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {/* Mostrar que es una imagen existente */}
      {initialImageUrl && !selectedFile && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Imagen actual del producto
          </p>
        </div>
      )}
    </div>
  );
};