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
  module: "task" | "tag";
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
};
