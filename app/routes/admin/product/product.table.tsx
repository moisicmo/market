import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type ProductModel } from '@/models';
import { useDebounce, usePermissionStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

interface Props {
  limitInit?: number;
  itemSelect?: (product: ProductModel) => void;
  dataProduct: BaseResponse<ProductModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  handleEdit: (product: ProductModel) => void;
  onDelete: (id: string) => void;
}

export const ProductTable = (props: Props) => {
  const {
    limitInit = 10,
    dataProduct,
    onRefresh,
    handleEdit,
    onDelete,
  } = props;

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  const { hasPermission } = usePermissionStore();
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataProduct.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataProduct.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery)
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <InputCustom
            name="query"
            value={query}
            placeholder="Buscar producto..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Table className='mb-3'>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Precio Promoción</TableHead>
              <TableHead>Costo Ref.</TableHead>
              <TableHead>Precios</TableHead>
              <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataProduct.data.map((product) => (
              <React.Fragment key={product.id}>
                <TableRow>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>
                    {
                      product.image ?
                        <img src={product.image} alt="Logo" className="w-24 mb-4" />
                        :
                        <div className="w-24 h-18 bg-gray-200 flex items-center justify-center text-gray">Sin Imagen</div>
                    }
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{product.brand.name}</TableCell>
                  <TableCell>{`${product.promoPrice} Bs`}</TableCell>
                  <TableCell>{product.refCost != null ? `${product.refCost} Bs` : '—'}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside space-y-1">
                      {
                        product.prices.map((price) => (
                          <li key={price.id}>
                            {` ${price.typeUnit} - Bs.${price.price} (${price.branch.name})`}
                          </li>))
                      }
                    </ul>
                  </TableCell>

                  <TableCell className="sticky right-0 z-10 bg-white">
                    <ActionButtons
                      item={product}
                      onEdit={hasPermission(TypeAction.update, TypeSubject.product) ? handleEdit : undefined}
                      onDelete={hasPermission(TypeAction.delete, TypeSubject.product) ? onDelete : undefined}
                    />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        {/* Controles de paginación */}
        <PaginationControls
          total={dataProduct.total}
          page={page}
          limit={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newLimit) => {
            setRowsPerPage(newLimit);
            setPage(1);
          }}
        />
      </div>
    </>
  );
};
