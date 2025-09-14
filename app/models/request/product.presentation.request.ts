import type { BranchModel } from "../response/branch.response";
import type { CategoryModel } from "../response/category.response";

export interface ProductPresentationRequest {
  productId: string;
  branchId: string;
  name: string;
  typeUnit: string;
  price: number;
}

interface FormProductPresentationModel {
  branch: BranchModel | null;
  name: string;
  typeUnit: string;
  price: number;
};
export const formProductPresentationFields: FormProductPresentationModel = {
  branch: null,
  name: '',
  typeUnit: '',
  price: 0,
};

interface FormProductPresentationValidations {
  branch: [(value: BranchModel) => boolean, string];
  name: [(value: string) => boolean, string];
  typeUnit: [(value: string) => boolean, string];
  price: [(value: string) => boolean, string];
}
export const formProductPresentationValidations: FormProductPresentationValidations = {
  branch: [(value) => value != null, 'Debe ingresar la sucursal'],
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  typeUnit: [(value) => value.length > 0, 'Debe ingresar el número de sesiones'],
  price: [(value) => value.length > 0, 'Debe ingresar el costo estimado por sesión'],
};