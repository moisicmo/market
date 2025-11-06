import { useEffect, useState } from 'react';
import type { BaseResponse, ProviderModel } from '@/models';
import { useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  handleEdit: (provider: ProviderModel) => void;
  limitInit?: number;
  itemSelect?: (provider: ProviderModel) => void;
  dataProvider: BaseResponse<ProviderModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

export const ProviderTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
    dataProvider,
    onRefresh,
    onDelete,
  } = props;


  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataProvider.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataProvider.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar proveedor..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Nit</TableHead>
            <TableHead>Teléfonos</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Zona</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataProvider.data.map((provider) => 
            <TableRow key={provider.id}>
              <TableCell>{provider.name}</TableCell>
              <TableCell>{provider.nit}</TableCell>
              <TableCell>{provider.phone}</TableCell>
              <TableCell>{provider.address?.city}</TableCell>
              <TableCell>{provider.address?.zone}</TableCell>
              <TableCell>{provider.address?.detail}</TableCell>
              <TableCell className="sticky right-0 z-10 bg-white">
                <ActionButtons
                  item={provider}
                  onEdit={handleEdit}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataProvider.total}
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
