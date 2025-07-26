
export interface BranchRequest {
  name: string;
  address: string;
}
export interface FormBranchModel {
  name: string;
  address: string;
};

export const formBranchFields: FormBranchModel = {
  name: '',
  address: '',
};


interface FormBranchValidations {
  name: [(value: string) => boolean, string];
  address: [(value: string) => boolean, string];
}

export const formBranchValidations: FormBranchValidations = {
  name: [(value) => value.length >= 1, 'Debe ingresar el nombre'],
  address: [(value) => value.length > 0 && value.length > 0, 'Debe ingresar el correo electrónico'],
};
