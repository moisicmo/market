import { useEffect } from 'react';
import { ProductTable } from '.';
import { useAuthStore, useKardexStore, usePermissionStore, useProductStore, useTransferStore } from '@/hooks';
import { ExcelUploader } from '@/components/drag';
import { useInputStore } from '@/hooks/useInputStore';
import { TypeAction, TypeSubject, type InputRequest, type TransferRequest } from '@/models';

const InventoryView = () => {
  const { importXlsx } = useProductStore();
  const { branchSelect } = useAuthStore();
  const { dataKardexProduct, getKardexByBranchId, updatePresentations } = useKardexStore();
  const { createInput } = useInputStore();
  const { hasPermission } = usePermissionStore();
  const { createTransfer } = useTransferStore();



  const handleExcelUpload = async (file: File) => {
    console.log('📦 Archivo recibido en InventoryView:', file.name);
    await importXlsx(file);
  };


  const handleCreateInput = async (inputRequest: InputRequest) => {
    const moviments = await createInput(inputRequest);
    updatePresentations(moviments);
  }


  const handleCreateTransfer = async (transferRequest: TransferRequest) => {
    const transfers = await createTransfer(transferRequest);

    // Agrupamos todos los movimientos
    const allMovements = transfers.map(element => ({
      stock: element.from.stock,
      output: element.from.output,
      input: null,
    }));

    // Una sola actualización final
    updatePresentations(allMovements);
  };

  useEffect(() => {
    if (branchSelect != null) {
      getKardexByBranchId(branchSelect.id);
    }
  }, [])


  return (
    <>
      {/* Encabezado */}
      <h2 className="text-xl font-semibold text-gray-800">Inventario</h2>

      {/* Subida de Excel */}
      {
        hasPermission(TypeAction.create, TypeSubject.input) &&
        <div className="my-4">
          <ExcelUploader onUpload={handleExcelUpload} />
        </div>}

      {/* Tabla de branch */}
      {branchSelect && <ProductTable
        branchId={branchSelect.id}
        dataKardex={dataKardexProduct}
        onInputCreate={handleCreateInput}
        onTransferCreate={handleCreateTransfer}
      />}
    </>
  );
};

export default InventoryView;
