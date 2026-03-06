import { useEffect } from 'react';
import { useAuthStore, useSaleDebtStore } from '@/hooks';
import { SaleDebtTable } from '@/routes/admin/sale-debt';

const AccountsReceivableView = () => {
  const { branchSelect } = useAuthStore();
  const { dataSaleDebts, getSaleDebts, addPayment } = useSaleDebtStore();

  useEffect(() => {
    getSaleDebts(1, 10, branchSelect?.id ?? '', '', '');
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Cuentas por Cobrar</h2>
      </div>

      <SaleDebtTable
        dataSaleDebts={dataSaleDebts}
        branchId={branchSelect?.id ?? ''}
        onRefresh={(page, limit, branchId, keys, status) =>
          getSaleDebts(page, limit, branchId, keys, status)
        }
        onPay={addPayment}
      />
    </>
  );
};

export default AccountsReceivableView;
