import type { BranchModel } from './branch.response';
import type { ProductModel } from './product.response';

export interface TransferModel {
  id: string;
  quantity: number;
  price: number;
  detail: string | null;
  createdAt: string;
  fromBranch: BranchModel;
  toBranch: BranchModel;
  product: ProductModel;
}
