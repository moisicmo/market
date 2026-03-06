import { useCallback, useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type PurchaseRequest } from '@/models';
import { PurchaseTable } from '.';
import { PurchaseCreate } from './purchase.create';
import { Button } from '@/components';
import { useAuthStore, useKardexStore, usePermissionStore, usePurchaseStore } from '@/hooks';

const PurchaseView = () => {
  const { branchSelect } = useAuthStore();
  const { dataKardexProduct, getKardexByBranchId, updatePresentations } = useKardexStore();
  const { dataPurchase, getPurchases, createPurchase, reprintPdf } = usePurchaseStore();
  const { hasPermission } = usePermissionStore();

  const [openDialog, setOpenDialog] = useState(false);

  const handleDialog = useCallback((value: boolean) => {
    setOpenDialog(value);
  }, []);

  const handleCreatePurchase = async (body: PurchaseRequest) => {
    const movements = await createPurchase(body);
    updatePresentations(movements);
    getPurchases(1, 10, '', branchSelect?.id ?? '');
  };

  useEffect(() => {
    getPurchases(1, 10, '', branchSelect?.id ?? '');
    if (branchSelect) {
      getKardexByBranchId(branchSelect.id);
    }
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Compras</h2>
        {hasPermission(TypeAction.create, TypeSubject.purchase) && (
          <Button onClick={() => handleDialog(true)}>Nueva Compra</Button>
        )}
      </div>

      <PurchaseTable
        dataPurchase={dataPurchase}
        onRefresh={(page, limit, keys) => getPurchases(page, limit, keys, branchSelect?.id ?? '')}
        onReprintPdf={reprintPdf}
      />

      {openDialog && branchSelect && (
        <PurchaseCreate
          branchId={branchSelect.id}
          dataKardex={dataKardexProduct.data}
          handleClose={() => handleDialog(false)}
          onPurchaseCreate={handleCreatePurchase}
        />
      )}
    </>
  );
};

export default PurchaseView;
