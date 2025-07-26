import type { RoleModel, UserModel } from "..";

export interface StaffModel{
  userId: string;
  role: RoleModel;
  user: UserModel;
}
