import { useEffect, useState, type FormEvent } from 'react';
import { useForm, useBranchStore, useCategoryStore } from '@/hooks';
import { Button, InputCustom, SelectCustom } from '@/components';
import { formProductFields, formProductValidations, type ProductModel, type ProductRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: ProductModel | null;
  onCreate: (body: ProductRequest) => void;
  onUpdate: (id: string, body: ProductRequest) => void;
}

export const ProductCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;
  const { dataBranch, getBranches } = useBranchStore();
  const { dataCategory, getCategories } = useCategoryStore();

  const {
    category,
    branch,
    name,
    typeUnit,
    price,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    categoryValid,
    branchValid,
    nameValid,
    typeUnitValid,
    priceValid,
  } = useForm(item ?? formProductFields, formProductValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        categoryId: category.id,
        branchId: branch.id,
        name: name.trim(),
        typeUnit:typeUnit.trim(),
        price: parseFloat(price),
      });
    } else {
      await onUpdate(item.id, {
        categoryId: category.id,
        branchId: branch.id,
        name: name.trim(),
        typeUnit:typeUnit.trim(),
        price: parseFloat(price),
      });
    }

    handleClose();
    onResetForm();
  };

  useEffect(() => {
    if (item) {
      setFormSubmitted(false);
    }
  }, [item]);

  if (!open) return null;

  useEffect(() => {
    getBranches();
    getCategories();
  }, [])


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? 'Editar Sucursal' : 'Nueva Sucursal'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          <SelectCustom
            label="Categoria"
            options={dataCategory.data?.map((category) => ({ id: category.id, value: category.name })) ?? []}
            selected={category ? { id: category.id, value: category.name } : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const select = dataCategory.data?.find((r) => r.id === value.id);
                onValueChange('category', select);
              }
            }}
            error={!!categoryValid && formSubmitted}
            helperText={formSubmitted ? categoryValid : ''}
          />
          <SelectCustom
            label="Sucursal"
            options={dataBranch.data?.map((branch) => ({ id: branch.id, value: branch.name })) ?? []}
            selected={branch ? { id: branch.id, value: branch.name } : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const select = dataBranch.data?.find((r) => r.id === value.id);
                onValueChange('branch', select);
              }
            }}
            error={!!branchValid && formSubmitted}
            helperText={formSubmitted ? branchValid : ''}
          />
          <InputCustom
            name="name"
            value={name}
            label="Nombre"
            onChange={onInputChange}
            error={!!nameValid && formSubmitted}
            helperText={formSubmitted ? nameValid : ''}
          />
          <InputCustom
            name="typeUnit"
            value={typeUnit}
            label="Tipo de unidad"
            onChange={onInputChange}
            error={!!typeUnitValid && formSubmitted}
            helperText={formSubmitted ? typeUnitValid : ''}
          />
          <InputCustom
            name="price"
            value={price}
            label="Precio"
            onChange={onInputChange}
            error={!!priceValid && formSubmitted}
            helperText={formSubmitted ? priceValid : ''}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => {
                onResetForm();
                handleClose();
              }}
              color='bg-gray-400'
            >Cancelar</Button>
            <Button
              type='submit'
            >{item ? 'Editar' : 'Crear'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};