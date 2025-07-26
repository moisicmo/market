import { useEffect, useState, type FormEvent } from 'react';
import { useCityStore, useForm } from '@/hooks';
import { Button, InputCustom } from '@/components';
import { formBranchFields, formBranchValidations, type BranchModel, type BranchRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: BranchModel | null;
  onCreate: (body: BranchRequest) => void;
  onUpdate: (id: string, body: BranchRequest) => void;
}

export const BranchCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;

  const {
    name,
    address,
    onInputChange,
    onResetForm,
    isFormValid,
    nameValid,
    addressValid,
  } = useForm(item ?? formBranchFields, formBranchValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        name: name.trim(),
        address: address.trim(),
      });
    } else {
      await onUpdate(item.id, {
        name: name.trim(),
        address: address.trim(),
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


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? 'Editar Sucursal' : 'Nueva Sucursal'}
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
            name="address"
            value={address}
            label="Dirección"
            onChange={onInputChange}
            error={!!addressValid && formSubmitted}
            helperText={formSubmitted ? addressValid : ''}
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