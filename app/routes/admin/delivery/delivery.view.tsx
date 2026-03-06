import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle2, Wifi, WifiOff, Package } from 'lucide-react';
import { useAuthStore, useDeliverySocket } from '@/hooks';
import { Button } from '@/components';
import type { OrderModel } from '@/models';

const DeliveryCard = ({
  order,
  onDeliver,
}: {
  order: OrderModel;
  onDeliver: (id: string) => void;
}) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden">
    {/* Header */}
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex justify-between items-start">
      <div>
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Orden</p>
        <p className="text-sm font-bold text-gray-800 truncate max-w-[160px]">#{order.id.slice(-8).toUpperCase()}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">
          {format(new Date(order.updatedAt), 'HH:mm', { locale: es })}
        </p>
        <p className="text-xs text-gray-400">
          {format(new Date(order.updatedAt), 'dd/MM/yyyy', { locale: es })}
        </p>
      </div>
    </div>

    {/* Info */}
    <div className="px-4 pt-3 pb-2 space-y-1">
      <p className="text-sm text-gray-700">
        <span className="font-medium">Cliente:</span>{' '}
        {order.customer.user.name} {order.customer.user.lastName ?? ''}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-medium">Sucursal:</span> {order.branch.name}
      </p>
    </div>

    {/* Products */}
    <div className="px-4 pb-3 flex-1">
      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Productos</p>
      <ul className="space-y-1">
        {order.outputs.map((output) => (
          <li key={output.id} className="flex justify-between text-sm">
            <span className="text-gray-800">{output.product.name}</span>
            <span className="font-semibold text-gray-600 ml-2">x{output.quantity}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Footer */}
    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
      <Button
        className="w-full justify-center gap-2"
        onClick={() => onDeliver(order.id)}
      >
        <CheckCircle2 className="w-4 h-4" />
        Entregar
      </Button>
    </div>
  </div>
);

const DeliveryView = () => {
  const { branchSelect } = useAuthStore();
  const { orders, connected, deliverOrder } = useDeliverySocket(branchSelect?.id ?? '');

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Entregas</h2>
          <p className="text-sm text-gray-500">Órdenes confirmadas pendientes de entrega</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {connected ? (
            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
              <Wifi className="w-4 h-4" /> En linea
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-red-500 font-medium">
              <WifiOff className="w-4 h-4" /> Desconectado
            </span>
          )}
        </div>
      </div>

      {/* Cards grid */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Package className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">Sin órdenes pendientes</p>
          <p className="text-sm">Las órdenes confirmadas aparecerán aquí en tiempo real.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map((order) => (
            <DeliveryCard key={order.id} order={order} onDeliver={deliverOrder} />
          ))}
        </div>
      )}
    </>
  );
};

export default DeliveryView;
