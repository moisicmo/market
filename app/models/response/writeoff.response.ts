import type { BranchModel } from './branch.response';
import type { WriteoffReason } from '../request/writeoff.request';

export interface WriteoffOutputModel {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    code: string | null;
  };
}

export interface WriteoffModel {
  id: string;
  reason: WriteoffReason;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  branch: BranchModel;
  outputs: WriteoffOutputModel[];
}
