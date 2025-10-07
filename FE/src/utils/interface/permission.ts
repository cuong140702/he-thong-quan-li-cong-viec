import { HTTPMethod } from "../enum/permission";

export interface IPermissionsRes {
  id: string;
  module: string;
  description?: string | null;
  path: string;
  method: HTTPMethod;
  roles: {
    id: string;
    name: string;
  };
}

export type Permission = {
  module: "task" | "tag" | "user" | "role" | "project" | "timelog";
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
};

export interface IBodyPermission {
  module: string;
  description?: string | null;
  path: string;
  method: HTTPMethod;
}

export interface IGetAllModule {
  module: string;
}
