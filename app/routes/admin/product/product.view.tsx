import { useCallback, useEffect, useState } from 'react';
import type { ProductModel } from '@/models';
import { ProductCreate, ProductTable } from '.';
import { Button } from '@/components';
import { useProductStore } from '@/hooks';

const productView = () => {
    const { dataProduct, getProducts, createProduct, updateProduct, deleteProduct } = useProductStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<ProductModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Productos</h2>
        <Button
          onClick={() => handleDialog(true)}
        >Nuevo Producto</Button>
      </div>

      {/* Tabla de product */}
      <ProductTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataProduct={dataProduct}
        onRefresh={getProducts}
        onDelete={deleteProduct}
      />


      {/* Dialogo para crear o editar */}
      {openDialog && (
        <ProductCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : { ...itemEdit }}
          onCreate={createProduct}
          onUpdate={updateProduct}
        />
      )}
    </>
  );
};

export default productView