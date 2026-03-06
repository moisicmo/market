import { useState, type FormEvent } from 'react';
import { useAuthStore, useForm, type validateEmail } from '@/hooks';
import { Button, InputCustom } from '@/components';
import { OtpCustom } from '@/components/otp.custom';

const loginFormFields = {
  pin: '',
  password: '',
};

const formValidations = {
  pin: [(value: any) => value.length >= 1, 'Debe ingresar el pin'],
  password: [(value: any) => value.length >= 6, 'La contraseña debe de tener más de 5 caracteres.'],
};


interface Props {
  handleClose: () => void;
  showValidateEmail: validateEmail;
}

export const ValidateEmail = (props: Props) => {
  const {
    handleClose,
    showValidateEmail,
  } = props;

  const { validatePin } = useAuthStore();

  const {
    pin,
    password,
    onInputChange,
    onResetForm,
    isFormValid,
    pinValid,
    passwordValid
  } = useForm(loginFormFields, formValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    await validatePin({
      idUser: `${showValidateEmail?.idUser}`,
      pin: pin.trim(),
      newPassword: password.trim(),
    });

    handleClose();
    onResetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Validar correo
        </h2>
        {showValidateEmail && (
          <h5>
            {`Acabamos de enviar un PIN a tu correo: ${showValidateEmail.email}`}
          </h5>
        )}

        <form onSubmit={sendSubmit} className="space-y-4">
          <OtpCustom
            length={6}
            name="pin"
            value={pin}
            onChange={onInputChange}
            error={!!pinValid && formSubmitted}
            helperText={formSubmitted ? pinValid : ""}
          />

          <InputCustom
            name="password"
            value={password}
            label="Contraseña"
            onChange={onInputChange}
            error={!!passwordValid && formSubmitted}
            helperText={formSubmitted ? passwordValid : ''}
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
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};