import { useEffect, useState } from 'react';
import type { BaseResponse, KardexModel, ProductModel } from '@/models';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { useCartStore } from '@/hooks';

interface Props {
  branchId: string;
  limitInit?: number;
  itemSelect?: (product: ProductModel) => void;
  dataKardex: BaseResponse<KardexModel>;
}

export const PresentationTable = (props: Props) => {
  const {
    branchId,
    itemSelect,
    limitInit = 10,
    dataKardex,
  } = props;

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
              <TableHead>Presentación</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataKardex.data.map((kardex) => (
              <React.Fragment key={kardex.presentation.id}>
                <TableRow>
                  <TableCell>{kardex.presentation.product?.name}</TableCell>
                  <TableCell>{kardex.presentation.name}</TableCell>
                  <TableCell>{kardex.presentation.product?.category.name}</TableCell>
                  <TableCell>{kardex.stock}</TableCell>
                  <TableCell className="sticky right-0 z-10 bg-white">
                    <ActionButtons
                      item={kardex.presentation}
                      onSale={(i) => {
                        addCard({
                          productPresentationModel: kardex.presentation,
                          stock: kardex.stock,
                          quantity: 1,
                          price: kardex.presentation.prices.length > 0 ? kardex.presentation.prices[0].price : 0,
                        });
                        console.log(kardex.presentation)
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
