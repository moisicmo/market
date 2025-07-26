import { useEffect, useState, type FormEvent } from 'react';
import { useForm } from '@/hooks';
import { Button, InputCustom } from '@/components';
import { formRoleInit, formRoleValidations, type RoleModel, type RoleRequest } from '@/models';
import { PermissionForm } from './permission.create';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: RoleModel | null;
  onCreate: (body: RoleRequest) => void;
  onUpdate: (id: string, body: RoleRequest) => void;
}

export const RoleCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate
  } = props;

  const {
    name,
    permissions,
    onInputChange,
    onResetForm,
    isFormValid,
    onArrayChange,
    nameValid,
    permissionsValid,
  } = useForm(item ?? formRoleInit, formRoleValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        name: name.trim(),
        permissions: permissions
      });
    } else {
      await onUpdate(item.id, {
        name: name.trim(),
        permissions: permissions
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


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.name}` : 'Nuevo rol'}
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
          <PermissionForm
            permissions={permissions}
            onChange={(newPermissions) => onArrayChange('permissions', newPermissions)}
            formSubmitted={formSubmitted}
            permissionsValid={permissionsValid}
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