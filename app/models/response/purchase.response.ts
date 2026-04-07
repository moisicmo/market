import { PaymentType, TypeUnit } from '../enums';

export interface PurchaseInputModel {
  product: { name: string };
  quantity: number;
  price: number;
  typeUnit: TypeUnit;
  detail: string;
}

export interface PurchaseModel {
  id: string;
  code: string;
  dischargeDate: Date;
  paymentType: PaymentType;
  totalAmount: number;
  active: boolean;
  createdAt: Date;
  createdByName: string;
  provider: { id: string; name: string };
  branch: { id: string; name: string };
  inputs: PurchaseInputModel[];
  _count: { inputs: number; installments: number };
}

export type InstallmentStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface PayableModel {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  status: InstallmentStatus;
  createdAt: string;
  purchase: {
    id: string;
    code: string;
    totalAmount: number;
    provider: { name: string };
    branch: { id: string; name: string };
  };
}
