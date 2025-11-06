import { useEffect, useState, type FormEvent } from 'react';
import { useForm, useBranchStore } from '@/hooks';
import { Button, InputCustom } from '@/components';
import { formBrandFields, formBrandValidations, type BrandModel, type BrandRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: BrandModel | null;
  onCreate: (body: BrandRequest) => void;
  onUpdate: (id: string, body: BrandRequest) => void;
}

export const BrandCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;
  const { dataBranch, getBranches } = useBranchStore();

  const {
    name,
    description,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    nameValid,
    descriptionValid,
  } = useForm(item ?? formBrandFields, formBrandValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        name: name.trim(),
        description: description.trim(),
      });
    } else {
      await onUpdate(item.id, {
        name: name.trim(),
        description: description.trim(),
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
  }, [])


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? 'Editar Marca' : 'Nueva Marca'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          <InputCustom
            name="name"
            value={name}
            label="Nombre"
            onChange={onInputChange}
            error={!!nameValid && formSubmitted}
            helperText={formSubmitted ? nameValid : ''}
          />
          <InputCustom
            name="description"
            value={description}
            label="Descripción"
            onChange={onInputChange}
            error={!!descriptionValid && formSubmitted}
            helperText={formSubmitted ? descriptionValid : ''}
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