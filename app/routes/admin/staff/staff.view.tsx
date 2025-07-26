import { useCallback, useState } from 'react';
import type { StaffModel } from '@/models';
import { StaffCreate, StaffTable } from '.';
import { Button } from '@/components';
import { useStaffStore } from '@/hooks';

const staffView = () => {
  const { dataStaff, getStaffs, createStaff, updateStaff, deleteStaff } = useStaffStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<StaffModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Staffs</h2>
        <Button
          onClick={() => handleDialog(true)}
        >Nuevo staff</Button>
      </div>

      {/* Tabla de staff */}
      <StaffTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataStaff={dataStaff}
        onRefresh={getStaffs}
        onDelete={deleteStaff}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <StaffCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : itemEdit}
          onCreate={createStaff}
          onUpdate={updateStaff}
        />
      )}
    </>
  );
};

export default staffView