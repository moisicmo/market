import type { BranchModel, CategoryModel } from "..";

export interface ProductModel {
  id: string;
  name: string;
  category: CategoryModel;
  branch: BranchModel;
  typeUnit: string;
  price: number;
  image: string;
}