import type { AddressModel } from "../response/address.response";
import type { AddressRequest, FormAddressValidations } from "./address.request";

export interface BranchRequest extends AddressRequest{
  name: string;
  bankAccount: string;
  phone: string[];
}
export interface FormBranchModel extends AddressModel{
  name: string;
  bankAccount: string;
  phone: string[];
};

export const formBranchFields: FormBranchModel = {
  name: '',
  city: '',
  zone: '',
  detail: '',
  bankAccount: '',
  phone:[],
};


interface FormBranchValidations extends FormAddressValidations{
  name: [(value: string) => boolean, string];
  bankAccount: [(value: string) => boolean, string];
  phone: [(value: string[]) => boolean, string];
}

export const formBranchValidations: FormBranchValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  city: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  zone: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  detail: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  bankAccount: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  phone: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
};
