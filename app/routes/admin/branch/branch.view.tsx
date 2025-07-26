import { useCallback, useState } from 'react';
import type { BranchModel } from '@/models';
import { BranchCreate, BranchTable } from '.';
import { Button } from '@/components';
import { useBranchStore } from '@/hooks';

const branchView = () => {
  const { dataBranch, getBranches, createBranch, updateBranch, deleteBranch } = useBranchStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<BranchModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Sucursales</h2>
        <Button
          onClick={() => handleDialog(true)}
        >Nueva Sucursal</Button>
      </div>

      {/* Tabla de branch */}
      <BranchTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataBranch={dataBranch}
        onRefresh={getBranches}
        onDelete={deleteBranch}
      />

      {/* Dialogo para crear o editar */}
      {openDialog && (
        <BranchCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : itemEdit}
          onCreate={createBranch}
          onUpdate={updateBranch}
        />
      )}
    </>
  );
};

export default branchView