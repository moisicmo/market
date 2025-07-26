import type { BranchModel } from "../response/branch.response";

export interface CategoryRequest {
  name: string;
}

interface FormCategoryModel {
  name: string;
};
export const formCategoryFields: FormCategoryModel = {
  name: '',
};

interface FormCategoryValidations {
  name: [(value: string) => boolean, string];
}
export const formCategoryValidations: FormCategoryValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
};