import type { BranchModel } from './branch.response';
import type { CustomerModel } from './customer.response';
import type { StaffModel } from './staff.response';
import type { ProductModel } from './product.response';

export interface OrderOutputModel {
  id: string;
  orderId: string;
  quantity: number;
  price: number;
  detail: string;
  createdAt: string;
  branch: BranchModel;
  product: ProductModel;
}

export interface OrderModel {
  id: string;
  staff: StaffModel;
  customer: CustomerModel;
  branch: BranchModel;
  amount: number;
  stateSold: boolean;
  stateAnulled: boolean;
  delivered: boolean;
  url: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  outputs: OrderOutputModel[];
}
