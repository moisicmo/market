import type { ProductModel } from "./product.response";
import type { ProviderModel } from "./provider.response";

export interface KardexModel {
  product: ProductModel;
  stock: number;
  kardex: Movement[];
}


export interface Movement {
  stock: number;
  input: Input | null;
  output: Output | null;
}

export interface TransferResponse {
  from: {
    stock: number;
    output: Output;
  };
  to: {
    stock: number;
    input: Input;
  };
  transfer: {
    id: string;
    fromBranchId: string;
    toBranchId: string;
    productPresentationId: string;
    quantity: number;
    price: number;
    detail: string;
    createdAt: Date;
  };
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
  provider: ProviderModel;
  quantity: number;
  price: number;
  dueDate: Date;
  detail: string;
  createdAt: Date;
}