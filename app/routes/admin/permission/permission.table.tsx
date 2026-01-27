import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type PermissionModel } from '@/models';
import { useDebounce } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  dataRole: BaseResponse<PermissionModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
}

export const PermissionTable = (props: Props) => {
  const {
    dataRole,
    onRefresh,
  } = props;


  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataRole.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataRole.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar permiso..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Acción</TableHead>
            <TableHead>Recurso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataRole.data.map(item => (
            <TableRow key={item.id}>
              <TableCell>
                  {TypeAction[item.action as unknown as keyof typeof TypeAction]}
              </TableCell>
              <TableCell>
                  {item.subject}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataRole.total}
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
