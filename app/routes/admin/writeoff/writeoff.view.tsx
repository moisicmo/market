import { useCallback, useEffect, useState } from 'react';
import { useAuthStore, useWriteoffStore, useKardexStore, usePermissionStore } from '@/hooks';
import { WriteoffTable, WriteoffCreate } from '.';
import { Button } from '@/components';
import { TypeAction, TypeSubject, type WriteoffRequest } from '@/models';

const WriteoffView = () => {
  const { branchSelect } = useAuthStore();
  const { dataWriteoffs, getWriteoffs, createWriteoff } = useWriteoffStore();
  const { dataKardexProduct, getKardexByBranchId } = useKardexStore();
  const { hasPermission } = usePermissionStore();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialog = useCallback((value: boolean) => {
    setOpenDialog(value);
  }, []);

  useEffect(() => {
    if (branchSelect) {
      getWriteoffs(1, 10, branchSelect.id);
      getKardexByBranchId(branchSelect.id, 1, 200);
    }
  }, []);

  const handleCreate = async (body: WriteoffRequest) => {
    await createWriteoff(body);
    getWriteoffs(1, 10, branchSelect?.id ?? '');
    getKardexByBranchId(branchSelect!.id, 1, 200);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Bajas</h2>
        {hasPermission(TypeAction.create, TypeSubject.writeoff) && (
          <Button onClick={() => handleDialog(true)}>Nueva baja</Button>
        )}
      </div>

      <WriteoffTable
        dataWriteoffs={dataWriteoffs}
        onRefresh={(page, limit, keys) =>
          getWriteoffs(page, limit, branchSelect?.id ?? '', keys)
        }
      />

      {openDialog && (
        <WriteoffCreate
          branchId={branchSelect?.id ?? ''}
          dataKardex={dataKardexProduct.data.filter((k) => k.stock > 0)}
          handleClose={() => handleDialog(false)}
          onWriteoffCreate={handleCreate}
        />
      )}
    </>
  );
};

export default WriteoffView;
