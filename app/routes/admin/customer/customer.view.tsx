import { useCallback, useState } from 'react';
import type { CustomerModel } from '@/models';
import { CustomerCreate, CustomerTable } from '.';
import { Button } from '@/components';
import { useCustomerStore } from '@/hooks';

const customerView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<CustomerModel | null>(null);
  const { dataCustomer, getCustomers, createCustomer, updateCustomer, deleteCustomer } = useCustomerStore();

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Customeres</h2>
        <Button
          onClick={() => handleDialog(true)}
        >Nuevo customer</Button>
      </div>

      {/* Tabla de teacher */}
      <CustomerTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataCustomer={dataCustomer}
        onRefresh={getCustomers}
        onDelete={deleteCustomer}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <CustomerCreate
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : itemEdit}
          onCreate={createCustomer}
          onUpdate={updateCustomer}
        />
      )}
    </>
  );
};

export default customerView