import type { BranchModel, CategoryModel, PriceModel, TypeUnit } from "..";

export interface ProductModel {
  id: string;
  code: string;
  name: string;
  barCode?: string;
  category: CategoryModel;
  visible: boolean;
  image: string;
  productPresentations: ProductPresentationModel[];
}

export interface ProductPresentationModel {
  id: string;
  product?: ProductModel;
  name: string;
  typeUnit: TypeUnit;
  branch: BranchModel;
  prices: PriceModel[];
}