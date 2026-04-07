import { useEffect, useState } from 'react';
import { TransferRequestStatus, type BaseResponse, type TransferRequestModel } from '@/models';
import { useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { Button, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, ChevronRight, Send, PackageCheck, X, Eye, FileText } from 'lucide-react';
import React from 'react';

interface Props {
  dataRequests: BaseResponse<TransferRequestModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDispatch: (item: TransferRequestModel) => void;
  onReceive: (item: TransferRequestModel) => void;
  onReject: (item: TransferRequestModel) => void;
  onDownloadPdf: (id: string) => void;
  canDispatch: boolean;
  canCreate: boolean;
}

const statusConfig: Record<TransferRequestStatus, { label: string; bg: string; text: string }> = {
  [TransferRequestStatus.SOLICITADO]: { label: 'Solicitado', bg: 'bg-blue-100', text: 'text-blue-700' },
  [TransferRequestStatus.DESPACHADO]: { label: 'Despachado', bg: 'bg-amber-100', text: 'text-amber-700' },
  [TransferRequestStatus.RECIBIDO]: { label: 'Recibido', bg: 'bg-green-100', text: 'text-green-700' },
  [TransferRequestStatus.RECHAZADO]: { label: 'Rechazado', bg: 'bg-red-100', text: 'text-red-700' },
  [TransferRequestStatus.OBSERVADO]: { label: 'Observado', bg: 'bg-orange-100', text: 'text-orange-700' },
};

export const TransferRequestTable = ({
  dataRequests,
  onRefresh,
  onDispatch,
  onReceive,
  onReject,
  onDownloadPdf,
  canDispatch,
}: Props) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 1500);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataRequests.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [dataRequests.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar solicitud..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Table className="mb-3">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Solicitado por</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataRequests.data.map((req) => {
            const sc = statusConfig[req.status];
            return (
              <React.Fragment key={req.id}>
                <TableRow
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => setExpandedId((prev) => (prev === req.id ? null : req.id))}
                >
                  <TableCell>
                    {expandedId === req.id
                      ? <ChevronDown className="w-4 h-4 text-slate-500" />
                      : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  </TableCell>
                  <TableCell>{req.fromBranch.name}</TableCell>
                  <TableCell>{req.toBranch.name}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                      {sc.label}
                    </span>
                  </TableCell>
                  <TableCell>{req._count.items}</TableCell>
                  <TableCell className="text-gray-500 text-sm max-w-xs truncate">
                    {req.note ?? '—'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(req.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </TableCell>
                  <TableCell className="text-sm">{req.createdByName}</TableCell>
                  <TableCell
                    className="sticky right-0 z-10 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-1">
                    <Button
                      type="button"
                      onClick={() => onDownloadPdf(req.id)}
                      title="Ver comprobante"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                      {req.status === TransferRequestStatus.SOLICITADO && canDispatch && (
                        <>
                          <Button
                            type="button"
                            onClick={() => onDispatch(req)}
                            title="Despachar"
                            color="bg-amber-500"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => onReject(req)}
                            title="Rechazar"
                            color="bg-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {req.status === TransferRequestStatus.DESPACHADO && (
                        <Button
                          type="button"
                          onClick={() => onReceive(req)}
                          title="Recibir"
                          color="bg-green-500"
                        >
                          <PackageCheck className="w-4 h-4" />
                        </Button>
                      )}

                    </div>
                  </TableCell>
                </TableRow>

                {expandedId === req.id && (
                  <TableRow className="bg-slate-50">
                    <TableCell colSpan={9} className="p-0">
                      <div className="rounded-md border border-slate-200 bg-white m-3 shadow-sm overflow-hidden">
                        {/* Info adicional */}
                        <div className="px-4 py-2 text-sm space-y-1 border-b">
                          {req.dispatchedByName && (
                            <p><span className="font-medium">Despachado por:</span> {req.dispatchedByName} — {req.dispatchedAt ? format(new Date(req.dispatchedAt), 'dd/MM/yyyy HH:mm', { locale: es }) : ''}</p>
                          )}
                          {req.receivedByName && (
                            <p><span className="font-medium">Recibido por:</span> {req.receivedByName} — {req.receivedAt ? format(new Date(req.receivedAt), 'dd/MM/yyyy HH:mm', { locale: es }) : ''}</p>
                          )}
                          {req.rejectionNote && (
                            <p className="text-red-600"><span className="font-medium">Motivo de rechazo:</span> {req.rejectionNote}</p>
                          )}
                          {req.observationNote && (
                            <p className="text-orange-600"><span className="font-medium">Observación:</span> {req.observationNote}</p>
                          )}
                        </div>

                        <Table className="w-full text-sm">
                          <TableHeader>
                            <TableRow className="bg-slate-50">
                              <TableHead>Producto</TableHead>
                              <TableHead>Código</TableHead>
                              <TableHead>Unidad</TableHead>
                              <TableHead>Solicitado</TableHead>
                              <TableHead>Despachado</TableHead>
                              <TableHead>Precio unit.</TableHead>
                              <TableHead>Detalle</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {req.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell className="font-mono text-xs">{item.product.code ?? '—'}</TableCell>
                                <TableCell>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.typeUnit === 'CAJA'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {item.typeUnit === 'CAJA' ? 'Caja' : 'Unidad'}
                                  </span>
                                </TableCell>
                                <TableCell>{item.quantityRequested}</TableCell>
                                <TableCell>
                                  {item.quantityDispatched != null ? (
                                    <span className={item.quantityDispatched < item.quantityRequested ? 'text-orange-600 font-medium' : ''}>
                                      {item.quantityDispatched}
                                    </span>
                                  ) : '—'}
                                </TableCell>
                                <TableCell>Bs. {item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-gray-500">{item.detail ?? '—'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>

      <PaginationControls
        total={dataRequests.total}
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
