import type { TypeAction, TypeSubject } from "..";


export interface PermissionModel {
  id: string;
  action: TypeAction;
  subject: TypeSubject;
}
