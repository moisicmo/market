import type { ProductPresentationModel } from "..";

export interface KardexModel {
  presentation: ProductPresentationModel;
  stock: number;
  kardex: any[];
}