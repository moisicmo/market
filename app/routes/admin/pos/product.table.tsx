import { useEffect, useState } from 'react';
import type { BaseResponse, KardexModel, ProductModel } from '@/models';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { useAuthStore, useCartStore, useDebounce } from '@/hooks';
import { Search } from 'lucide-react';

interface Props {
  limitInit?: number;
  itemSelect?: (product: ProductModel) => void;
  dataKardex: BaseResponse<KardexModel>;
  onRefresh: (page: number, limit: number, keys: string) => void;
}

export const ProductTable = (props: Props) => {
  const { limitInit = 10, dataKardex, onRefresh } = props;

  const { branchSelect } = useAuthStore();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { addCard } = useCartStore();

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataKardex.total / rowsPerPage));
    if (page > maxPage) setPage(maxPage);
  }, [dataKardex.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  // Ocultar productos sin stock
  const visibleKardex = dataKardex.data.filter((k) => k.stock > 0);

  return (
    <>
      <div className="space-y-4">
        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={query}
            placeholder="Buscar por nombre, código, categoría o marca..."
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Table className='mb-3'>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleKardex.map((kardex) => (
              <React.Fragment key={kardex.product.id}>
                <TableRow>
                  <TableCell>{kardex.product.name}</TableCell>
                  <TableCell>{kardex.product.category?.name}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside space-y-1">
                      {kardex.product.prices
                        .filter(price => price.branch.id === branchSelect?.id)
                        .map(price => (
                          <li key={price.id}>
                            {price.typeUnit} - Bs.{price.price}
                          </li>
                        ))}
                    </ul>
                  </TableCell>
                  <TableCell>{`${kardex.stock} und.`}</TableCell>
                  <TableCell className="sticky right-0 z-10 bg-white">
                    <ActionButtons
                      item={kardex.product}
                      disabled={kardex.stock <= 0}
                      onSale={() => {
                        const branchPrice = kardex.product.prices.find(
                          (p) => p.branch?.id === branchSelect?.id
                        )?.price ?? 0;
                        addCard({
                          productModel: kardex.product,
                          stock: kardex.stock,
                          quantity: 1,
                          price: branchPrice,
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            {visibleKardex.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                  No se encontraron productos con stock disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <PaginationControls
          total={dataKardex.total}
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
