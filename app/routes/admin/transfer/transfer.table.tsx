import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import { TypeAction, TypeSubject, type BaseResponse, type TransferModel } from '@/models';
import { PaginationControls } from '@/components/pagination.control';
import { InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce, usePermissionStore } from '@/hooks';

interface Props {
  dataTransfers: BaseResponse<TransferModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
}

export const TransferTable = ({ dataTransfers, onRefresh }: Props) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  const { hasPermission } = usePermissionStore();

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataTransfers.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [dataTransfers.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  if (!hasPermission(TypeAction.read, TypeSubject.transfer)) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar por producto, sucursal o detalle..."
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />
      </div>

      <Table className="mb-3">
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Ruta</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Detalle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataTransfers.data.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                {format(new Date(transfer.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium text-gray-700">{transfer.fromBranch.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="font-medium text-blue-600">{transfer.toBranch.name}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{transfer.product.name}</TableCell>
              <TableCell className="text-gray-400 text-sm">{transfer.product.code ?? '—'}</TableCell>
              <TableCell className="font-semibold">{transfer.quantity}</TableCell>
              <TableCell className="text-gray-500 text-sm max-w-xs truncate">
                {transfer.detail ?? '—'}
              </TableCell>
            </TableRow>
          ))}
          {dataTransfers.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                No hay traspasos registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaginationControls
        total={dataTransfers.total}
        page={page}
        limit={rowsPerPage}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(l) => { setRowsPerPage(l); setPage(1); }}
      />
    </div>
  );
};
