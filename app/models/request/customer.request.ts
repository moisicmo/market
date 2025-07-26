import { formUserInit, formUserValidations, type FormUserModel, type FormUserValidations, type UserRequest } from "..";



export interface CustomerRequest extends UserRequest {

}

export interface FormCustomerModel {
  user: FormUserModel,
}

export const formCustomerInit: FormCustomerModel = {
  user: formUserInit,
};

export interface FormCustomerValidations{
  user: FormUserValidations;
}

export const formCustomerValidations: FormCustomerValidations = {
  user: formUserValidations,
};