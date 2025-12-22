import { formAddressInit, formAddressValidations, type AddressRequest, type FormAddressModel, type FormAddressValidations } from "./address.request";

export interface BranchRequest extends AddressRequest {
  type: string;
  name: string;
  bankAccount: string;
  phone: string[];
}
export interface FormBranchModel {
  type: 'sucursal' | 'deposito';
  name: string;
  bankAccount: string;
  phone: string[];
  address: FormAddressModel | null;
};

export const formBranchFields: FormBranchModel = {
  type: 'sucursal',
  name: '',
  bankAccount: '',
  phone: [],
  address: formAddressInit,
};


interface FormBranchValidations {
  type: [(value: 'sucursal' | 'deposito') => boolean, string];
  name: [(value: string) => boolean, string];
  bankAccount: [(value: string) => boolean, string];
  phone: [(value: string[]) => boolean, string];
  address: FormAddressValidations;
}

export const formBranchValidations: FormBranchValidations = {
  type: [(value) => value === 'sucursal' || value === 'deposito', 'Debe seleccionar el tipo de sucursal'],
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  bankAccount: [(value) => value != null && value.length >= 1, 'Debe ingresar el nombre'],
  phone: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  address: formAddressValidations,
};
