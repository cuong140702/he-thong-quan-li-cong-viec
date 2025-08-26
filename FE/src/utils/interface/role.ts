import { IPermissionsRes } from "./permission";

export interface IRolesRes {
  id: string;
  name: string;
  description: string | null;
  deletedAt: Date | null;
  permissions: IPermissionsRes;
}

export interface IRolePermissions {
  id: string;
  name: string;
  description: string | null;
  permissions: IPermissionsRes[];
}

export interface IBodyRole {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
}

export interface IBodyUpdateRolePermissions {
  permissions: string[];
}
