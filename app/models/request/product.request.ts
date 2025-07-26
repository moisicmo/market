import type { BranchModel } from "../response/branch.response";
import type { CategoryModel } from "../response/category.response";

export interface ProductRequest {
  categoryId: string;
  branchId: string;
  name: string;
  typeUnit: string;
  price: number;
}

interface FormProductModel {
  category: CategoryModel | null;
  branch: BranchModel | null;
  name: string;
  typeUnit: string;
  price: number;
};
export const formProductFields: FormProductModel = {
  category: null,
  branch: null,
  name: '',
  typeUnit: '',
  price: 0,
};

interface FormProductValidations {
  category: [(value: CategoryModel) => boolean, string];
  branch: [(value: BranchModel) => boolean, string];
  name: [(value: string) => boolean, string];
  typeUnit: [(value: string) => boolean, string];
  price: [(value: string) => boolean, string];
}
export const formProductValidations: FormProductValidations = {
  category: [(value) => value != null, 'Debe ingresar la categoria'],
  branch: [(value) => value != null, 'Debe ingresar la sucursal'],
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  typeUnit: [(value) => value.length > 0, 'Debe ingresar el número de sesiones'],
  price: [(value) => value.length > 0, 'Debe ingresar el costo estimado por sesión'],
};