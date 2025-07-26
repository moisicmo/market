import { useEffect, useState } from 'react';
import { usePaymentStore, useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { InputCustom } from '@/components';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  limitInit?: number;
}

export const PaymentTable = (props: Props) => {
  const {
    limitInit = 10,
  } = props;

  const { dataPayment, getPayments } = usePaymentStore();
  // const { getTypePayment, getTypePaymentClass } = useEnums();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataPayment.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataPayment.total, rowsPerPage]);

  useEffect(() => {
    getPayments(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar sucursal..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Método de pago</TableHead>
            <TableHead>Razon</TableHead>
            <TableHead>Fécha de pago</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataPayment.data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.payMethod}</TableCell>
              <TableCell>{`${item.amount} Bs`}</TableCell>
              <TableCell>{item.debt.type}</TableCell>
              <TableCell>
                {format(new Date(item.createdAt), 'dd-MMMM-yyyy HH:mm', { locale: es })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Controles de paginación */}
      <PaginationControls
        total={dataPayment.total}
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
