import type { BranchModel } from "./branch.response";

export interface PriceModel {
 id: string;
 price: number;
 promoPrice: number;
 typeUnit: string;
 branch: BranchModel;
}
