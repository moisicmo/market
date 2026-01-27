import { formAddressInit, formAddressValidations, type AddressRequest, type FormAddressModel, type FormAddressValidations } from "./address.request";

export interface ProviderRequest extends AddressRequest {
  nit: string;
  phone: string[];
  name: string;
  contact: string;
}

interface FormProviderModel {
  nit: string;
  phone: string[];
  name: string;
  contact: string;
  address: FormAddressModel|null;
};

export const formProviderFields: FormProviderModel = {
  nit: '',
  phone: [],
  name: '',
  contact: '',
  address: formAddressInit,
};

interface FormProviderValidations {
  nit: [(value: string) => boolean, string];
  phone: [(value: string[]) => boolean, string];
  name: [(value: string) => boolean, string];
  contact: [(value: string) => boolean, string];
  address: FormAddressValidations;
}
export const formProviderValidations: FormProviderValidations = {
  nit: [(value) => value.length >= 1, 'Debe ingresar el nit'],
  phone: [(value) => value.length >= 1, 'Debe ingresar uno o varios telefonos'],
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  contact: [(value) => value.length >= 1, 'Debe ingresar el contacto'],
  address: formAddressValidations,
};