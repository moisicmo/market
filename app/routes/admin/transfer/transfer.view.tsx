import { useCallback, useEffect, useState } from 'react';
import { useAuthStore, useBranchStore, useTransferStore, usePermissionStore } from '@/hooks';
import { TransferTable, TransferCreate } from '.';
import { Button } from '@/components';
import { TypeAction, TypeSubject, type TransferRequest } from '@/models';

const TransferView = () => {
  const { branchSelect } = useAuthStore();
  const { dataBranch, getBranches } = useBranchStore();
  const { dataTransfers, getTransfers, createTransfer } = useTransferStore();
  const { hasPermission } = usePermissionStore();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialog = useCallback((value: boolean) => {
    setOpenDialog(value);
  }, []);

  useEffect(() => {
    getBranches(1, 100);
    getTransfers(1, 10, branchSelect?.id ?? '');
  }, []);

  const handleCreate = async (body: TransferRequest) => {
    await createTransfer(body);
    getTransfers(1, 10, branchSelect?.id ?? '');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Traspasos</h2>
        {hasPermission(TypeAction.create, TypeSubject.transfer) && (
          <Button onClick={() => handleDialog(true)}>Nuevo Traspaso</Button>
        )}
      </div>

      <TransferTable
        dataTransfers={dataTransfers}
        onRefresh={(page, limit, keys) =>
          getTransfers(page, limit, branchSelect?.id ?? '', keys)
        }
      />

      {openDialog && (
        <TransferCreate
          branches={dataBranch.data ?? []}
          currentBranchId={branchSelect?.id ?? ''}
          handleClose={() => handleDialog(false)}
          onTransferCreate={handleCreate}
        />
      )}
    </>
  );
};

export default TransferView;
