import { useCallback, useEffect, useState } from 'react';
import type { ProductModel, ProductPresentationModel } from '@/models';
import { ProductCreate, ProductPresentationCreate, ProductTable } from '.';
import { Button } from '@/components';
import { useProductPresentationStore, useProductStore } from '@/hooks';

const productView = () => {
  const { dataProduct, getProducts, createProduct, updateProduct, deleteProduct } = useProductStore();
  const { deleteProductPresentation } = useProductPresentationStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<ProductModel | null>(null);

  const [openDialogPresentation, setOpenDialogPresentation] = useState(false);
  const [presentationEdit, setPresentationEdit] = useState<ProductPresentationModel | null>(null);
  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialogPresentation(value);
  }, []);

  const handleDialogPresentation = useCallback((value: boolean) => {
    if (!value) setPresentationEdit(null);
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
        dataProduct={dataProduct}
        onRefresh={getProducts}
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        onDelete={deleteProduct}
        handleEditPresentation={(v) => { }}
        onDeletePresentation={deleteProductPresentation}
        onCreatePresentation={() => handleDialogPresentation(true)}
      />


      {/* Dialogo para crear o editar productos*/}
      {openDialog && (
        <ProductCreate
        open={openDialog}
        handleClose={() => handleDialog(false)}
        item={itemEdit == null ? null : { ...itemEdit }}
        onCreate={createProduct}
        onUpdate={updateProduct}
        />
      )}

      {/* Dialogo para crear o editar presentaciones*/}
      {
        openDialogPresentation && (
          <ProductPresentationCreate
            open={openDialog}
            handleClose={() => handleDialog(false)}
            item={presentationEdit == null ? null : { ...presentationEdit }}
            onCreate={createProduct}
            onUpdate={updateProduct}
          />
        )
      }
    </>
  );
};

export default productView