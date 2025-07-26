import type { CityModel } from "..";



export interface AddressRequest {
  cityId: string;
  zone: string;
  detail: string;
}

export interface FormAddressModel {
  city: CityModel | null;
  zone: string;
  detail: string;
}

export const formAddressInit: FormAddressModel = {
  city: null,
  zone: '',
  detail: '',
};

export interface FormAddressValidations {
  city: [(value: CityModel) => boolean, string];
  zone: [(value: string) => boolean, string];
  detail: [(value: string) => boolean, string];
}

export const formAddressValidations: FormAddressValidations = {
  city: [(value) => value != null, 'Debe ingresar la ciudad'],
  zone: [(value) => value.length > 0, 'Debe ingresar la zona'],
  detail: [(value) => value.length > 0, 'Debe ingresar la direccion'],
};