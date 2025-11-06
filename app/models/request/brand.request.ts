import type { BranchModel } from "../response/branch.response";

export interface BrandRequest {
  name: string;
  description: string;
}

interface FormBrandModel {
  name: string;
  description: string;
};
export const formBrandFields: FormBrandModel = {
  name: '',
  description: '',
};

interface FormBrandValidations {
  name: [(value: string) => boolean, string];
  description: [(value: string) => boolean, string];
}
export const formBrandValidations: FormBrandValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  description: [(value) => value.length >= 1, 'Debe ingresar una descripción'],
};