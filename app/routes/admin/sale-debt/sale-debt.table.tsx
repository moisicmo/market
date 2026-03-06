import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type DebtStatus, type SaleDebtModel, type SalePaymentRequest } from '@/models';
import { useDebounce, usePermissionStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { Button, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, ChevronRight } from 'lucide-react';
import React from 'react';
import { SaleDebtPayment } from '.';

interface Props {
  dataSaleDebts: BaseResponse<SaleDebtModel>;
  onRefresh: (page?: number, limit?: number, branchId?: string, keys?: string, status?: string) => void;
  onPay: (id: string, body: SalePaymentRequest) => Promise<void>;
  branchId: string;
}

const STATUS_LABEL: Record<DebtStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
};

const STATUS_CLASS: Record<DebtStatus, string> = {
  PENDING: 'bg-red-100 text-red-700',
  PAID: 'bg-green-100 text-green-700',
};

const STATUS_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Pendiente', value: 'PENDING' },
  { label: 'Pagado', value: 'PAID' },
];

const PAY_METHOD_LABEL: Record<string, string> = { cash: 'Efectivo', qr: 'QR', deposit: 'Depósito' };

export const SaleDebtTable = ({ dataSaleDebts, onRefresh, onPay, branchId }: Props) => {
  const { hasPermission } = usePermissionStore();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [payingDebt, setPayingDebt] = useState<SaleDebtModel | null>(null);
  const debouncedQuery = useDebounce(query, 1500);

  if (!hasPermission(TypeAction.read, TypeSubject.accountsReceivable)) return null;

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataSaleDebts.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [dataSaleDebts.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, branchId, debouncedQuery, statusFilter);
  }, [page, rowsPerPage, debouncedQuery, statusFilter, branchId]);

  const handlePay = async (id: string, body: SalePaymentRequest) => {
    await onPay(id, body);
    onRefresh(page, rowsPerPage, branchId, debouncedQuery, statusFilter);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar por cliente o documento..."
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
            <TableHead className="w-8"></TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Total deuda</TableHead>
            <TableHead>Pagado</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Registro</TableHead>
            {hasPermission(TypeAction.update, TypeSubject.accountsReceivable) && (
              <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataSaleDebts.data.map((debt) => (
            <React.Fragment key={debt.id}>
              <TableRow
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => setExpandedId((prev) => (prev === debt.id ? null : debt.id))}
              >
                <TableCell>
                  {expandedId === debt.id
                    ? <ChevronDown className="w-4 h-4 text-slate-500" />
                    : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{debt.customer.user.name} {debt.customer.user.lastName}</div>
                  <div className="text-xs text-gray-400">{debt.customer.user.numberDocument}</div>
                </TableCell>
                <TableCell className="font-medium">Bs. {debt.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="text-green-700 font-medium">Bs. {debt.paidAmount.toFixed(2)}</TableCell>
                <TableCell className={`font-semibold ${debt.status === 'PENDING' ? 'text-red-600' : 'text-green-600'}`}>
                  Bs. {(debt.totalAmount - debt.paidAmount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_CLASS[debt.status]}`}>
                    {STATUS_LABEL[debt.status]}
                  </span>
                </TableCell>
                <TableCell>{debt.branch.name}</TableCell>
                <TableCell>{format(new Date(debt.createdAt), 'dd/MM/yyyy', { locale: es })}</TableCell>
                {hasPermission(TypeAction.update, TypeSubject.accountsReceivable) && (
                  <TableCell
                    className="sticky right-0 z-10 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {debt.status === 'PENDING' && (
                      <Button type="button" onClick={() => setPayingDebt(debt)}>
                        Registrar pago
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>

              {expandedId === debt.id && (
                <TableRow className="bg-slate-50">
                  <TableCell colSpan={9} className="p-0">
                    <div className="rounded-md border border-slate-200 bg-white m-3 shadow-sm overflow-hidden">
                      {debt.payments.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-4">Sin pagos registrados</p>
                      ) : (
                        <Table className="w-full text-sm">
                          <TableHeader>
                            <TableRow className="bg-slate-50">
                              <TableHead>#</TableHead>
                              <TableHead>Monto</TableHead>
                              <TableHead>Método</TableHead>
                              <TableHead>Notas</TableHead>
                              <TableHead>Fecha</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {debt.payments.map((p, i) => (
                              <TableRow key={p.id}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell className="font-medium">Bs. {p.amount.toFixed(2)}</TableCell>
                                <TableCell>{PAY_METHOD_LABEL[p.payMethod] ?? p.payMethod}</TableCell>
                                <TableCell className="text-gray-500">{p.notes ?? '—'}</TableCell>
                                <TableCell>{format(new Date(p.createdAt), 'dd/MM/yyyy', { locale: es })}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
          {dataSaleDebts.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-400 py-8">
                Sin registros
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaginationControls
        total={dataSaleDebts.total}
        page={page}
        limit={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => { setRowsPerPage(newLimit); setPage(1); }}
      />

      {payingDebt && (
        <SaleDebtPayment
          debt={payingDebt}
          onPay={handlePay}
          onClose={() => setPayingDebt(null)}
        />
      )}
    </div>
  );
};
