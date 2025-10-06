
import type { CustomerModel, ProductPresentationModel } from "..";
export interface CartRequest {
  customerId: string;
  branchId: string;
  amount: number;
  outputs: OputputRequest[];
}

export interface OputputRequest {
  productPresentationId: string;
  quantity: number;
  price: number;
}

export interface FormCartModel {
  customer: CustomerModel | null;
}

export const formCartInit: FormCartModel = {
  customer: null,
};
interface FormCartValidations {
  customer: [(value: CustomerModel) => boolean, string];
}

export const formCartValidations: FormCartValidations = {
  customer: [(value) => value !== null, 'Debe ingresar un cliente'],
};

// desde aqui vale
export interface CartItem {
  productPresentationModel: ProductPresentationModel;
  stock: number;
  quantity: number;
  price: number;
}