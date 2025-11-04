import type { AddressModel } from "./address.response";

export interface BranchModel {
  id: string;
  name: string;
  address: AddressModel;
}