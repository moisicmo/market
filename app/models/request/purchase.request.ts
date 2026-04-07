import type { ProductModel } from '../response/product.response';
import { PaymentType, TypeUnit } from '../enums';

// ── Request bodies (lo que se envía al backend) ──────────────────────────────

export interface PurchaseRequest {
  branchId: string;
  providerId: string;
  code: string;
  dischargeDate: Date;
  paymentType: PaymentType;
  totalAmount: number;
  items: PurchaseItemRequest[];
  installments?: InstallmentRequest[];
}

export interface PurchaseItemRequest {
  productId: string;
  quantity: number;
  price: number;
  typeUnit: TypeUnit;
  detail: string;
}

export interface InstallmentRequest {
  installmentNumber: number;
  amount: number;
  dueDate: Date;
}

// ── Form models (estado interno del formulario) ───────────────────────────────

export interface PurchaseItemFormModel {
  product: ProductModel;
  quantity: number;
  price: string;
  typeUnit: TypeUnit;
  dueDate?: Date;
}

export interface InstallmentFormModel {
  installmentNumber: number;
  amount: number;
  dueDate: Date;
}

// ── Campos iniciales del formulario ──────────────────────────────────────────

export const formPurchaseFields = {
  code: '',
  detail: 'compra',
};

// ── Validaciones ─────────────────────────────────────────────────────────────

interface FormPurchaseValidations {
  code: [(value: string) => boolean, string];
  detail: [(value: string) => boolean, string];
}

export const formPurchaseValidations: FormPurchaseValidations = {
  code: [(value) => value.length > 0, 'Debe ingresar un número de comprobante'],
  detail: [(value) => value.length > 0, 'Debe ingresar un detalle'],
};

interface PurchaseItemValidations {
  quantity: [(value: number) => boolean, string];
  price: [(value: string) => boolean, string];
}

export const purchaseItemValidations: PurchaseItemValidations = {
  quantity: [(value) => value > 0, 'La cantidad debe ser mayor a 0'],
  price: [(value) => Number(value) > 0, 'El precio debe ser mayor a 0'],
};
