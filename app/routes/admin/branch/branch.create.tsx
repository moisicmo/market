import { useEffect, useState, type FormEvent } from 'react';
import { useForm } from '@/hooks';
import { Button, InputCustom, InputPhonesCustom, SelectCustom } from '@/components';
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
    type,
    name,
    bankAccount,
    phone,
    address,
    onInputChange,
    onValueChange,
    onResetForm,
    isFormValid,
    typeValid,
    nameValid,
    bankAccountValid,
    phoneValid,
    addressValid,
  } = useForm(item ?? formBranchFields, formBranchValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        type: type,
        name: name.trim(),
        bankAccount: bankAccount.trim(),
        phone,
        city: address.city.trim(),
        zone: address.zone.trim(),
        detail: address.detail.trim(),
      });
    } else {
      await onUpdate(item.id, {
        type: type,
        name: name.trim(),
        bankAccount: bankAccount.trim(),
        phone,
        city: address.city.trim(),
        zone: address.zone.trim(),
        detail: address.detail.trim(),
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
          <SelectCustom
            label="Tipo de sucursal"
            options={['sucursal', 'deposito'].map((t) => ({ id: t, value: t }))}
            selected={type ? { id: type, value: type } : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                onValueChange('type', value.id);
              }
            }}
            error={!!typeValid && formSubmitted}
            helperText={formSubmitted ? typeValid : ''}
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
            name="bankAccount"
            value={bankAccount}
            label="bankAccount"
            onChange={onInputChange}
            error={!!bankAccountValid && formSubmitted}
            helperText={formSubmitted ? bankAccountValid : ''}
          />

          <InputPhonesCustom
            name="phone"
            value={phone}
            onChange={(phones) => onValueChange('phone', phones)}
            label="Teléfonos"
            error={!!phoneValid && formSubmitted}
            helperText={formSubmitted ? phoneValid : ''}
          />
          <InputCustom
            name="address.city"
            value={address.city}
            label="Ciudad"
            onChange={onInputChange}
            error={!!addressValid?.cityValid && formSubmitted}
            helperText={formSubmitted ? addressValid?.cityValid : ''}
          />
          <InputCustom
            name="address.zone"
            value={address.zone}
            label="Zona"
            onChange={onInputChange}
            error={!!addressValid?.zoneValid && formSubmitted}
            helperText={formSubmitted ? addressValid?.zoneValid : ''}
          />
          <InputCustom
            name="address.detail"
            value={address.detail}
            label="Direccion"
            onChange={onInputChange}
            error={!!addressValid?.detailValid && formSubmitted}
            helperText={formSubmitted ? addressValid?.detailValid : ''}
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