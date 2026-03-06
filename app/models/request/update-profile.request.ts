export interface UpdateProfileRequest {
  name: string;
  lastName: string;
  email?: string;
}

export interface FormUpdateProfileModel {
  name: string;
  lastName: string;
  email: string;
}

export const formUpdateProfileInit: FormUpdateProfileModel = {
  name: '',
  lastName: '',
  email: '',
};

export interface FormUpdateProfileValidations {
  name: [(value: string) => boolean, string];
  lastName: [(value: string) => boolean, string];
  email: [(value: string) => boolean, string];
}

export const formUpdateProfileValidations: FormUpdateProfileValidations = {
  name: [(value) => value.trim().length > 0, 'Debe ingresar el nombre'],
  lastName: [(value) => value.trim().length > 0, 'Debe ingresar el apellido'],
  email: [(value) => value.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), 'El correo electrónico no es válido'],
};
