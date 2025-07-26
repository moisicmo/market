import type { DebtModel, PayMethod } from "..";

export interface PaymentModel {
  id: string;
  debt: DebtModel;
  reference?: string|null;
  amount: number;
  payMethod: PayMethod;
  createdAt: Date;
}
