import { useEffect } from 'react';
import { BranchList } from '.';
import { useBranchStore, useProductStore } from '@/hooks';
import { ExcelUploader } from '@/components/drag';

const InventoryView = () => {
  const { getProducts, importXlsx } = useProductStore();
  const { getBranches, dataBranch } = useBranchStore();

  useEffect(() => {
    getBranches();
    getProducts();
  }, []);

  const handleExcelUpload = async (file: File) => {
    console.log('📦 Archivo recibido en InventoryView:', file.name);
    await importXlsx(file);
  };

  return (
    <>
      {/* Encabezado */}
      <h2 className="text-xl font-semibold text-gray-800">Inventario</h2>

      {/* Subida de Excel */}
      <div className="my-4">
        <ExcelUploader onUpload={handleExcelUpload} />
      </div>

      {/* Tabla de branch */}
      <BranchList dataBranch={dataBranch} />
    </>
  );
};

export default InventoryView;
