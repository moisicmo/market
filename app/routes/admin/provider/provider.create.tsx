import { useEffect, useState, type FormEvent } from 'react';
import { useForm, useBranchStore } from '@/hooks';
import { Button, InputCustom, InputPhonesCustom } from '@/components';
import { formProviderFields, formProviderValidations, type ProviderModel, type ProviderRequest } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: ProviderModel | null;
  onCreate: (body: ProviderRequest) => void;
  onUpdate: (id: string, body: ProviderRequest) => void;
}

export const ProviderCreate = (props: Props) => {
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
    nit,
    phone,
    contact,
    address,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    nameValid,
    nitValid,
    phoneValid,
    contactValid,
    addressValid,
  } = useForm(item ?? formProviderFields, formProviderValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        name: name.trim(),
        nit: nit.trim(),
        phone,
        contact: contact.trim(),
        city: address.city.trim(),
        zone: address.zone.trim(),
        detail: address.detail.trim(),
      });
    } else {
      await onUpdate(item.id, {
        name: name.trim(),
        nit: nit.trim(),
        phone,
        contact: contact.trim(),
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

  if (!open) return null;

  useEffect(() => {
    getBranches();
  }, [])


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
            name="nit"
            value={nit}
            label="Nit"
            onChange={onInputChange}
            error={!!nitValid && formSubmitted}
            helperText={formSubmitted ? nitValid : ''}
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
            name="contact"
            value={contact}
            label="Contacto"
            onChange={onInputChange}
            error={!!contactValid && formSubmitted}
            helperText={formSubmitted ? contactValid : ''}
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