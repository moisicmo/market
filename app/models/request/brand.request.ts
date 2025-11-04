import type { BranchModel } from "../response/branch.response";

export interface BrandRequest {
  name: string;
}

interface FormBrandModel {
  name: string;
};
export const formBrandFields: FormBrandModel = {
  name: '',
};

interface FormBrandValidations {
  name: [(value: string) => boolean, string];
}
export const formBrandValidations: FormBrandValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
};