import { useCallback, useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type ProviderModel } from '@/models';
import { ProviderCreate, ProviderTable } from '.';
import { Button } from '@/components';
import { usePermissionStore, useProviderStore } from '@/hooks';

const providerView = () => {
  const { dataProvider, getProviders, createProvider, updateProvider, deleteProvider } = useProviderStore();

  const [openDialog, setOpenDialog] = useState(false);
  const { hasPermission } = usePermissionStore();
  const [itemEdit, setItemEdit] = useState<ProviderModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  useEffect(() => {
    getProviders();
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Proveedores</h2>
        {
          hasPermission(TypeAction.create, TypeSubject.provider) &&
          <Button
            onClick={() => handleDialog(true)}
          >Nuevo Proveedor</Button>}
      </div>

      {/* Tabla de provider */}
      <ProviderTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataProvider={dataProvider}
        onRefresh={getProviders}
        onDelete={deleteProvider}
      />


      {/* Dialogo para crear o editar */}
      {openDialog && (
        <ProviderCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : { ...itemEdit }}
          onCreate={createProvider}
          onUpdate={updateProvider}
        />
      )}
    </>
  );
};

export default providerView