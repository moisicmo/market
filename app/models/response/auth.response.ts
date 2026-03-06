import type { RoleModel, BranchModel } from "..";

export interface AuthModel {
  id: number;
  name: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
  role: RoleModel[];
  branches: BranchModel[];
}
