import type { PermissionModel } from "..";

export interface RoleModel {
  id: string;
  name: string;
  permissions: PermissionModel[];
}
