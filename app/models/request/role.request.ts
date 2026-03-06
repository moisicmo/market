import type { FormPermissionValidations, PermissionModel } from "..";

export interface RoleRequest {
  name: string;
  permissionIds: string[];
}

export interface FormRoleModel {
  name: string;
  permissions: PermissionModel[];
}

export const formRoleInit: FormRoleModel = {
  name: '',
  permissions: [],
};

export interface FormRoleValidations {
  name: [(value: string) => boolean, string];
  permissions: [(value: FormPermissionValidations[]) => boolean, string];
}


export const formRoleValidations: FormRoleValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  permissions: [(value) => value.length > 0, 'Debe ingresar almenos 1 permiso'],
};