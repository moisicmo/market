import { useEffect, useState } from 'react';
import { PaymentType, type BaseResponse, type PurchaseModel } from '@/models';
import { useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { Button, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import React from 'react';

interface Props {
  dataPurchase: BaseResponse<PurchaseModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onReprintPdf: (id: string) => void;
}

export const PurchaseTable = ({ dataPurchase, onRefresh, onReprintPdf }: Props) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 1500);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataPurchase.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [dataPurchase.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar compra..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Table className="mb-3">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Observación</TableHead>
            <TableHead>Tipo pago</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Fecha y hora</TableHead>
            <TableHead>Registrado por</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataPurchase.data.map((purchase) => (
            <React.Fragment key={purchase.id}>
              <TableRow
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => handleToggleExpand(purchase.id)}
              >
                <TableCell>
                  {expandedId === purchase.id
                    ? <ChevronDown className="w-4 h-4 text-slate-500" />
                    : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </TableCell>
                <TableCell className="font-mono text-xs">{purchase.code}</TableCell>
                <TableCell>{purchase.provider.name}</TableCell>
                <TableCell className="text-gray-500 text-sm max-w-xs truncate">
                  {purchase.inputs[0]?.detail ?? '—'}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      purchase.paymentType === PaymentType.CONTADO
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {purchase.paymentType === PaymentType.CONTADO
                      ? 'Contado'
                      : `Cuotas (${purchase._count.installments})`}
                  </span>
                </TableCell>
                <TableCell className="font-semibold">Bs. {purchase.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{purchase._count.inputs}</TableCell>
                <TableCell>
                  {format(new Date(purchase.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                </TableCell>
                <TableCell className="text-sm">{purchase.createdByName}</TableCell>
                <TableCell
                  className="sticky right-0 z-10 bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    type="button"
                    onClick={() => onReprintPdf(purchase.id)}
                    title="Ver comprobante"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>

              {expandedId === purchase.id && (
                <TableRow className="bg-slate-50">
                  <TableCell colSpan={11} className="p-0">
                    <div className="rounded-md border border-slate-200 bg-white m-3 shadow-sm overflow-hidden">
                      <Table className="w-full text-sm">
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead>Producto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Unidad</TableHead>
                            <TableHead>Precio unit.</TableHead>
                            <TableHead>Subtotal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {purchase.inputs.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell>{item.product.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.typeUnit === 'CAJA'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {item.typeUnit === 'CAJA' ? 'Caja' : 'Unidad'}
                                </span>
                              </TableCell>
                              <TableCell>Bs. {item.price.toFixed(2)}</TableCell>
                              <TableCell className="font-medium">
                                Bs. {(item.quantity * item.price).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-slate-50 border-t-2">
                            <TableCell colSpan={4} className="text-right font-semibold">Total:</TableCell>
                            <TableCell className="font-bold">
                              Bs. {purchase.inputs.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <PaginationControls
        total={dataPurchase.total}
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
