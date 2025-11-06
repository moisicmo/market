import { formAddressInit, formAddressValidations, type AddressRequest, type FormAddressModel, type FormAddressValidations } from "./address.request";

export interface BranchRequest extends AddressRequest {
  name: string;
  bankAccount: string;
  phone: string[];
}
export interface FormBranchModel {
  name: string;
  bankAccount: string;
  phone: string[];
  address: FormAddressModel | null;
};

export const formBranchFields: FormBranchModel = {
  name: '',
  bankAccount: '',
  phone: [],
  address: formAddressInit,
};


interface FormBranchValidations {
  name: [(value: string) => boolean, string];
  bankAccount: [(value: string) => boolean, string];
  phone: [(value: string[]) => boolean, string];
  address: FormAddressValidations;
}

export const formBranchValidations: FormBranchValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  bankAccount: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  phone: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  address: formAddressValidations,
};
