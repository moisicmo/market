import type { AddressModel } from "..";

export interface ProviderModel {
  id: string;
  name: string;
  nit: string;
  phone: string[];
  contact: string;
  address: AddressModel | null;
}