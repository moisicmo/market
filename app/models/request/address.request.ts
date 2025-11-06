export interface AddressRequest {
  city: string;
  zone: string;
  detail: string;
}

export interface FormAddressModel {
  city: string;
  zone: string;
  detail: string;
}

export const formAddressInit: FormAddressModel = {
  city: '',
  zone: '',
  detail: '',
};

export interface FormAddressValidations {
  city: [(value: string) => boolean, string];
  zone: [(value: string) => boolean, string];
  detail: [(value: string) => boolean, string];
}

export const formAddressValidations: FormAddressValidations = {
  city: [(value) => value.length > 0, 'Debe ingresar la ciudad'],
  zone: [(value) => value.length > 0, 'Debe ingresar la zona'],
  detail: [(value) => value.length > 0, 'Debe ingresar la direccion'],
};