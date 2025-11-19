import type { BranchModel } from "./branch.response";

export interface PriceModel {
 id: string;
 price: number;
 typeUnit: string;
 branch: BranchModel;
}
