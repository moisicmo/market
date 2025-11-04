import type { BranchModel } from "../response/branch.response";

export interface ProviderRequest {
  name: string;
}

interface FormProviderModel {
  name: string;
};
export const formProviderFields: FormProviderModel = {
  name: '',
};

interface FormProviderValidations {
  name: [(value: string) => boolean, string];
}
export const formProviderValidations: FormProviderValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
};