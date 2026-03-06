import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, ChevronRight, CheckCircle2, Clock, FileText, Ban } from 'lucide-react';
import React from 'react';
import { type BaseResponse, type OrderModel } from '@/models';
import { PaginationControls } from '@/components/pagination.control';
import { Button, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce } from '@/hooks';

interface Props {
  dataOrders: BaseResponse<OrderModel>;
  onRefresh: (page?: number, limit?: number, keys?: string, status?: string) => void;
  onConfirm: (id: string) => void;
  onAnnul: (id: string) => void;
  onReprintPdf: (id: string) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'reserva', label: 'Reserva' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'anulada', label: 'Anulada' },
];

export const OrderTable = ({ dataOrders, onRefresh, onConfirm, onAnnul, onReprintPdf }: Props) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const debouncedQuery = useDebounce(query, 600);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataOrders.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [dataOrders.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery, status);
  }, [page, rowsPerPage, debouncedQuery, status]);

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const statusBadge = (order: OrderModel) => {
    if (order.stateAnulled) {
      return (
        <span className="inline-flex items-center gap-1 text-red-500 text-sm font-medium">
          <Ban className="w-4 h-4" /> Anulada
        </span>
      );
    }
    if (order.stateSold) {
      return (
        <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" /> Confirmada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-amber-500 text-sm font-medium">
        <Clock className="w-4 h-4" /> Reserva
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <InputCustom
            name="query"
            value={query}
            placeholder="Buscar por cliente, vendedor o ID..."
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <Table className="mb-3">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataOrders.data.map((order) => (
            <React.Fragment key={order.id}>
              {/* Fila principal */}
              <TableRow
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleToggleExpand(order.id)}
              >
                <TableCell>
                  {expandedId === order.id ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                </TableCell>
                <TableCell>
                  {order.customer.user.name} {order.customer.user.lastName ?? ''}
                </TableCell>
                <TableCell>
                  {order.staff.user.name} {order.staff.user.lastName ?? ''}
                </TableCell>
                <TableCell>{order.branch.name}</TableCell>
                <TableCell className="font-semibold">Bs. {order.amount.toFixed(2)}</TableCell>
                <TableCell>{statusBadge(order)}</TableCell>
                <TableCell
                  className="sticky right-0 z-10 bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    {/* Reserva pendiente: confirmar o anular */}
                    {!order.stateSold && !order.stateAnulled && (
                      <>
                        <Button size="sm" onClick={() => onConfirm(order.id)}>
                          Confirmar venta
                        </Button>
                        <Button
                          size="sm"
                          color="bg-red-500"
                          title="Anular reserva"
                          onClick={() => onAnnul(order.id)}
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {/* Venta confirmada: ver comprobante */}
                    {order.stateSold && (
                      <Button
                        type="button"
                        onClick={() => onReprintPdf(order.id)}
                        title="Ver comprobante"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>

              {/* Fila expandida: detalle de productos */}
              {expandedId === order.id && (
                <TableRow>
                  <TableCell colSpan={8} className="bg-gray-50 px-8 py-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 border-b">
                          <th className="text-left pb-1">Producto</th>
                          <th className="text-left pb-1">Cantidad</th>
                          <th className="text-left pb-1">Precio unit.</th>
                          <th className="text-left pb-1">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.outputs.map((output) => (
                          <tr key={output.id} className="border-b last:border-0">
                            <td className="py-1">{output.product.name}</td>
                            <td className="py-1">{output.quantity}</td>
                            <td className="py-1">Bs. {output.price.toFixed(2)}</td>
                            <td className="py-1 font-medium">
                              Bs. {(output.quantity * output.price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <PaginationControls
        total={dataOrders.total}
        page={page}
        limit={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => {
          setRowsPerPage(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
};
