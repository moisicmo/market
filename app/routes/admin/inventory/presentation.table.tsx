import { useCallback, useEffect, useState } from 'react';
import type { BaseResponse, KardexModel, ProductModel, ProductPresentationModel } from '@/models';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, Button, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { InputCreate } from './input.create';
import { useInputStore } from '@/hooks/useInputStore';
import { MovimentsTable } from './moviments.table';

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
  const [query, setQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [itemEdit, setItemEdit] = useState<ProductPresentationModel | null>(null);

  const { createInput } = useInputStore();

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataKardex.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataKardex.total, rowsPerPage]);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  const handleSelect = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
  };
  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <InputCustom
            name="query"
            value={query}
            placeholder="Buscar presentación..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            onClick={() => handleDialog(true)}
          >Ingresar Stock</Button>
        </div>
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
                      onSelect={handleSelect}
                    />
                  </TableCell>
                </TableRow>
                {expandedId === kardex.presentation.id && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={12} className="p-0">
                      <div className="rounded-md border border-slate-300 bg-white p-4 shadow-sm">
                        <MovimentsTable
                          moviments={kardex.kardex}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
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
      {/* Dialogo para registrar entrada de presentación */}
      {openDialog && (
        <InputCreate
          branchId={branchId}
          dataKardex={dataKardex.data}
          handleClose={() => handleDialog(false)}
          onCreate={createInput}
        />
      )}
    </>
  );
};
