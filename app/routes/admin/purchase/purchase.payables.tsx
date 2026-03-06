import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type InstallmentStatus, type PayableModel } from '@/models';
import { useDebounce, usePermissionStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { Button, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  dataPayables: BaseResponse<PayableModel>;
  onRefresh: (page?: number, limit?: number, branchId?: string, keys?: string, status?: string) => void;
  onPay: (id: string) => Promise<void>;
  branchId: string;
}

const STATUS_LABEL: Record<InstallmentStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  OVERDUE: 'Vencido',
};

const STATUS_CLASS: Record<InstallmentStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
};

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'Todos', value: '' },
  { label: 'Pendiente', value: 'PENDING' },
  { label: 'Pagado', value: 'PAID' },
  { label: 'Vencido', value: 'OVERDUE' },
];

export const PurchasePayables = ({ dataPayables, onRefresh, onPay, branchId }: Props) => {
  const { hasPermission } = usePermissionStore();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [payingId, setPayingId] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 1500);

  if (!hasPermission(TypeAction.read, TypeSubject.purchase)) return null;

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataPayables.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [dataPayables.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, branchId, debouncedQuery, statusFilter);
  }, [page, rowsPerPage, debouncedQuery, statusFilter, branchId]);

  const handlePay = async (id: string) => {
    setPayingId(id);
    try {
      await onPay(id);
      onRefresh(page, rowsPerPage, branchId, debouncedQuery, statusFilter);
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar por proveedor o código..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-1 shrink-0">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setStatusFilter(opt.value); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                statusFilter === opt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Table className="mb-3">
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Código compra</TableHead>
            <TableHead>Cuota #</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Fecha venc.</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Pagado el</TableHead>
            {hasPermission(TypeAction.update, TypeSubject.purchase) && (
              <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataPayables.data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.purchase.provider.name}</TableCell>
              <TableCell className="font-mono text-xs">{item.purchase.code}</TableCell>
              <TableCell className="text-center font-medium">{item.installmentNumber}</TableCell>
              <TableCell className="font-medium">Bs. {item.amount.toFixed(2)}</TableCell>
              <TableCell>
                {format(new Date(item.dueDate), 'dd/MM/yyyy', { locale: es })}
              </TableCell>
              <TableCell>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_CLASS[item.status]}`}>
                  {STATUS_LABEL[item.status]}
                </span>
              </TableCell>
              <TableCell>
                {item.paidAt
                  ? format(new Date(item.paidAt), 'dd/MM/yyyy', { locale: es })
                  : <span className="text-gray-400 text-xs">—</span>}
              </TableCell>
              {hasPermission(TypeAction.update, TypeSubject.purchase) && (
                <TableCell className="sticky right-0 z-10 bg-white">
                  {item.status === 'PENDING' && (
                    <Button
                      type="button"
                      disabled={payingId === item.id}
                      onClick={() => handlePay(item.id)}
                    >
                      {payingId === item.id ? 'Registrando...' : 'Registrar pago'}
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
          {dataPayables.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                Sin registros
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaginationControls
        total={dataPayables.total}
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
