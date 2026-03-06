import { useState } from 'react';
import { useAuthStore } from '@/hooks';
import { useAlertStore } from '@/hooks/useAlert';
import { useForm } from '@/hooks/useForm';
import { Button, InputCustom } from '@/components';
import {
  formUpdateProfileValidations,
  formUpdatePasswordInit,
  formUpdatePasswordValidations,
} from '@/models';

interface Props {
  handleClose: () => void;
}

type Tab = 'datos' | 'password';

export const Profile = ({ handleClose }: Props) => {
  const { updateProfile, updatePassword, userProfile } = useAuthStore();
  const { showSuccess, showError } = useAlertStore();
  const [activeTab, setActiveTab] = useState<Tab>('datos');
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);

  // --- Formulario datos básicos (pre-poblado desde el store) ---
  const {
    name, lastName, email,
    onInputChange: onProfileChange,
    isFormValid: isProfileValid,
    nameValid, lastNameValid, emailValid,
  } = useForm(userProfile, formUpdateProfileValidations);

  // --- Formulario contraseña ---
  const {
    currentPassword, newPassword, confirmPassword,
    onInputChange: onPasswordChange,
    isFormValid: isPasswordFormValid,
    currentPasswordValid, newPasswordValid, confirmPasswordValid,
  } = useForm(formUpdatePasswordInit, formUpdatePasswordValidations);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSubmitted(true);
    if (!isProfileValid) return;
    try {
      await updateProfile({ name, lastName, email: email || undefined });
      showSuccess('Perfil actualizado correctamente');
      handleClose();
    } catch {
      showError('Error', 'No se pudo actualizar el perfil');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSubmitted(true);
    if (!isPasswordFormValid) return;
    if (newPassword !== confirmPassword) {
      showError('Error', 'Las contraseñas no coinciden');
      return;
    }
    try {
      await updatePassword({ currentPassword, newPassword });
      showSuccess('Contraseña actualizada correctamente');
      handleClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'No se pudo actualizar la contraseña';
      showError('Error', msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Configuraciones</h2>

        {/* Tabs */}
        <div className="flex border-b mb-5">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'datos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('datos')}
          >
            Datos básicos
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'password' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('password')}
          >
            Cambiar contraseña
          </button>
        </div>

        {/* Datos básicos */}
        {activeTab === 'datos' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <InputCustom
              name="name"
              value={name}
              label="Nombre"
              onChange={onProfileChange}
              error={!!nameValid && profileSubmitted}
              helperText={profileSubmitted ? nameValid : ''}
            />
            <InputCustom
              name="lastName"
              value={lastName}
              label="Apellido"
              onChange={onProfileChange}
              error={!!lastNameValid && profileSubmitted}
              helperText={profileSubmitted ? lastNameValid : ''}
            />
            <InputCustom
              name="email"
              value={email}
              type="email"
              label="Correo electrónico"
              onChange={onProfileChange}
              error={!!emailValid && profileSubmitted}
              helperText={profileSubmitted ? emailValid : ''}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={handleClose} color="bg-gray-400" type="button">
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        )}

        {/* Cambiar contraseña */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <InputCustom
              name="currentPassword"
              value={currentPassword}
              type="password"
              label="Contraseña actual"
              onChange={onPasswordChange}
              error={!!currentPasswordValid && passwordSubmitted}
              helperText={passwordSubmitted ? currentPasswordValid : ''}
            />
            <InputCustom
              name="newPassword"
              value={newPassword}
              type="password"
              label="Nueva contraseña"
              onChange={onPasswordChange}
              error={!!newPasswordValid && passwordSubmitted}
              helperText={passwordSubmitted ? newPasswordValid : ''}
            />
            <InputCustom
              name="confirmPassword"
              value={confirmPassword}
              type="password"
              label="Confirmar nueva contraseña"
              onChange={onPasswordChange}
              error={!!confirmPasswordValid && passwordSubmitted}
              helperText={passwordSubmitted ? confirmPasswordValid : ''}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={handleClose} color="bg-gray-400" type="button">
                Cancelar
              </Button>
              <Button type="submit">Actualizar</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
