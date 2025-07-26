import { type BranchModel, type FormUserModel, type FormUserValidations, type RoleModel, type UserRequest } from "..";


export interface StaffRequest extends UserRequest {
  roleId: string;
  branchIds: string[];
}

export interface FormStaffModel {
  user: FormUserModel,
  role: RoleModel | null;
  branches: BranchModel[];
}
export const formStaffInit: FormStaffModel = {
  user: {
    numberDocument: '',
    name: '',
    lastName: '',
    email: '',
  },
  role: null,
  branches: [],
};

export interface FormStaffValidations {
  user: FormUserValidations;
  role: [(value: RoleModel) => boolean, string];
  branches: [(value: BranchModel[]) => boolean, string];
}

export const formStaffValidations: FormStaffValidations = {
  user: {
    numberDocument: [(value) => value.length > 0, 'Debe ingresar el número de documento'],
    name: [(value) => value.length > 0, 'Debe ingresar el nombre'],
    lastName: [(value) => value.length > 0, 'Debe ingresar el apellido'],
    email: [(value) => value.length > 0, 'Debe ingresar el correo electrónico'],
  },
  role: [(value) => value != null, 'Debe ingresar un rol'],
  branches: [(value) => value.length > 0, 'Debe ingresar al menos una sucursal'],
};