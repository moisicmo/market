import type { PaymentModel, StaffModel } from "..";

export interface InvoiceModel {
  id: string;
  code: string;
  staff: StaffModel;
  url: string;
  buyerNit: string;
  buyerName: string;
  payments: PaymentModel[];
}
