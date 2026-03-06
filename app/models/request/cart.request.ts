
import type { CustomerModel, ProductModel } from "..";
export interface CartRequest {
  customerId: string;
  branchId: string;
  amount: number;
  paymentType?: 'CONTADO' | 'CUOTAS';
  amountPaid?: number;
  outputs: OputputRequest[];
}

export interface OputputRequest {
  productId: string;
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
  productModel: ProductModel;
  stock: number;
  quantity: number;
  price: number;
}