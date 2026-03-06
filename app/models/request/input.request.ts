import type { ProductModel } from "../response/product.response";
import { TypeUnit } from "../enums";

// request
export interface InputRequest {
  branchId: string;
  detail: string;
  products: ProductInputRequest[];
}

export interface ProductInputRequest {
  productId: string;
  quantity: number;
  price: number;
  typeUnit: TypeUnit;
}

// model
interface FormInputModel {
  detail: string;
  products: ProductModel[];
};

export interface ProductInputModel {
  product: ProductModel;
  quantity: number;
  price: number;
  typeUnit: TypeUnit;
  dueDate: Date;
}

export const formInputFields: FormInputModel = {
  detail: 'compra',
  products: [],
};

// validaciones
interface FormInputValidations {
  detail: [(value: string) => boolean, string];
}
export const formInputValidations: FormInputValidations = {
  detail: [(value) => value.length > 0, 'Debe ingresar un detalle de ingreso'],
};
// validaciones de cada presentación individual
interface ProductValidations {
  product: [(value: ProductModel | null) => boolean, string];
  quantity: [(value: number) => boolean, string];
  price: [(value: number) => boolean, string];
}

export const productValidations: ProductValidations = {
  product: [(value) => value != null, 'Debe seleccionar una presentación de producto'],
  quantity: [(value) => value > 0, 'La cantidad debe ser mayor a 0'],
  price: [(value) => value > 0, 'El precio debe ser mayor a 0'],
};
