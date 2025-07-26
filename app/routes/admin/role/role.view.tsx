import { useCallback, useState } from 'react';
import type { RoleModel } from '@/models';
import { RoleCreate, RoleTable } from '.';
import { Button } from '@/components';
import { useRoleStore } from '@/hooks';

const roleView = () => {
    const { dataRole, getRoles,createRole, updateRole, deleteRole } = useRoleStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<RoleModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
        <Button
          onClick={() => handleDialog(true)}
        >Nuevo Rol</Button>
      </div>

      {/* Tabla de role */}
      <RoleTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataRole={dataRole}
        onRefresh={getRoles}
        onDelete={deleteRole}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <RoleCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : { ...itemEdit }}
          onCreate={createRole}
          onUpdate={updateRole}
        />
      )}
    </>
  );
};

export default roleView;