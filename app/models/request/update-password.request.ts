export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface FormUpdatePasswordModel {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const formUpdatePasswordInit: FormUpdatePasswordModel = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export interface FormUpdatePasswordValidations {
  currentPassword: [(value: string) => boolean, string];
  newPassword: [(value: string) => boolean, string];
  confirmPassword: [(value: string) => boolean, string];
}

export const formUpdatePasswordValidations: FormUpdatePasswordValidations = {
  currentPassword: [(value) => value.length > 0, 'Debe ingresar la contraseña actual'],
  newPassword: [(value) => value.length >= 8, 'La nueva contraseña debe tener al menos 8 caracteres'],
  confirmPassword: [(value) => value.length > 0, 'Debe confirmar la contraseña'],
};
