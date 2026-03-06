import { useEffect } from 'react';
import { useAuthStore, useOrderStore } from '@/hooks';
import { OrderTable } from './order.table';

const OrderView = () => {
  const { branchSelect } = useAuthStore();
  const { dataOrders, getOrders, confirmSale, annulOrder, reprintPdf } = useOrderStore();

  useEffect(() => {
    getOrders(1, 10, branchSelect?.id ?? '');
  }, []);

  const handleConfirm = async (id: string) => {
    await confirmSale(id);
    getOrders(1, 10, branchSelect?.id ?? '');
  };

  const handleAnnul = async (id: string) => {
    await annulOrder(id);
    getOrders(1, 10, branchSelect?.id ?? '');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Órdenes y Ventas</h2>
      </div>

      <OrderTable
        dataOrders={dataOrders}
        onRefresh={(page, limit, keys, status) => getOrders(page, limit, branchSelect?.id ?? '', keys, status)}
        onConfirm={handleConfirm}
        onAnnul={handleAnnul}
        onReprintPdf={reprintPdf}
      />
    </>
  );
};

export default OrderView;
