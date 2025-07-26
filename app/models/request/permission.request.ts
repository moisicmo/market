import type { TypeAction, TypeSubject } from "..";

export interface PermissionRequest {
  action: TypeAction;
  subject: TypeSubject;
  reason: string;
}

export interface FormPermissionModel {
  action: TypeAction | null;
  subject: TypeSubject | null ;
  reason: string;
}

export interface FormPermissionValidations {
  action: [(value: TypeAction) => boolean, string];
  subject: [(value: TypeSubject) => boolean, string];
  reason: [(value: string) => boolean, string];
}