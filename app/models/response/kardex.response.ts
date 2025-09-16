import type { ProductPresentationModel } from "..";

export interface KardexModel {
  presentation: ProductPresentationModel;
  stock: number;
  kardex: Movement[];
}


export interface Movement{
  stock: number;
  input: Input;
}

interface Input {
  id: string;
  branchId: string;
  productPresentationId: string;
  quantity: number;
  price: number;
  dueDate: Date;
  detail: string;
  createdAt: Date;
}