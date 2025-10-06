import type { ProductPresentationModel } from "..";

export interface KardexModel {
  presentation: ProductPresentationModel;
  stock: number;
  kardex: Movement[];
}


export interface Movement{
  stock: number;
  input: Input | null;
  output: Output | null;
}

interface Output {
  id: string;
  branchId: string;
  productPresentationId: string;
  quantity: number;
  price: number;
  detail: string;
  createdAt: Date;
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