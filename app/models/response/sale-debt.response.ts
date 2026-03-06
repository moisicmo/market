import type { BranchModel } from './branch.response';

export type DebtStatus = 'PENDING' | 'PAID';
export type SalePayMethod = 'cash' | 'qr' | 'deposit';

export interface SalePaymentModel {
  id: string;
  debtId: string;
  amount: number;
  payMethod: SalePayMethod;
  notes: string | null;
  createdAt: string;
  createdBy: string;
}

export interface SaleDebtModel {
  id: string;
  totalAmount: number;
  paidAmount: number;
  status: DebtStatus;
  active: boolean;
  createdAt: string;
  order: { id: string; amount: number; paymentType: string; createdAt: string };
  customer: { user: { name: string; lastName: string; numberDocument: string } };
  branch: BranchModel;
  payments: SalePaymentModel[];
}

export interface SalePaymentRequest {
  amount: number;
  payMethod?: SalePayMethod;
  notes?: string;
}
