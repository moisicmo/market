import { useCallback, useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BrandModel } from '@/models';
import { BrandCreate, BrandTable } from '.';
import { Button } from '@/components';
import { useBrandStore, usePermissionStore } from '@/hooks';

const brandView = () => {
  const { dataBrand, getBrands, createBrand, updateBrand, deleteBrand } = useBrandStore();

  const [openDialog, setOpenDialog] = useState(false);
  const { hasPermission } = usePermissionStore();
  const [itemEdit, setItemEdit] = useState<BrandModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  useEffect(() => {
    getBrands();
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Marcas</h2>
        {
          hasPermission(TypeAction.create, TypeSubject.brand) &&
          <Button
            onClick={() => handleDialog(true)}
          >Nueva Marca</Button>
        }
      </div>

      {/* Tabla de brand */}
      <BrandTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataBrand={dataBrand}
        onRefresh={getBrands}
        onDelete={deleteBrand}
      />


      {/* Dialogo para crear o editar */}
      {openDialog && (
        <BrandCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : { ...itemEdit }}
          onCreate={createBrand}
          onUpdate={updateBrand}
        />
      )}
    </>
  );
};

export default brandView