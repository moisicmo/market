import { useEffect } from 'react';;
import { BranchList } from '.';
import { useBranchStore, useProductStore } from '@/hooks';

const inventoryView = () => {
  const { getProducts } = useProductStore();
  const { getBranches, dataBranch } = useBranchStore();

  useEffect(() => {
    getBranches();
    getProducts();
  }, []);

  return (
    <>
      {/* Encabezado */}
      <h2 className="text-xl font-semibold text-gray-800">Inventario</h2>

      {/* Tabla de branch */}
      <BranchList
        dataBranch={dataBranch}
      />
    </>
  );
};

export default inventoryView