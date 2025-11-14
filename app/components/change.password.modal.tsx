import { InputCustom } from './input.custom';
import { useForm, useAuthStore } from '@/hooks';
import { useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";

interface ChangePasswordModalProps {
  isOpen: boolean;
}

export const ChangePasswordModal = ({ isOpen }: ChangePasswordModalProps) => {
  console.log('ChangePasswordModal - isOpen:', isOpen);
  const { startChangePassword, onSetShowPasswordChangeModal } = useAuthStore();
  const memoizedInitialForm = useMemo(() => ({ newPassword: '' }), []);
  const memoizedValidations = useMemo(() => ({}), []);
  const { newPassword, onInputChange, onResetForm } = useForm(
    memoizedInitialForm,
    memoizedValidations
  );

  useEffect(() => {
    if (!isOpen) {
      onResetForm();
    }
  }, [isOpen, onResetForm]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    try {
      const result = await startChangePassword(newPassword);
      if (result.success) {
        alert('Contraseña cambiada exitosamente. Por favor, inicia sesión de nuevo.');
        onSetShowPasswordChangeModal(false);
      }
    } catch (error) {
      alert('Error al cambiar la contraseña.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Cambiar Contraseña</h2>
        <p className="text-gray-700 mb-6 text-center">Es tu primer inicio de sesión o se requiere un cambio de contraseña. Por favor, establece una nueva contraseña.</p>
        <form onSubmit={onSubmit}>
          <InputCustom
            label="Nueva Contraseña"
            name="newPassword"
            value={newPassword}
            onChange={onInputChange}
            type="password"
            placeholder="Ingresa tu nueva contraseña"
          />
          <div className="mt-6">
            <Button type="submit" className="w-full">
              Cambiar Contraseña
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};



