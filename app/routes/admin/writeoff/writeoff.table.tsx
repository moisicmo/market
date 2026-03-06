import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, ChevronRight } from 'lucide-react';
import React from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type WriteoffModel, WriteoffReasonLabels, type WriteoffReason } from '@/models';
import { PaginationControls } from '@/components/pagination.control';
import { InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce, usePermissionStore } from '@/hooks';

interface Props {
  dataWriteoffs: BaseResponse<WriteoffModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
}

const REASON_COLORS: Record<string, string> = {
  VENCIMIENTO: 'bg-orange-100 text-orange-700',
  DANIO: 'bg-red-100 text-red-700',
  ROBO: 'bg-purple-100 text-purple-700',
  PERDIDA: 'bg-yellow-100 text-yellow-700',
  OTRO: 'bg-gray-100 text-gray-700',
};

export const WriteoffTable = ({ dataWriteoffs, onRefresh }: Props) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  const { hasPermission } = usePermissionStore();

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataWriteoffs.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [dataWriteoffs.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  if (!hasPermission(TypeAction.read, TypeSubject.writeoff)) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar por motivo, descripción o producto..."
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />
      </div>

      <Table className="mb-3">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Total uds.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataWriteoffs.data.map((wo) => (
            <React.Fragment key={wo.id}>
              <TableRow
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId((prev) => (prev === wo.id ? null : wo.id))}
              >
                <TableCell>
                  {expandedId === wo.id ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(wo.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                </TableCell>
                <TableCell>{wo.branch.name}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${REASON_COLORS[wo.reason] ?? 'bg-gray-100 text-gray-700'}`}>
                    {WriteoffReasonLabels[wo.reason as WriteoffReason]}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500 text-sm max-w-xs truncate">
                  {wo.description ?? '—'}
                </TableCell>
                <TableCell>{wo.outputs.length}</TableCell>
                <TableCell className="font-semibold">
                  {wo.outputs.reduce((s, o) => s + o.quantity, 0)}
                </TableCell>
              </TableRow>

              {expandedId === wo.id && (
                <TableRow>
                  <TableCell colSpan={7} className="bg-gray-50 px-8 py-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 border-b">
                          <th className="text-left pb-1">Producto</th>
                          <th className="text-left pb-1">Código</th>
                          <th className="text-left pb-1">Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wo.outputs.map((output) => (
                          <tr key={output.id} className="border-b last:border-0">
                            <td className="py-1">{output.product.name}</td>
                            <td className="py-1 text-gray-400">{output.product.code ?? '—'}</td>
                            <td className="py-1 font-medium">{output.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
          {dataWriteoffs.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                No hay bajas registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaginationControls
        total={dataWriteoffs.total}
        page={page}
        limit={rowsPerPage}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(l) => { setRowsPerPage(l); setPage(1); }}
      />
    </div>
  );
};
