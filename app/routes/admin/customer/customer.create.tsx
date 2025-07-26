import { useEffect, useState, type FormEvent } from 'react';
import { useForm } from '@/hooks';
import { Button, UserFormFields } from '@/components';
import { formCustomerInit, formCustomerValidations, type CustomerModel, type CustomerRequest } from '@/models';

interface Props {
  handleClose: () => void;
  item: CustomerModel | null;
  onCreate: (body: CustomerRequest) => void;
  onUpdate: (id: string, body: CustomerRequest) => void;
}

export const CustomerCreate = (props: Props) => {
  const {
    handleClose,
    item,
    onCreate,
    onUpdate,
  } = props;

  const {
    user,
    onInputChange,
    onResetForm,
    onValueChange,
    isFormValid,
    userValid,
  } = useForm(item ?? formCustomerInit, formCustomerValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        numberDocument: user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
      });
    } else {
      await onCreate({
        numberDocument: user.numberDocument,
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
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
          {item ? `Editar ${item.user.name}` : 'Nuevo Customer'}
        </h2>
        <form onSubmit={sendSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <UserFormFields
              user={user}
              userValid={userValid}
              formSubmitted={formSubmitted}
              onInputChange={onInputChange}
              onValueChange={onValueChange}
            />
          </div>
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