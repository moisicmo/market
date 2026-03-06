import { useCallback, useEffect, useState } from 'react';
import { TypeSubject } from '@/models';
import { SaleDebtTable } from '.';
import { useAuthStore, usePermissionStore, useSaleDebtStore } from '@/hooks';

const SaleDebtView = () => {
  const { branchSelect } = useAuthStore();
  const { dataSaleDebts, getSaleDebts, addPayment } = useSaleDebtStore();
  const { hasPermission } = usePermissionStore();

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

export default SaleDebtView;
