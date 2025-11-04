import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  onUpload: (file: File) => void;
}
export const ExcelUploader = (props: Props) => {

  const {
    onUpload
  } = props;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file); // Guarda archivo en estado
    } else {
      alert('Archivo inválido. Solo se permiten archivos .xlsx');
    }
  }, []);

  const handleUploadClick = () => {
    if (!selectedFile) {
      alert('Debes seleccionar un archivo primero');
      return;
    }

    console.log('Subiendo archivo:', selectedFile.name);
    onUpload(selectedFile); // Llama al callback enviado por props
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Zona de arrastre */}
      <div
        {...getRootProps()}
        className="w-full border-2 border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer hover:border-blue-500 transition"
      >
        <input {...getInputProps()} />
        {
          isDragActive
            ? <p className="text-blue-500">Suelta el archivo aquí...</p>
            : <p className="text-gray-600">Arrastra un archivo .xlsx o haz clic para seleccionarlo</p>
        }
      </div>

      {/* Nombre del archivo */}
      {selectedFile && (
        <p className="text-sm text-gray-700">
          Archivo seleccionado: <strong>{selectedFile.name}</strong>
        </p>
      )}

      {/* Botón para subir */}
      <button
        onClick={handleUploadClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Subir archivo
      </button>
    </div>
  );
};
