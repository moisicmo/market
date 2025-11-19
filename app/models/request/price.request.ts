import { TypeUnit } from "../enums";
import type { BranchModel } from "../response/branch.response";

export interface PriceRequest {
  branchId: string;
  typeUnit: string;
  price: number;
}

export interface FormPriceModel {
  branch: BranchModel | null;
  typeUnit: TypeUnit | "";   // "" al inicio cuando no está seleccionado
  price: string;
}

export const formPriceFields: FormPriceModel = {
  branch: null,
  typeUnit: TypeUnit.UNIDAD,
  price: '',
};

export interface FormPriceValidations {
  branch: [(value: BranchModel) => boolean, string];
  typeUnit: [(value: TypeUnit | "") => boolean, string];
  price: [(value: string) => boolean, string];
}

export const formPriceValidations: FormPriceValidations = {
  branch: [(value) => value != null, 'Debe ingresar la sucursal'],
  typeUnit: [(value) => value !== "", 'Debe ingresar el tipo de unidad'],
  price: [(value) => value !== "", 'Debe ingresar el precio'],
};