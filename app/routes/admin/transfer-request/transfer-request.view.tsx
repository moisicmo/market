import { useCallback, useEffect, useState } from 'react';
import { useAuthStore, useBranchStore, useTransferRequestStore, usePermissionStore } from '@/hooks';
import { TransferRequestTable } from './transfer-request.table';
import { TransferRequestCreate } from './transfer-request.create';
import { TransferRequestDispatch } from './transfer-request.dispatch';
import { TransferRequestReceive } from './transfer-request.receive';
import { TransferRequestReject } from './transfer-request.reject';
import { Button } from '@/components';
import {
  TypeAction,
  TypeSubject,
  type TransferRequestModel,
  type CreateTransferRequestBody,
  type DispatchTransferRequestBody,
  type ReceiveTransferRequestBody,
  type RejectTransferRequestBody,
} from '@/models';

const TransferRequestView = () => {
  const { branchSelect } = useAuthStore();
  const { dataBranch, getBranches } = useBranchStore();
  const { dataRequests, getRequests, createRequest, dispatchRequest, receiveRequest, rejectRequest, downloadPdf } = useTransferRequestStore();
  const { hasPermission } = usePermissionStore();

  const [openCreate, setOpenCreate] = useState(false);
  const [dispatchItem, setDispatchItem] = useState<TransferRequestModel | null>(null);
  const [receiveItem, setReceiveItem] = useState<TransferRequestModel | null>(null);
  const [rejectItem, setRejectItem] = useState<TransferRequestModel | null>(null);

  const canCreate = hasPermission(TypeAction.create, TypeSubject.transferRequest);
  const canDispatch = hasPermission(TypeAction.update, TypeSubject.transferRequest);

  useEffect(() => {
    getBranches(1, 100);
    getRequests(1, 10, branchSelect?.id ?? '');
  }, []);

  const refresh = () => getRequests(1, 10, branchSelect?.id ?? '');

  const handleCreate = async (body: CreateTransferRequestBody) => {
    await createRequest(body);
    refresh();
  };

  const handleDispatch = async (id: string, body: DispatchTransferRequestBody) => {
    await dispatchRequest(id, body);
    refresh();
  };

  const handleReceive = async (id: string, body: ReceiveTransferRequestBody) => {
    await receiveRequest(id, body);
    refresh();
  };

  const handleReject = async (id: string, body: RejectTransferRequestBody) => {
    await rejectRequest(id, body);
    refresh();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Solicitudes de Traspaso</h2>
        {canCreate && (
          <Button onClick={() => setOpenCreate(true)}>Nueva Solicitud</Button>
        )}
      </div>

      <TransferRequestTable
        dataRequests={dataRequests}
        onRefresh={(page, limit, keys) =>
          getRequests(page, limit, branchSelect?.id ?? '', keys)
        }
        onDispatch={(item) => setDispatchItem(item)}
        onReceive={(item) => setReceiveItem(item)}
        onReject={(item) => setRejectItem(item)}
        canDispatch={canDispatch}
        canCreate={canCreate}
        onDownloadPdf={(value)=> downloadPdf(value)}
      />

      {openCreate && branchSelect && (
        <TransferRequestCreate
          branches={dataBranch.data?.filter((b) => b.type === 'sucursal') ?? []}
          currentBranchId={branchSelect.id}
          handleClose={() => setOpenCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {dispatchItem && (
        <TransferRequestDispatch
          request={dispatchItem}
          handleClose={() => setDispatchItem(null)}
          onDispatch={handleDispatch}
        />
      )}

      {receiveItem && (
        <TransferRequestReceive
          request={receiveItem}
          handleClose={() => setReceiveItem(null)}
          onReceive={handleReceive}
        />
      )}

      {rejectItem && (
        <TransferRequestReject
          request={rejectItem}
          handleClose={() => setRejectItem(null)}
          onReject={handleReject}
        />
      )}
    </>
  );
};

export default TransferRequestView;
