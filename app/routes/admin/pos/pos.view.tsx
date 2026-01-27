import { useEffect } from 'react';;
import { ProductTable } from '.';
import { useAuthStore, useKardexStore } from '@/hooks';

const posView = () => {
  const { branchSelect } = useAuthStore();
  const { dataKardexProduct, getKardexByBranchId } = useKardexStore();

  useEffect(() => {
    if (branchSelect) {
      getKardexByBranchId(branchSelect.id);
    }
  }, []);

  return (
    <>
      {/* Encabezado */}
      <h2 className="text-xl font-semibold text-gray-800">Punto de venta</h2>
      {/* Tabla de branch */}
      {
        branchSelect &&
        <ProductTable
          dataKardex={dataKardexProduct}
        />
      }
    </>
  );
};

export default posView;