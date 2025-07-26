import { useCallback, useEffect, useState } from 'react';
import type { CategoryModel } from '@/models';
import { CategoryCreate, CategoryTable } from '.';
import { Button } from '@/components';
import { useCategoryStore } from '@/hooks';

const categoryView = () => {
  const { dataCategory, getCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [itemEdit, setItemEdit] = useState<CategoryModel | null>(null);

  const handleDialog = useCallback((value: boolean) => {
    if (!value) setItemEdit(null);
    setOpenDialog(value);
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Categorias</h2>
        <Button
          onClick={() => handleDialog(true)}
        >Nueva Categoria</Button>
      </div>

      {/* Tabla de category */}
      <CategoryTable
        handleEdit={(v) => {
          setItemEdit(v);
          handleDialog(true);
        }}
        dataCategory={dataCategory}
        onRefresh={getCategories}
        onDelete={deleteCategory}
      />


      {/* Dialogo para crear o editar */}
      {openDialog && (
        <CategoryCreate
          open={openDialog}
          handleClose={() => handleDialog(false)}
          item={itemEdit == null ? null : { ...itemEdit }}
          onCreate={createCategory}
          onUpdate={updateCategory}
        />
      )}
    </>
  );
};

export default categoryView