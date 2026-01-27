import { useEffect, useState } from 'react';
import type { BaseResponse, KardexModel, ProductModel } from '@/models';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { useAuthStore, useCartStore } from '@/hooks';

interface Props {
  limitInit?: number;
  itemSelect?: (product: ProductModel) => void;
  dataKardex: BaseResponse<KardexModel>;
}

export const ProductTable = (props: Props) => {
  const {
    limitInit = 10,
    dataKardex,
  } = props;

  const { branchSelect } = useAuthStore();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const { addCard } = useCartStore();

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataKardex.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataKardex.total, rowsPerPage]);

  return (
    <>
      <div className="space-y-4">
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
            {dataKardex.data.map((kardex) => (
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
                      onSale={(i) => {
                        addCard({
                          productModel: kardex.product,
                          stock: kardex.stock,
                          quantity: 1,
                          price: kardex.product.prices.length > 0 ? kardex.product.prices[0].price : 0,
                        });
                        console.log(kardex.product)
                      }}
                    />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        {/* Controles de paginación */}
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
