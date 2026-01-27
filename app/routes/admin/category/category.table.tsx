import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type CategoryModel } from '@/models';
import { useDebounce, usePermissionStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  handleEdit: (category: CategoryModel) => void;
  limitInit?: number;
  itemSelect?: (category: CategoryModel) => void;
  dataCategory: BaseResponse<CategoryModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

export const CategoryTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
    dataCategory,
    onRefresh,
    onDelete,
  } = props;


  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const { hasPermission } = usePermissionStore();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataCategory.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataCategory.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar categoria..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataCategory.data.map((category) =>
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell className="sticky right-0 z-10 bg-white">
                <ActionButtons
                  item={category}
                  onEdit={hasPermission(TypeAction.update, TypeSubject.category) ? handleEdit : undefined}
                  onDelete={hasPermission(TypeAction.delete, TypeSubject.category) ? onDelete : undefined}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Controles de paginación */}
      <PaginationControls
        total={dataCategory.total}
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
