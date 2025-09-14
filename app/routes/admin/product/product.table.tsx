import { useCallback, useEffect, useState } from 'react';
import type { BaseResponse, ProductModel, ProductPresentationModel, ProductPresentationRequest } from '@/models';
import { useDebounce, useProductPresentationStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, Button, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { ProductPresentationCreate, ProductPresentationTable } from '.';

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
    itemSelect,
    limitInit = 10,
    dataProduct,
    onRefresh,
    handleEdit,
    onDelete,
  } = props;

  const { createProductPresentation, updateProductPresentation, deleteProductPresentation } = useProductPresentationStore();

  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataProduct.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataProduct.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery)
  }, [page, rowsPerPage, debouncedQuery]);

  const handleSelect = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<ProductPresentationModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  const handleCreateProductPresentation = async (value: ProductPresentationRequest) => {
    const resp = await createProductPresentation(value);
    dataProduct.data.find(product => product.id == expandedId)?.productPresentations.push(
      resp
    )
  }

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
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataProduct.data.map((product) => (
              <React.Fragment key={product.id}>
                <TableRow>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell className="sticky right-0 z-10 bg-white">
                    <ActionButtons
                      item={product}
                      onSelect={handleSelect}
                      onEdit={handleEdit}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
                {expandedId === product.id && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={12} className="p-0">
                      <div className="rounded-md border border-slate-300 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-semibold text-gray-900">Presentaciones:</p>
                          <Button
                            type="button"
                            onClick={() => {
                              setItemEdit(null);
                              handleDialog(true);
                            }}
                          >
                            Nueva Presentación
                          </Button>
                        </div>
                        <ProductPresentationTable
                          productPresentations={product.productPresentations}
                          handleEdit={(v) => {
                            setItemEdit(v);
                            handleDialog(true);
                          }}
                          onDelete={deleteProductPresentation}
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
      {/* Dialogo para crear o editar presentaciones*/}
      {openDialog && expandedId && (
        <ProductPresentationCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          productId={expandedId}
          item={itemEdit ? { ...itemEdit } : null}
          onCreate={handleCreateProductPresentation}
          onUpdate={updateProductPresentation}
        />
      )}

    </>
  );
};
