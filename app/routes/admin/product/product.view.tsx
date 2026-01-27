import { useCallback, useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type ProductModel } from '@/models';
import { ProductCreate, ProductTable } from '.';
import { Button } from '@/components';
import { usePermissionStore, useProductStore } from '@/hooks';

const productView = () => {
  const { dataProduct, getProducts, createProduct, updateProduct, deleteProduct } = useProductStore();

  const [openDialog, setOpenDialog] = useState(false);
  const { hasPermission } = usePermissionStore();
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
        {
          hasPermission(TypeAction.create, TypeSubject.product) &&
          <Button
            onClick={() => handleDialog(true)}
          >Nuevo Producto</Button>
        }
      </div>

      {/* Tabla de product */}
      <ProductTable
        dataProduct={dataProduct}
        onRefresh={getProducts}
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        onDelete={deleteProduct}
      />


      {/* Dialogo para crear o editar productos*/}
      {openDialog && (
        <ProductCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : { ...itemEdit }}
          image={itemEdit?.image}
          onCreate={createProduct}
          onUpdate={updateProduct}
        />
      )}
    </>
  );
};

export default productView