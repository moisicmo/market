import type { BranchModel, CategoryModel, PriceModel, ProviderModel } from "..";

export interface ProductModel {
  id: string;
  code: string;
  name: string;
  description?: string;
  image?: string;
  barCode?: string;
  visible: boolean;
  category: CategoryModel;
  brand: BranchModel;
  prices: PriceModel[];
}