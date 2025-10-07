import { http } from "@/utils/api";
import { IListDataResponse, IQueryBase } from "@/utils/interface/common";
import {
  IBodyPermission,
  IGetAllModule,
  IPermissionsRes,
} from "@/utils/interface/permission";

const permissionsApiRequest = {
  list: (payload: IQueryBase) =>
    http.get<IListDataResponse<IPermissionsRes[]>>("permission", {
      queryParams: payload,
    }),
  createPermission: (body: IBodyPermission) => http.post("permission", body),
  getPermissionById: (id: string) =>
    http.get<IPermissionsRes>(`permission/${id}`),
  updatePermission: (id: string, body: IBodyPermission) =>
    http.put(`permission/${id}`, body),
  deletePermission: (id: string) => http.delete(`permission/${id}`),
  getAllModule: () =>
    http.get<IBackendRes<IGetAllModule[]>>("permission/all-modules"),
};

export default permissionsApiRequest;
