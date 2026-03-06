import { useEffect } from 'react';
import { useAuthStore, usePurchaseStore } from '@/hooks';
import { PurchasePayables } from '@/routes/admin/purchase';

const AccountsPayableView = () => {
  const { branchSelect } = useAuthStore();
  const { dataPayables, getPayables, payInstallment } = usePurchaseStore();

  useEffect(() => {
    getPayables(1, 10, branchSelect?.id ?? '', '', '');
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Cuentas por Pagar</h2>
      </div>

      <PurchasePayables
        dataPayables={dataPayables}
        branchId={branchSelect?.id ?? ''}
        onRefresh={(page, limit, branchId, keys, status) =>
          getPayables(page, limit, branchId, keys, status)
        }
        onPay={payInstallment}
      />
    </>
  );
};

export default AccountsPayableView;
