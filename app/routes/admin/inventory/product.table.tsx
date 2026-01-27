import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type BranchModel, type InputRequest, type KardexModel, type ProductModel, type TransferRequest } from '@/models';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, Button, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { InputCreate } from './input.create';
import { MovimentsTable } from './moviments.table';
import { TransferCreate } from './transfer.create';
import { usePermissionStore } from '@/hooks';

interface Props {
  branchId: string;
  limitInit?: number;
  itemSelect?: (product: ProductModel) => void;
  dataKardex: BaseResponse<KardexModel>;
  onInputCreate: (body: InputRequest) => void;
  onTransferCreate: (body: TransferRequest) => void;
}

export const ProductTable = (props: Props) => {
  const {
    branchId,
    itemSelect,
    limitInit = 10,
    dataKardex,
    onInputCreate,
    onTransferCreate,
  } = props;

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const { hasPermission } = usePermissionStore();
  const [openInputDialog, setOpenInputDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);



  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataKardex.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataKardex.total, rowsPerPage]);


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
        <div className="flex justify-between items-center space-x-2">
          <InputCustom
            name="query"
            value={query}
            placeholder="Buscar presentación..."
            onChange={(e) => setQuery(e.target.value)}
          />
          {
            hasPermission(TypeAction.create, TypeSubject.input) &&
            <Button
              onClick={() => setOpenInputDialog(true)}
            >Ingresar Productos</Button>}
          {
            hasPermission(TypeAction.create, TypeSubject.transfer) &&
            <Button
              onClick={() => setOpenTransferDialog(true)}
            >Transferir Productos</Button>}
        </div>
        <Table className='mb-3'>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataKardex.data.map((kardex) => (
              <React.Fragment key={kardex.product.id}>
                <TableRow>
                  <TableCell>{kardex.product.name}</TableCell>
                  <TableCell>{kardex.product.category.name}</TableCell>
                  <TableCell>{`${kardex.stock} und.`}</TableCell>
                  <TableCell className="sticky right-0 z-10 bg-white">
                    <ActionButtons
                      item={kardex.product}
                      onSelect={handleSelect}
                    />
                  </TableCell>
                </TableRow>
                {expandedId === kardex.product.id && (
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
      {openInputDialog && (
        <InputCreate
          branchId={branchId}
          dataKardex={dataKardex.data}
          handleClose={() => setOpenInputDialog(false)}
          onInputCreate={onInputCreate}
        />
      )}

      {/* {openTransferDialog && (
        <TransferCreate
          branchId={branchId}
          dataKardex={dataKardex.data}
          handleClose={() => setOpenTransferDialog(false)}
          onTransferCreate={onTransferCreate}
          dataBranch={dataBranch}
        />
      )} */}
    </>
  );
};
