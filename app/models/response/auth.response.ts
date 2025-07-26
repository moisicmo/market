import type { RoleModel, BranchModel } from "..";

export interface AuthModel {
  id: number;
  name: string;
  lastName: string;
  email: number;
  token: string;
  refreshToken: string;
  role: RoleModel[];
  branches: BranchModel[];
}
