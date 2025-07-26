import type { InscriptionModel, PaymentModel, TypeDebt } from "..";
export interface DebtModel {
  id: string;
  inscription: InscriptionModel;
  type: TypeDebt;
  totalAmount: number;
  remainingBalance: number;
  createdAt: Date;
  dueDate?: Date;
  payments: PaymentModel[];
}
