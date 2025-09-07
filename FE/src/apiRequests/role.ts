import { http } from "@/utils/api";
import { IListDataResponse, IQueryBase } from "@/utils/interface/common";
import {
  IBodyRole,
  IBodyUpdateRolePermissions,
  IRolePermissions,
  IRolesRes,
} from "@/utils/interface/role";

const roleApiRequest = {
  list: (payload: IQueryBase) =>
    http.get<IListDataResponse<IRolesRes[]>>("role", {
      queryParams: payload,
    }),
  addRole: (body: IBodyRole) => http.post("role", body),
  updateRole: (id: string, body: IBodyRole) => http.put(`role/${id}`, body),
  getRoleById: (id: string) => http.get<IRolesRes>(`role/${id}`),
  deleteRole: (id: string) => http.delete(`role/${id}`),
  getRolePermissions: (id: string) =>
    http.get<IRolePermissions>(`role/role-permission/${id}`),
  updateRolePermissions: (id: string, body: IBodyUpdateRolePermissions) =>
    http.put(`role/${id}/permissions`, body),
};

export default roleApiRequest;
