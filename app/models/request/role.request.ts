import type { FormPermissionModel, FormPermissionValidations, PermissionRequest } from "..";

export interface RoleRequest {
  name: string;
  permissions: PermissionRequest[];
}

export interface FormRoleModel {
  name: string;
  permissions: FormPermissionModel[];
}

export const formRoleInit: FormRoleModel = {
  name: '',
  permissions: [
    {
      action: null,
      subject: null,
      reason: '',
    }
  ],
};

export interface FormRoleValidations {
  name: [(value: string) => boolean, string];
  permissions: [(value: FormPermissionValidations[]) => boolean, string];
}


export const formRoleValidations: FormRoleValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  permissions: [(value) => value.length > 0, 'Debe ingresar almenos 1 permiso'],
};