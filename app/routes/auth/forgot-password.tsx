import { useState, type FormEvent } from 'react';
import { useAuthStore, useForm } from '@/hooks';
import { useAlertStore } from '@/hooks/useAlert';
import { Button, InputCustom } from '@/components';
import { OtpCustom } from '@/components/otp.custom';

interface Props {
  handleClose: () => void;
}

const emailFormFields = { email: '' };
const emailFormValidations = {
  email: [(value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), 'Ingresa un correo válido'],
};

const pinFormFields = { pin: '', password: '', confirmPassword: '' };
const pinFormValidations = {
  pin: [(value: string) => value.length >= 6, 'Debe ingresar el PIN de 6 dígitos'],
  password: [(value: string) => value.length >= 8, 'La contraseña debe tener al menos 8 caracteres'],
  confirmPassword: [(value: string) => value.length > 0, 'Debe confirmar la contraseña'],
};

export const ForgotPassword = ({ handleClose }: Props) => {
  const { forgotPassword, validatePin } = useAuthStore();
  const { showSuccess, showError } = useAlertStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [idUser, setIdUser] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [pinSubmitted, setPinSubmitted] = useState(false);

  // Paso 1 — email
  const {
    email,
    onInputChange: onEmailChange,
    isFormValid: isEmailValid,
    emailValid,
    onResetForm: resetEmailForm,
  } = useForm(emailFormFields, emailFormValidations);

  // Paso 2 — OTP + nueva contraseña
  const {
    pin, password, confirmPassword,
    onInputChange: onPinChange,
    isFormValid: isPinFormValid,
    pinValid, passwordValid, confirmPasswordValid,
    onResetForm: resetPinForm,
  } = useForm(pinFormFields, pinFormValidations);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    if (!isEmailValid) return;
    try {
      const result = await forgotPassword({ email });
      setIdUser(result.idUser);
      setUserEmail(result.email);
      setStep(2);
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'No se encontró una cuenta con ese correo';
      showError('Error', msg);
    }
  };

  const handlePinSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPinSubmitted(true);
    if (!isPinFormValid) return;
    if (password !== confirmPassword) {
      showError('Error', 'Las contraseñas no coinciden');
      return;
    }
    try {
      await validatePin({ idUser, pin: pin.trim(), newPassword: password });
      showSuccess('Contraseña restablecida correctamente');
      resetEmailForm();
      resetPinForm();
      handleClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'PIN incorrecto o expirado';
      showError('Error', msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

        {/* Paso 1 — Ingresar correo */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-2">Recuperar contraseña</h2>
            <p className="text-sm text-gray-500 mb-5">
              Ingresa tu correo y te enviaremos un código de verificación.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <InputCustom
                name="email"
                value={email}
                type="email"
                label="Correo electrónico"
                onChange={onEmailChange}
                error={!!emailValid && emailSubmitted}
                helperText={emailSubmitted ? emailValid : ''}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={handleClose} color="bg-gray-400" type="button">
                  Cancelar
                </Button>
                <Button type="submit">Enviar código</Button>
              </div>
            </form>
          </>
        )}

        {/* Paso 2 — OTP + nueva contraseña */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-2">Ingresa el código</h2>
            <p className="text-sm text-gray-500 mb-5">
              Enviamos un PIN de 6 dígitos a <span className="font-medium text-gray-700">{userEmail}</span>
            </p>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <OtpCustom
                length={6}
                name="pin"
                value={pin}
                onChange={onPinChange}
                error={!!pinValid && pinSubmitted}
                helperText={pinSubmitted ? pinValid : ''}
              />
              <InputCustom
                name="password"
                value={password}
                type="password"
                label="Nueva contraseña"
                onChange={onPinChange}
                error={!!passwordValid && pinSubmitted}
                helperText={pinSubmitted ? passwordValid : ''}
              />
              <InputCustom
                name="confirmPassword"
                value={confirmPassword}
                type="password"
                label="Confirmar contraseña"
                onChange={onPinChange}
                error={!!confirmPasswordValid && pinSubmitted}
                helperText={pinSubmitted ? confirmPasswordValid : ''}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => setStep(1)} color="bg-gray-400" type="button">
                  Atrás
                </Button>
                <Button type="submit">Restablecer</Button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
