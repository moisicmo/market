
import type { PaymentRequest } from "..";
export interface CartRequest {
  buyerNit: string;
  buyerName: string;
  payments: PaymentRequest[];
}

export interface FormCartModel {
  buyerNit: string;
  buyerName: string;
}

export const formCartInit: FormCartModel = {
  buyerNit: '',
  buyerName: '',
};
interface FormCartValidations {
  buyerNit: [(value: string) => boolean, string];
  buyerName: [(value: string) => boolean, string];
}

export const formCartValidations: FormCartValidations = {
  buyerNit: [(value) => value.length > 0, 'Debe ingresar un número de facturación'],
  buyerName: [(value) => value.length > 0, 'Debe ingresar un nombre de facturación'],
};
